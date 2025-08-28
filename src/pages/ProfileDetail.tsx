import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import {
  Heart,
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  GraduationCap,
  Briefcase,
  Phone,
  Mail,
  User,
  Home,
  Star,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface ProfileImage {
  url: string;
}

interface ProfileData {
  id: number;
  name: string;
  gender: string;
  dateOfBirth: string;
  caste: string;
  manglik: string;
  kundali: string;
  religion: string;
  gotra: string;
  diet: string;
  disability: string;
  education: string;
  occupation: string;
  income: string;
  fatherName: string;
  fatherOcc: string;
  motherName: string;
  motherOcc: string;
  sibling1Name: string;
  sibling1Occ: string;
  sibling2Name: string | null;
  sibling2Occ: string | null;
  sibling3Name: string | null;
  sibling3Occ: string | null;
  maritalStatus: string;
  district: string;
  state: string;
  complexion: string;
  height: number;
  weight: number;
  bloodGroup: string;
  particulars: string;
  inCaste: string;
  remarks: string;
  featured: boolean;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
  images: ProfileImage[];
}

const ProfileDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [likingInProgress, setLikingInProgress] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

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

  // Check authentication and fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('prembandhanToken');

      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please login to view profile details",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      if (!id) {
        toast({
          title: "Error",
          description: "Profile ID not found",
          variant: "destructive",
        });
        navigate('/browse');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`https://pb-app-lac.vercel.app/api/v1/profiles/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (data.success && data.user) {
          setProfile(data.user);
        } else {
          toast({
            title: "Error",
            description: "Profile not found",
            variant: "destructive",
          });
          navigate('/browse');
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch profile details",
          variant: "destructive",
        });
        navigate('/browse');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, navigate, toast]);

  // Handle like functionality
  const handleLike = async () => {
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

    if (!id || !profile) return;

    if (profile.isLiked) {
      toast({
        title: "Already Liked",
        description: "You have already liked this profile",
      });
      return;
    }

    setLikingInProgress(true);
    try {
      const response = await fetch(`https://pb-app-lac.vercel.app/api/v1/profiles/${id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setProfile(prev => prev ? { ...prev, isLiked: true } : null);
        toast({
          title: "Success",
          description: "Profile liked successfully!",
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
      setLikingInProgress(false);
    }
  };

  // Image navigation
  const nextImage = () => {
    if (profile && profile.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % profile.images.length);
    }
  };

  const prevImage = () => {
    if (profile && profile.images.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? profile.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Profile not found</p>
            <Button onClick={() => navigate('/browse')} variant="outline">
              Back to Browse
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const age = calculateAge(profile.dateOfBirth);

  return (
    <>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => navigate('/browse')}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Browse
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Images */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="relative bg-white rounded-xl overflow-hidden shadow-lg">
                  {/* Image Slider */}
                  <div className="aspect-[3/4] relative">
                    {profile.images && profile.images.length > 0 && (
                      <img
                        src={profile.images[currentImageIndex]?.url || '/placeholder.svg'}
                        alt={`${profile.name}'s photo ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}

                    {/* Image Navigation */}
                    {profile.images && profile.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>

                        {/* Image Indicators */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                          {profile.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-2 h-2 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                }`}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {/* Featured Badge */}
                    {profile.featured && (
                      <Badge className="absolute top-4 left-4 bg-gold text-foreground">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>

                  {/* Like Button */}
                  <div className="p-4">
                    <Button
                      onClick={handleLike}
                      disabled={likingInProgress || profile.isLiked}
                      className={`w-full flex items-center gap-2 ${profile.isLiked
                        ? 'bg-rose-600 text-white'
                        : 'bg-white border-2 border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white'
                        }`}
                    >
                      <Heart className={`h-4 w-4 ${profile.isLiked ? 'fill-current' : ''}`} />
                      {likingInProgress ? 'Liking...' : profile.isLiked ? 'Liked' : 'Like Profile'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <User className="h-6 w-6 text-rose-600" />
                    {profile.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-rose-600" />
                    <div>
                      <p className="font-medium">Age</p>
                      <p className="text-gray-600">{age} years</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-rose-600" />
                    <div>
                      <p className="font-medium">Gender</p>
                      <p className="text-gray-600">{profile.gender}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-rose-600" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-gray-600">{profile.district}, {profile.state}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-rose-600" />
                    <div>
                      <p className="font-medium">Height & Weight</p>
                      <p className="text-gray-600">{profile.height}" / {profile.weight} kg</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Religious & Personal Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Religious & Personal Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Religion</p>
                    <p className="text-gray-600">{profile.religion}</p>
                  </div>
                  <div>
                    <p className="font-medium">Caste</p>
                    <p className="text-gray-600">{profile.caste}</p>
                  </div>
                  <div>
                    <p className="font-medium">Gotra</p>
                    <p className="text-gray-600">{profile.gotra}</p>
                  </div>
                  <div>
                    <p className="font-medium">Manglik</p>
                    <p className="text-gray-600">{profile.manglik}</p>
                  </div>
                  <div>
                    <p className="font-medium">Diet</p>
                    <p className="text-gray-600">{profile.diet}</p>
                  </div>
                  <div>
                    <p className="font-medium">Marital Status</p>
                    <p className="text-gray-600">{profile.maritalStatus}</p>
                  </div>
                  <div>
                    <p className="font-medium">Complexion</p>
                    <p className="text-gray-600">{profile.complexion}</p>
                  </div>
                  <div>
                    <p className="font-medium">Blood Group</p>
                    <p className="text-gray-600">{profile.bloodGroup}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Education & Career */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-rose-600" />
                    Education & Career
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Education</p>
                    <p className="text-gray-600">{profile.education}</p>
                  </div>
                  <div>
                    <p className="font-medium">Occupation</p>
                    <p className="text-gray-600">{profile.occupation}</p>
                  </div>
                  <div>
                    <p className="font-medium">Annual Income</p>
                    <p className="text-gray-600">{profile.income}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Family Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-rose-600" />
                    Family Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Father's Name</p>
                      <p className="text-gray-600">{profile.fatherName}</p>
                    </div>
                    <div>
                      <p className="font-medium">Father's Occupation</p>
                      <p className="text-gray-600">{profile.fatherOcc}</p>
                    </div>
                    <div>
                      <p className="font-medium">Mother's Name</p>
                      <p className="text-gray-600">{profile.motherName}</p>
                    </div>
                    <div>
                      <p className="font-medium">Mother's Occupation</p>
                      <p className="text-gray-600">{profile.motherOcc}</p>
                    </div>
                  </div>

                  {/* Siblings */}
                  {(profile.sibling1Name || profile.sibling2Name || profile.sibling3Name) && (
                    <div>
                      <p className="font-medium mb-2">Siblings</p>
                      <div className="space-y-2">
                        {profile.sibling1Name && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">{profile.sibling1Name}</span>
                            <span className="text-gray-600">{profile.sibling1Occ}</span>
                          </div>
                        )}
                        {profile.sibling2Name && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">{profile.sibling2Name}</span>
                            <span className="text-gray-600">{profile.sibling2Occ}</span>
                          </div>
                        )}
                        {profile.sibling3Name && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">{profile.sibling3Name}</span>
                            <span className="text-gray-600">{profile.sibling3Occ}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Additional Information */}
              {(profile.kundali || profile.remarks || profile.particulars !== 'None') && (
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profile.kundali && (
                      <div>
                        <p className="font-medium">Kundali Details</p>
                        <p className="text-gray-600">{profile.kundali}</p>
                      </div>
                    )}
                    {profile.remarks && (
                      <div>
                        <p className="font-medium">Remarks</p>
                        <p className="text-gray-600">{profile.remarks}</p>
                      </div>
                    )}
                    {profile.particulars && profile.particulars !== 'None' && (
                      <div>
                        <p className="font-medium">Particulars</p>
                        <p className="text-gray-600">{profile.particulars}</p>
                      </div>
                    )}
                    <div>
                      <p className="font-medium">Marry within Caste</p>
                      <p className="text-gray-600">{profile.inCaste}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contact Actions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="outline" className="flex-1">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                    <Button variant="premium" className="flex-1">
                      <Phone className="h-4 w-4 mr-2" />
                      View Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ProfileDetail;
