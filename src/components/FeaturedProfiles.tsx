import ProfileCard from "./ProfileCard";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import AuthModal from "./AuthModal";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface FeaturedProfile {
  id: number;
  name: string;
  caste: string;
  dateOfBirth: string;
  height: number;
  occupation: string;
  income: string;
  gotra: string;
  education: string;
  religion: string;
  manglik: string;
  images: { url: string }[];
  isLiked?: boolean;
  featured?: boolean;
}

const FeaturedProfiles = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [profiles, setProfiles] = useState<FeaturedProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likingInProgress, setLikingInProgress] = useState<Set<number>>(new Set());
  const navigate = useNavigate();
  const { toast } = useToast();

  // Cache key for featured profiles
  const CACHE_KEY = 'featured_profiles_cache';
  const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const getCachedData = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();

        // Check if cache is still valid (within 30 minutes)
        if (now - timestamp < CACHE_DURATION) {
          return data;
        } else {
          // Cache expired, remove it
          localStorage.removeItem(CACHE_KEY);
        }
      }
    } catch (error) {
      console.error('Error reading cache:', error);
      localStorage.removeItem(CACHE_KEY);
    }
    return null;
  };

  const setCachedData = (data: FeaturedProfile[]) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

      // Preload images for better performance
      preloadImages(data);
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  };

  const preloadImages = (profiles: FeaturedProfile[]) => {
    profiles.forEach(profile => {
      if (profile.images && profile.images.length > 0) {
        profile.images.forEach(img => {
          const image = new Image();
          image.src = img.url;
        });
      }
    });
  };

  const fetchFeaturedProfiles = async (force: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);

      // Check cache first
      const cachedData = getCachedData();
      if (cachedData && !force) {
        setProfiles(cachedData);
        setIsLoading(false);
        // Preload images from cache
        preloadImages(cachedData);
        return;
      }

      // Check if user is logged in
      const token = localStorage.getItem('prembandhanToken');
      
      // Prepare headers - include Authorization if token exists
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('https://pb-app-lac.vercel.app/api/v1/public/featured', {
        method: 'GET',
        headers: headers.Authorization ? headers : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.profiles) {
        setProfiles(data.profiles);
        // Cache the data
        setCachedData(data.profiles);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching featured profiles:', error);
      setError('Failed to load featured profiles. Please try again later.');

      // Fallback to cached data even if expired
      const cachedData = getCachedData();
      // if (cachedData) {
      //   setProfiles(cachedData);
      // }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProfiles();
  }, []);

  const handleRegisterClick = () => {
    setShowAuthModal(true);
  };

  const handleViewProfile = (profileId: number) => {
    navigate(`/profile/${profileId}`);
  };

  const handleLike = async (profileId: number, profileName: string) => {
    const token = localStorage.getItem('prembandhanToken');

    if (!token) {
      setShowAuthModal(true);
      toast({
        title: 'Login Required',
        description: 'You can only like profiles when you are logged in',
        variant: 'destructive',
      });
      return;
    }

    const profile = profiles.find(p => p.id === profileId);
    if (profile?.isLiked) {
      toast({ title: 'Already Liked', description: `You have already liked ${profileName}'s profile` });
      return;
    }

    setLikingInProgress(prev => new Set(prev).add(profileId));

    try {
      const response = await fetch(`https://pb-app-lac.vercel.app/api/v1/profiles/${profileId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, isLiked: true } : p));
        toast({ title: 'Success', description: `You liked ${profileName}'s profile!` });
      } else if (response.status === 401) {
        setShowAuthModal(true);
        toast({ title: 'Login Required', description: 'You can only like profiles when you are logged in', variant: 'destructive' });
      } else {
        toast({ title: 'Error', description: 'Failed to like profile. Please try again.', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error liking profile:', error);
      toast({ title: 'Error', description: 'Failed to like profile. Please try again.', variant: 'destructive' });
    } finally {
      setLikingInProgress(prev => {
        const newSet = new Set(prev);
        newSet.delete(profileId);
        return newSet;
      });
    }
  };

  return (
    <>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <section className="py-20 bg-gradient-to-br from-warm-white via-white to-rose/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-rose/10 rounded-full px-6 py-2 mb-6">
              <span className="w-2 h-2 bg-rose rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-rose">Featured This Week</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Meet Your Perfect Match in{" "}
              <span className="text-rose">Gorakhpur</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover verified profiles of potential life partners from Gorakhpur and surrounding areas.
              Each profile is carefully verified to ensure authenticity and quality.
            </p>
          </div>

          {/* Profiles Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="group">
                  <div className="bg-gradient-card rounded-xl overflow-hidden shadow-card w-full max-w-sm mx-auto animate-pulse">
                    <div className="aspect-[4/5] bg-gray-300"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-300 rounded w-full"></div>
                        <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-8 bg-gray-300 rounded flex-1"></div>
                        <div className="h-8 bg-gray-300 rounded flex-1"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="text-red-500 text-lg mb-4">{error}</div>
              <Button
                onClick={() => fetchFeaturedProfiles(true)}
                variant="outline"
                className="mx-auto"
              >
                Try Again
              </Button>
            </div>
          ) : profiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {profiles.map((profile) => (
                <div key={profile.id} className="group">
                  <ProfileCard
                    name={profile.name}
                    age={calculateAge(profile.dateOfBirth)}
                    height={profile.height.toString()}
                    religion={profile.religion}
                    caste={profile.caste}
                    city="Gorakhpur" // Default city since not provided in API
                    education={profile.education}
                    occupation={profile.occupation}
                    image={profile.images && profile.images.length > 0 ? profile.images[0].url : '/placeholder.svg'}
                    isVerified={true}
                    isFeatured={true}
                    isNew={false}
                    profileId={profile.id}
                    onLike={handleLike}
                    onViewProfile={handleViewProfile}
                    isLiked={Boolean(profile.isLiked)}
                    isLiking={likingInProgress.has(profile.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-500 text-lg">No featured profiles available at the moment.</div>
            </div>
          )}

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-rose/10 to-gold/10 rounded-3xl p-8 md:p-12 text-center border border-rose/20">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to Find Your Life Partner?
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of happy couples who found their perfect match through our platform.
              Start your journey today with verified profiles from Gorakhpur.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="hero"
                size="lg"
                className="text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={handleRegisterClick}
              >
                View All Profiles
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg font-semibold border-2 hover:bg-rose hover:border-rose hover:text-white transition-all duration-200"
                onClick={handleRegisterClick}
              >
                Register Free
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturedProfiles;