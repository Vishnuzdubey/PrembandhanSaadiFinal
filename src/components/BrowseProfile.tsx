import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Briefcase, Calendar, Filter, Search, Star, Shield, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthModal from './AuthModal';

interface ProfileImage {
  url: string;
}

interface Profile {
  id: number;
  name: string;
  gender: string;
  caste: string;
  dateOfBirth?: string; // Optional since search API doesn't return this
  height: number;
  weight?: number;
  occupation?: string; // Optional since search API doesn't return this
  income: string;
  gotra?: string; // Optional since search API doesn't return this
  education: string;
  religion: string;
  manglik?: string; // Optional since search API doesn't return this
  state?: string;
  district?: string;
  featured?: boolean;
  isLiked?: boolean;
  images: ProfileImage[];
}

interface BrowseProfilesProps {
  onViewProfile?: (profileId: string) => void;
}

const BrowseProfile: React.FC<BrowseProfilesProps> = ({ onViewProfile }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({});
  const [likingInProgress, setLikingInProgress] = useState<Set<number>>(new Set());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [filters, setFilters] = useState({
    gender: '',
    ageFrom: '',
    ageTo: '',
    religion: '',
    education: '',
    occupation: '',
    income: '',
    caste: '',
    minHeight: '',
    maxHeight: '',
    minWeight: '',
    maxWeight: '',
    state: '',
    district: '',
    featured: false
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    if (!dateOfBirth) return 0;

    const today = new Date();
    const birthDate = new Date(dateOfBirth);

    // Check if the date is valid
    if (isNaN(birthDate.getTime())) {
      console.warn('Invalid date of birth:', dateOfBirth);
      return 0;
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age < 0 ? 0 : age;
  };

  // Check authentication and fetch profiles
  useEffect(() => {
    const checkAuthAndFetchProfiles = async () => {
      const token = localStorage.getItem('prembandhanToken');

      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please register or login to browse profiles",
          variant: "destructive",
        });
        // Navigate to register/login page
        setTimeout(() => {
          navigate('/');
        }, 2000);
        return;
      }

      try {
        setLoading(true);

        // Check if this is a search request
        const urlParams = new URLSearchParams(location.search);
        const isSearch = urlParams.get('search') === 'true';

        // Update local filters from URL parameters if it's a search
        if (isSearch) {
          const newFilters = { ...filters };

          // Map URL parameters to filter state
          if (urlParams.get('gender')) newFilters.gender = urlParams.get('gender') || '';
          if (urlParams.get('minAge')) newFilters.ageFrom = urlParams.get('minAge') || '';
          if (urlParams.get('maxAge')) newFilters.ageTo = urlParams.get('maxAge') || '';
          if (urlParams.get('caste')) newFilters.caste = urlParams.get('caste') || '';
          if (urlParams.get('religion')) newFilters.religion = urlParams.get('religion') || '';
          if (urlParams.get('education')) newFilters.education = urlParams.get('education') || '';
          if (urlParams.get('income')) newFilters.income = urlParams.get('income') || '';
          if (urlParams.get('state')) newFilters.state = urlParams.get('state') || '';
          if (urlParams.get('district')) newFilters.district = urlParams.get('district') || '';
          if (urlParams.get('minHeight')) newFilters.minHeight = urlParams.get('minHeight') || '';
          if (urlParams.get('maxHeight')) newFilters.maxHeight = urlParams.get('maxHeight') || '';
          if (urlParams.get('minWeight')) newFilters.minWeight = urlParams.get('minWeight') || '';
          if (urlParams.get('maxWeight')) newFilters.maxWeight = urlParams.get('maxWeight') || '';
          if (urlParams.get('featured')) newFilters.featured = urlParams.get('featured') === 'true';

          setFilters(newFilters);
        }

        let apiUrl = 'https://pb-app-lac.vercel.app/api/v1/public/profiles';

        if (isSearch) {
          // Build search API URL with filters
          apiUrl = 'https://pb-app-lac.vercel.app/api/v1/profiles/search';

          // Remove the search flag from params before sending to API
          urlParams.delete('search');

          // Normalize certain params: gender should be upper-case (MALE/FEMALE)
          if (urlParams.get('gender')) {
            const g = urlParams.get('gender') || '';
            urlParams.set('gender', String(g).toUpperCase());
          }

          // Normalize other string-based filters to lower-case to keep matching robust
          const lowercaseKeys = ['caste', 'religion', 'education', 'income', 'district', 'state'];
          lowercaseKeys.forEach(k => {
            if (urlParams.get(k)) {
              urlParams.set(k, String(urlParams.get(k)).toLowerCase());
            }
          });

          if (urlParams.toString()) {
            apiUrl += `?${urlParams.toString()}`;
          }
        }

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (data.success && (data.profiles || data.data)) {
          const profileData = data.profiles || data.data || [];
          setProfiles(profileData);
          // Initialize image index for each profile
          const imageIndexes: { [key: number]: number } = {};
          profileData.forEach((profile: Profile) => {
            imageIndexes[profile.id] = 0;
          });
          setCurrentImageIndex(imageIndexes);

          if (isSearch) {
            toast({
              title: "Search Results",
              description: `Found ${profileData.length} profile(s) matching your criteria`,
            });
          }
        } else {
          setProfiles([]);
          if (isSearch) {
            toast({
              title: "No Results",
              description: "No profiles found matching your search criteria",
            });
          } else {
            toast({
              title: "Error",
              description: "Failed to fetch profiles",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
        toast({
          title: "Error",
          description: "Failed to fetch profiles. Please try again.",
          variant: "destructive",
        });
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchProfiles();
  }, [toast, navigate, location.search]);

  // Handle image navigation for slider
  const nextImage = (profileId: number, imageCount: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [profileId]: (prev[profileId] + 1) % imageCount
    }));
  };

  const prevImage = (profileId: number, imageCount: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [profileId]: prev[profileId] === 0 ? imageCount - 1 : prev[profileId] - 1
    }));
  };

  const handleViewProfile = (profileId: number) => {
    navigate(`/profile/${profileId}`);
  };

  const handleLike = async (profileId: number, profileName: string) => {
    const token = localStorage.getItem('prembandhanToken');

    if (!token) {
      setShowAuthModal(true);
      toast({
        title: "Login Required",
        description: "You can only like profiles when you are logged in",
        variant: "destructive",
      });
      return;
    }

    // Find the profile to check if it's already liked
    const profile = profiles.find(p => p.id === profileId);
    if (profile?.isLiked) {
      toast({
        title: "Already Liked",
        description: `You have already liked ${profileName}'s profile`,
      });
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
        // Update the specific profile's isLiked status
        setProfiles(prev => prev.map(p =>
          p.id === profileId ? { ...p, isLiked: true } : p
        ));
        toast({
          title: "Success",
          description: `You liked ${profileName}'s profile!`,
        });
      } else if (response.status === 401) {
        setShowAuthModal(true);
        toast({
          title: "Login Required",
          description: "You can only like profiles when you are logged in",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to like profile. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLikingInProgress(prev => {
        const newSet = new Set(prev);
        newSet.delete(profileId);
        return newSet;
      });
    }
  };

  // Apply filters
  const filteredProfiles = profiles.filter(profile => {
    const age = profile.dateOfBirth ? calculateAge(profile.dateOfBirth) : null;

    // Search term filter
    const matchesSearch = !searchTerm ||
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (profile.occupation && profile.occupation.toLowerCase().includes(searchTerm.toLowerCase())) ||
      profile.education.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.religion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.caste.toLowerCase().includes(searchTerm.toLowerCase());

    // Gender filter (exact match, API expects MALE/FEMALE)
    const matchesGender = !filters.gender || profile.gender === filters.gender;

    // Age filter
    const matchesAge = age === null ||
      ((!filters.ageFrom || age >= parseInt(filters.ageFrom)) &&
        (!filters.ageTo || age <= parseInt(filters.ageTo)));

    // Basic filters (case-insensitive where applicable)
    const matchesReligion = !filters.religion || (profile.religion && profile.religion.toLowerCase() === String(filters.religion).toLowerCase());
    const matchesEducation = !filters.education || (profile.education && profile.education.toLowerCase() === String(filters.education).toLowerCase());
    const matchesOccupation = !filters.occupation || (profile.occupation && profile.occupation.toLowerCase() === String(filters.occupation).toLowerCase());
    const matchesCaste = !filters.caste || (profile.caste && profile.caste.toLowerCase() === String(filters.caste).toLowerCase());

    // Advanced filters
    const matchesIncome = !filters.income || (profile.income && profile.income.toLowerCase() === String(filters.income).toLowerCase());
    const matchesHeight = (!filters.minHeight || profile.height >= parseFloat(filters.minHeight)) &&
      (!filters.maxHeight || profile.height <= parseFloat(filters.maxHeight));

    // Weight filtering (assuming weight field exists in profile data structure)
    const matchesWeight = (!filters.minWeight || (profile.weight && profile.weight >= parseFloat(filters.minWeight))) &&
      (!filters.maxWeight || (profile.weight && profile.weight <= parseFloat(filters.maxWeight)));

    // Location filters (assuming state and district fields exist in profile data structure)  
    const matchesState = !filters.state || (profile.state && profile.state.toLowerCase() === String(filters.state).toLowerCase());
    const matchesDistrict = !filters.district || (profile.district && profile.district.toLowerCase().includes(String(filters.district).toLowerCase()));

    // Featured filter
    const matchesFeatured = !filters.featured || profile.featured === filters.featured;

    return matchesSearch && matchesGender && matchesAge && matchesReligion && matchesEducation &&
      matchesOccupation && matchesCaste && matchesIncome && matchesHeight && matchesWeight &&
      matchesState && matchesDistrict && matchesFeatured;
  });

  const handleFilterChange = (filterName: string, value: string | boolean) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));

    // Immediately update URL params so search API is invoked (search=true)
    try {
      const params = new URLSearchParams(location.search);
      // start fresh if not already a search
      if (!params.get('search')) {
        params.delete('');
      }

      // Set the changed filter in params
      const v = value;
      if (filterName === 'featured') {
        params.set('featured', String(Boolean(v)));
      } else if (filterName === 'gender') {
        // Keep gender as upper-case MALE/FEMALE
        params.set('gender', String(v).toUpperCase());
      } else if (filterName === 'ageFrom') {
        if (typeof v === 'string' && v !== '') params.set('minAge', String(v)); else params.delete('minAge');
      } else if (filterName === 'ageTo') {
        if (typeof v === 'string' && v !== '') params.set('maxAge', String(v)); else params.delete('maxAge');
      } else {
        // Lowercase string fields for robustness
        if (typeof v === 'string' && v !== '') {
          params.set(filterName, String(v).toLowerCase());
        } else if (typeof v === 'string' && v === '') {
          params.delete(filterName);
        }
      }

      // Ensure search flag
      params.set('search', 'true');

      navigate({ pathname: location.pathname, search: `?${params.toString()}` }, { replace: true });
    } catch (e) {
      // ignore navigation errors
    }
  };

  const clearFilters = () => {
    setFilters({
      gender: '',
      ageFrom: '',
      ageTo: '',
      religion: '',
      education: '',
      occupation: '',
      income: '',
      caste: '',
      minHeight: '',
      maxHeight: '',
      minWeight: '',
      maxWeight: '',
      state: '',
      district: '',
      featured: false
    });
    setSearchTerm("");
    // Remove any search query params so the effect refetches from /public/profiles
    // This triggers the useEffect that depends on location.search
    try {
      navigate(location.pathname, { replace: true });
    } catch (e) {
      // fallback: navigate to root if something goes wrong
      navigate('/', { replace: true });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Browse <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">Profiles</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover your perfect life partner from thousands of verified profiles
            </p>

            {/* Search Status Indicator */}
            {location.search.includes('search=true') && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-rose-100 text-rose-800 rounded-full text-sm font-medium">
                <Search className="h-4 w-4" />
                Showing search results ({profiles.length} {profiles.length === 1 ? 'profile' : 'profiles'} found)
              </div>
            )}
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, occupation, education, religion, or caste..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              {/* Filter Button */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-rose-200 text-rose-600 hover:bg-rose-50"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                  <select
                    value={filters.gender}
                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="">All Genders</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Age from"
                      value={filters.ageFrom}
                      onChange={(e) => handleFilterChange('ageFrom', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 w-full"
                    />
                    <input
                      type="number"
                      placeholder="Age to"
                      value={filters.ageTo}
                      onChange={(e) => handleFilterChange('ageTo', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 w-full"
                    />
                  </div>
                  <select
                    value={filters.religion}
                    onChange={(e) => handleFilterChange('religion', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="">All Religions</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Muslim">Muslim</option>
                    <option value="Christian">Christian</option>
                    <option value="Sikh">Sikh</option>
                    <option value="Buddhist">Buddhist</option>
                    <option value="Jain">Jain</option>
                  </select>
                  <select
                    value={filters.education}
                    onChange={(e) => handleFilterChange('education', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="">All Education</option>
                    <option value="Bachelor">Bachelor</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="Master">Master</option>
                    <option value="PhD">PhD</option>
                    <option value="Professional">Professional</option>
                  </select>
                  <select
                    value={filters.caste}
                    onChange={(e) => handleFilterChange('caste', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="">All Castes</option>
                    <option value="Brahmin">Brahmin</option>
                    <option value="Kshatriya">Kshatriya</option>
                    <option value="Vaishya">Vaishya</option>
                    <option value="Shudra">Shudra</option>
                    <option value="Reddy">Reddy</option>
                    <option value="Patel">Patel</option>
                    <option value="Iyer">Iyer</option>
                    <option value="Singh">Singh</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Additional Filters Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                  <select
                    value={filters.occupation}
                    onChange={(e) => handleFilterChange('occupation', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="">All Occupations</option>
                    <option value="Engineer">Engineer</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Doctor">Doctor</option>
                    <option value="IT Professional">IT Professional</option>
                    <option value="Business">Business</option>
                  </select>
                  <select
                    value={filters.income}
                    onChange={(e) => handleFilterChange('income', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="">All Income</option>
                    <option value="0-3 LPA">0-3 LPA</option>
                    <option value="3-5 LPA">3-5 LPA</option>
                    <option value="5-10 LPA">5-10 LPA</option>
                    <option value="10-15 LPA">10-15 LPA</option>
                    <option value="15-25 LPA">15-25 LPA</option>
                    <option value="25+ LPA">25+ LPA</option>
                  </select>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Min Height"
                      value={filters.minHeight}
                      onChange={(e) => handleFilterChange('minHeight', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 w-full"
                    />
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Max Height"
                      value={filters.maxHeight}
                      onChange={(e) => handleFilterChange('maxHeight', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 w-full"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="State"
                    value={filters.state}
                    onChange={(e) => handleFilterChange('state', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                {/* Advanced Filters Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min Weight"
                      value={filters.minWeight}
                      onChange={(e) => handleFilterChange('minWeight', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 w-full"
                    />
                    <input
                      type="number"
                      placeholder="Max Weight"
                      value={filters.maxWeight}
                      onChange={(e) => handleFilterChange('maxWeight', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 w-full"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="District"
                    value={filters.district}
                    onChange={(e) => handleFilterChange('district', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                  />
                  <label className="flex items-center space-x-2 px-3 py-2">
                    <input
                      type="checkbox"
                      checked={filters.featured}
                      onChange={(e) => handleFilterChange('featured', e.target.checked)}
                      className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                    />
                    <span className="text-sm text-gray-700">Featured profiles only</span>
                  </label>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="text-gray-600 hover:bg-gray-50"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-rose-600">{filteredProfiles.length}</span> profiles
            </p>
          </div>

          {/* Profile Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProfiles.map((profile) => {
              const age = profile.dateOfBirth ? calculateAge(profile.dateOfBirth) : null;
              const currentImg = currentImageIndex[profile.id] || 0;
              const hasMultipleImages = profile.images && profile.images.length > 1;

              return (
                <div key={profile.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  {/* Profile Image with Slider */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {profile.images && profile.images.length > 0 && (
                      <img
                        src={profile.images[currentImg]?.url || '/placeholder.svg'}
                        alt={profile.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}

                    {/* Image Navigation */}
                    {hasMultipleImages && (
                      <>
                        <button
                          onClick={() => prevImage(profile.id, profile.images.length)}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-opacity"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => nextImage(profile.id, profile.images.length)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-opacity"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>

                        {/* Image Indicators */}
                        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                          {profile.images.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full ${index === currentImg ? 'bg-white' : 'bg-white bg-opacity-50'
                                }`}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 right-3 flex flex-col gap-1">
                      <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </div>
                      {profile.featured && (
                        <div className="bg-gold text-white px-2 py-1 rounded-full text-xs flex items-center">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </div>
                      )}
                    </div>

                    {/* Quick Actions Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-3">
                        <Button
                          size="sm"
                          onClick={() => handleViewProfile(profile.id)}
                          className="bg-white text-gray-900 hover:bg-gray-100"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Profile
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleLike(profile.id, profile.name)}
                          disabled={likingInProgress.has(profile.id) || profile.isLiked}
                          className={`${profile.isLiked
                            ? 'bg-rose-600 text-white'
                            : 'bg-rose-600 hover:bg-rose-700 text-white'
                            }`}
                        >
                          <Heart className={`h-4 w-4 mr-1 ${profile.isLiked ? 'fill-current' : ''}`} />
                          {profile.isLiked ? 'Liked' : 'Like'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{profile.name}</h3>
                      {age !== null && (
                        <span className="text-sm font-medium text-rose-600">{age} years</span>
                      )}
                    </div>

                    <div className="space-y-1 text-sm text-gray-600 mb-4">
                      {profile.occupation && (
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{profile.occupation}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{profile.education}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {profile.religion} • {profile.caste} • {profile.height}' • {profile.income}
                        {profile.state && profile.district && (
                          <span> • {profile.district}, {profile.state}</span>
                        )}
                      </div>
                      {profile.manglik && profile.manglik !== 'No' && (
                        <div className="text-xs text-orange-600">
                          Manglik: {profile.manglik}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewProfile(profile.id)}
                        className="flex-1 border-rose-200 text-rose-600 hover:bg-rose-50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleLike(profile.id, profile.name)}
                        disabled={likingInProgress.has(profile.id) || profile.isLiked}
                        className={`flex-1 ${profile.isLiked
                          ? 'bg-rose-600 text-white'
                          : 'bg-rose-600 hover:bg-rose-700 text-white'
                          }`}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${profile.isLiked ? 'fill-current' : ''}`} />
                        {profile.isLiked ? 'Liked' : 'Like'}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredProfiles.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No profiles found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters</p>
              <Button
                onClick={clearFilters}
                className="mt-4 bg-rose-600 hover:bg-rose-700 text-white"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BrowseProfile;