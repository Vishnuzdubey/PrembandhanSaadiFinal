import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  User,
  MapPin,
  Calendar,
  Heart,
  GraduationCap,
  Briefcase,
  Phone,
  Mail,
  Users,
  Home,
  Edit,
  Camera,
  ChevronLeft,
  ChevronRight,
  Star,
  Shield
} from "lucide-react";

interface UserProfile {
  id: number;
  name: string;
  phone: string;
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
  contactInfo: string;
  maritalStatus: string;
  address: string;
  district: string;
  state: string;
  pinCode: string;
  complexion: string;
  height: number;
  weight: number;
  bloodGroup: string;
  particulars: string;
  inCaste: string;
  remarks: string;
  featured: boolean;
  images: Array<{
    id: number;
    url: string;
    userId: number;
    createdAt: string;
  }>;
}

const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [formState, setFormState] = useState<Partial<UserProfile> | null>(null);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('prembandhanToken');
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please login to view your profile.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    try {
      const response = await fetch('https://pb-app-lac.vercel.app/api/v1/myprofile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
          // Initialize formState when user loads
          setFormState(data.user);
        } else {
          throw new Error('Failed to fetch profile');
        }
      } else {
        localStorage.removeItem('prembandhanToken');
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive",
      });
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const nextImage = () => {
    if (user?.images && user.images.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === user.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (user?.images && user.images.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? user.images.length - 1 : prev - 1
      );
    }
  };

  const startEdit = () => {
    if (user) {
      setFormState({ ...user });
      setImagePreviews([]);
      setNewImages([]);
      setEditMode(true);
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    setFormState(user || null);
    setNewImages([]);
    setImagePreviews([]);
  };

  const handleInputChange = (key: keyof UserProfile, value: any) => {
    setFormState(prev => ({ ...(prev || {}), [key]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const added: File[] = [];
    const previews: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      added.push(f);
      previews.push(URL.createObjectURL(f));
    }
    setNewImages(prev => [...prev, ...added]);
    setImagePreviews(prev => [...prev, ...previews]);
    // reset input
    e.currentTarget.value = '';
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const submitEdit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formState) return;

    const token = localStorage.getItem('prembandhanToken');
    if (!token) {
      toast({ title: 'Login Required', description: 'Please login to update your profile', variant: 'destructive' });
      navigate('/');
      return;
    }

    try {
      setIsLoading(true);

      const fd = new FormData();
      // Append fields
      Object.keys(formState).forEach(k => {
        const key = k as keyof UserProfile;
        const val = (formState as any)[key];
        if (val !== undefined && val !== null) {
          // Dates and numbers converted to string
          fd.append(key, String(val));
        }
      });

      // Append new images
      newImages.forEach((file, idx) => {
        fd.append('images', file);
      });

      const response = await fetch('https://pb-app-lac.vercel.app/api/v1/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          // DO NOT set Content-Type; browser will set multipart boundary
        },
        body: fd,
      });

      const data = await response.json();
      if (response.ok && data.success) {
        toast({ title: 'Profile Updated', description: 'Your profile was updated successfully' });
        // Refresh profile data
        await fetchUserProfile();
        setEditMode(false);
      } else {
        console.error('Update failed:', data);
        toast({ title: 'Update Failed', description: data.message || 'Unable to update profile', variant: 'destructive' });
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      toast({ title: 'Error', description: 'Failed to update profile. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-rose/5 to-gold/5 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-rose/5 to-gold/5 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="text-center p-6">
              <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
              <p className="text-muted-foreground mb-4">Unable to load profile information.</p>
              <Button onClick={() => navigate('/')}>Go Home</Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-rose/5 to-gold/5 py-4 px-4 sm:py-8">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-4"
            >
              ← Back to Home
            </Button>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Profile</h1>
                <p className="text-muted-foreground">Manage your matrimonial profile</p>
              </div>
              {!editMode ? (
                <Button variant="outline" className="w-full sm:w-auto" onClick={startEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button variant="primary" className="flex-1" onClick={submitEdit}>
                    Save
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={cancelEdit}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Profile Image Section */}
            <div className="lg:col-span-1">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  {user.images && user.images.length > 0 ? (
                    <div className="relative aspect-[3/4] bg-gray-100">
                      <img
                        src={user.images[currentImageIndex]?.url}
                        alt={`${user.name} - Photo ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Image Navigation */}
                      {user.images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>

                          {/* Image Dots */}
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {user.images.map((_, index) => (
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
                      {user.featured && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-gold text-foreground">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                      )}
                      {/* Image upload when editing */}
                      {editMode && (
                        <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2 bg-white/80 p-3 rounded">
                          <label className="text-sm font-medium">Add Images</label>
                          <input type="file" accept="image/*" multiple onChange={handleFileChange} />
                          <div className="flex gap-2 overflow-x-auto mt-2">
                            {imagePreviews.map((src, idx) => (
                              <div key={idx} className="relative">
                                <img src={src} className="w-20 h-20 object-cover rounded" />
                                <button onClick={() => removeNewImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs">×</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No photos uploaded</p>
                      </div>
                    </div>
                  )}

                  {/* Basic Info Card */}
                  <div className="p-4 sm:p-6">
                    {!editMode ? (
                      <div className="text-center">
                        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{user.name}</h2>
                        <p className="text-muted-foreground mb-3">
                          {calculateAge(user.dateOfBirth)} years • {user.height}' • {user.complexion}
                        </p>

                        <div className="flex flex-wrap justify-center gap-2 mb-4">
                          <Badge variant="secondary">{user.religion}</Badge>
                          <Badge variant="secondary">{user.caste}</Badge>
                          <Badge variant="secondary">{user.maritalStatus}</Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-center text-muted-foreground">
                            <MapPin className="w-4 h-4 mr-2" />
                            {user.district}, {user.state}
                          </div>
                          <div className="flex items-center justify-center text-muted-foreground">
                            <Briefcase className="w-4 h-4 mr-2" />
                            {user.occupation}
                          </div>
                          <div className="flex items-center justify-center text-muted-foreground">
                            <GraduationCap className="w-4 h-4 mr-2" />
                            {user.education}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={submitEdit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-sm font-medium">Full Name</label>
                            <input className="w-full mt-1 p-2 border rounded" value={formState?.name || ''} onChange={(e) => handleInputChange('name', e.target.value)} />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Phone</label>
                            <input className="w-full mt-1 p-2 border rounded" value={formState?.phone || ''} onChange={(e) => handleInputChange('phone', e.target.value)} />
                          </div>

                          <div>
                            <label className="text-sm font-medium">Date of Birth</label>
                            <input type="date" className="w-full mt-1 p-2 border rounded" value={formState?.dateOfBirth ? new Date(formState.dateOfBirth as string).toISOString().slice(0, 10) : ''} onChange={(e) => handleInputChange('dateOfBirth', e.target.value)} />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Gender</label>
                            <select className="w-full mt-1 p-2 border rounded" value={formState?.gender || ''} onChange={(e) => handleInputChange('gender', e.target.value)}>
                              <option value="">Select</option>
                              <option value="MALE">Male</option>
                              <option value="FEMALE">Female</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-sm font-medium">Caste</label>
                            <input className="w-full mt-1 p-2 border rounded" value={formState?.caste || ''} onChange={(e) => handleInputChange('caste', e.target.value)} />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Manglik</label>
                            <select className="w-full mt-1 p-2 border rounded" value={formState?.manglik || ''} onChange={(e) => handleInputChange('manglik', e.target.value)}>
                              <option value="">Select</option>
                              <option value="No">No</option>
                              <option value="Yes">Yes</option>
                              <option value="Partial">Partial</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-sm font-medium">Kundali</label>
                            <input className="w-full mt-1 p-2 border rounded" value={formState?.kundali || ''} onChange={(e) => handleInputChange('kundali', e.target.value)} />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Religion</label>
                            <input className="w-full mt-1 p-2 border rounded" value={formState?.religion || ''} onChange={(e) => handleInputChange('religion', e.target.value)} />
                          </div>

                          <div>
                            <label className="text-sm font-medium">Gotra</label>
                            <input className="w-full mt-1 p-2 border rounded" value={formState?.gotra || ''} onChange={(e) => handleInputChange('gotra', e.target.value)} />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Diet</label>
                            <input className="w-full mt-1 p-2 border rounded" value={formState?.diet || ''} onChange={(e) => handleInputChange('diet', e.target.value)} />
                          </div>

                          <div>
                            <label className="text-sm font-medium">Disability</label>
                            <input className="w-full mt-1 p-2 border rounded" value={formState?.disability || ''} onChange={(e) => handleInputChange('disability', e.target.value)} />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Education</label>
                            <input className="w-full mt-1 p-2 border rounded" value={formState?.education || ''} onChange={(e) => handleInputChange('education', e.target.value)} />
                          </div>

                          <div>
                            <label className="text-sm font-medium">Occupation</label>
                            <input className="w-full mt-1 p-2 border rounded" value={formState?.occupation || ''} onChange={(e) => handleInputChange('occupation', e.target.value)} />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Income</label>
                            <input className="w-full mt-1 p-2 border rounded" value={formState?.income || ''} onChange={(e) => handleInputChange('income', e.target.value)} />
                          </div>

                          <div>
                            <label className="text-sm font-medium">Father's Name</label>
                            <input className="w-full mt-1 p-2 border rounded" value={formState?.fatherName || ''} onChange={(e) => handleInputChange('fatherName', e.target.value)} />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Father's Occupation</label>
                            <input className="w-full mt-1 p-2 border rounded" value={formState?.fatherOcc || ''} onChange={(e) => handleInputChange('fatherOcc', e.target.value)} />
                          </div>

                          <div>
                            <label className="text-sm font-medium">Mother's Name</label>
                            <input className="w-full mt-1 p-2 border rounded" value={formState?.motherName || ''} onChange={(e) => handleInputChange('motherName', e.target.value)} />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Mother's Occupation</label>
                            <input className="w-full mt-1 p-2 border rounded" value={formState?.motherOcc || ''} onChange={(e) => handleInputChange('motherOcc', e.target.value)} />
                          </div>

                          <div>
                            <label className="text-sm font-medium">Sibling 1 Name</label>
                            <input className="w-full mt-1 p-2 border rounded" value={formState?.sibling1Name || ''} onChange={(e) => handleInputChange('sibling1Name', e.target.value)} />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Sibling 1 Occupation</label>
                            <input className="w-full mt-1 p-2 border rounded" value={formState?.sibling1Occ || ''} onChange={(e) => handleInputChange('sibling1Occ', e.target.value)} />
                          </div>

                          <div>
                            <label className="text-sm font-medium">Sibling 2 Name</label>
                            <input className="w-full mt-1 p-2 border rounded" value={formState?.sibling2Name || ''} onChange={(e) => handleInputChange('sibling2Name', e.target.value)} />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Sibling 2 Occupation</label>
                            <input className="w-full mt-1 p-2 border rounded" value={formState?.sibling2Occ || ''} onChange={(e) => handleInputChange('sibling2Occ', e.target.value)} />
                          </div>

                          <div>
                            <label className="text-sm font-medium">Sibling 3 Name</label>
                            <input className="w-full mt-1 p-2 border rounded" value={formState?.sibling3Name || ''} onChange={(e) => handleInputChange('sibling3Name', e.target.value)} />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Sibling 3 Occupation</label>
                            <input className="w-full mt-1 p-2 border rounded" value={formState?.sibling3Occ || ''} onChange={(e) => handleInputChange('sibling3Occ', e.target.value)} />
                          </div>

                          <div>
                            <label className="text-sm font-medium">Contact Info</label>
                            <input className="w-full mt-1 p-2 border rounded" value={formState?.contactInfo || ''} onChange={(e) => handleInputChange('contactInfo', e.target.value)} />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Marital Status</label>
                            <input className="w-full mt-1 p-2 border rounded" value={formState?.maritalStatus || ''} onChange={(e) => handleInputChange('maritalStatus', e.target.value)} />
                          </div>

                          <div>
                            <label className="text-sm font-medium">Address</label>
                            <input className="w-full mt-1 p-2 border rounded" value={formState?.address || ''} onChange={(e) => handleInputChange('address', e.target.value)} />
                          </div>
                          <div>
                            <label className="text-sm font-medium">District</label>
                            <input className="w-full mt-1 p-2 border rounded" value={formState?.district || ''} onChange={(e) => handleInputChange('district', e.target.value)} />
                          </div>

                          <div>
                            <label className="text-sm font-medium">State</label>
                            <input className="w-full mt-1 p-2 border rounded" value={formState?.state || ''} onChange={(e) => handleInputChange('state', e.target.value)} />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Pin Code</label>
                            <input className="w-full mt-1 p-2 border rounded" value={formState?.pinCode || ''} onChange={(e) => handleInputChange('pinCode', e.target.value)} />
                          </div>

                          <div>
                            <label className="text-sm font-medium">Complexion</label>
                            <input className="w-full mt-1 p-2 border rounded" value={formState?.complexion || ''} onChange={(e) => handleInputChange('complexion', e.target.value)} />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Blood Group</label>
                            <input className="w-full mt-1 p-2 border rounded" value={formState?.bloodGroup || ''} onChange={(e) => handleInputChange('bloodGroup', e.target.value)} />
                          </div>

                          <div>
                            <label className="text-sm font-medium">Particulars</label>
                            <input className="w-full mt-1 p-2 border rounded" value={formState?.particulars || ''} onChange={(e) => handleInputChange('particulars', e.target.value)} />
                          </div>
                          <div>
                            <label className="text-sm font-medium">In Caste</label>
                            <input className="w-full mt-1 p-2 border rounded" value={formState?.inCaste || ''} onChange={(e) => handleInputChange('inCaste', e.target.value)} />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="text-sm font-medium">Remarks</label>
                            <textarea className="w-full mt-1 p-2 border rounded" value={formState?.remarks || ''} onChange={(e) => handleInputChange('remarks', e.target.value)} />
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                      <p className="text-foreground">{new Date(user.dateOfBirth).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Gender</label>
                      <p className="text-foreground">{user.gender}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Height</label>
                      <p className="text-foreground">{user.height} feet</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Weight</label>
                      <p className="text-foreground">{user.weight} kg</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Blood Group</label>
                      <p className="text-foreground">{user.bloodGroup || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Diet</label>
                      <p className="text-foreground">{user.diet}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Manglik</label>
                      <p className="text-foreground">{user.manglik}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Complexion</label>
                      <p className="text-foreground">{user.complexion}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">Disability</label>
                      <p className="text-foreground">{user.disability}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Religious Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Religious Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Religion</label>
                      <p className="text-foreground">{user.religion}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Caste</label>
                      <p className="text-foreground">{user.caste}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Gotra</label>
                      <p className="text-foreground">{user.gotra || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">In Caste</label>
                      <p className="text-foreground">{user.inCaste}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">Kundali</label>
                      <p className="text-foreground">{user.kundali || 'Not provided'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Education & Career */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Education & Career
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Education</label>
                      <p className="text-foreground">{user.education}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Occupation</label>
                      <p className="text-foreground">{user.occupation}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">Annual Income</label>
                      <p className="text-foreground">{user.income}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Family Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Family Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Father's Name</label>
                        <p className="text-foreground">{user.fatherName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Father's Occupation</label>
                        <p className="text-foreground">{user.fatherOcc}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Mother's Name</label>
                        <p className="text-foreground">{user.motherName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Mother's Occupation</label>
                        <p className="text-foreground">{user.motherOcc}</p>
                      </div>
                    </div>

                    {/* Siblings */}
                    {(user.sibling1Name || user.sibling2Name || user.sibling3Name) && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Siblings</label>
                        <div className="space-y-2">
                          {user.sibling1Name && (
                            <div className="flex flex-col sm:flex-row sm:justify-between bg-gray-50 p-3 rounded-lg">
                              <span className="font-medium">{user.sibling1Name}</span>
                              <span className="text-muted-foreground">{user.sibling1Occ}</span>
                            </div>
                          )}
                          {user.sibling2Name && (
                            <div className="flex flex-col sm:flex-row sm:justify-between bg-gray-50 p-3 rounded-lg">
                              <span className="font-medium">{user.sibling2Name}</span>
                              <span className="text-muted-foreground">{user.sibling2Occ}</span>
                            </div>
                          )}
                          {user.sibling3Name && (
                            <div className="flex flex-col sm:flex-row sm:justify-between bg-gray-50 p-3 rounded-lg">
                              <span className="font-medium">{user.sibling3Name}</span>
                              <span className="text-muted-foreground">{user.sibling3Occ}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Contact & Location */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Contact & Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                      <p className="text-foreground">{user.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Contact Info</label>
                      <p className="text-foreground">{user.contactInfo}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">Address</label>
                      <p className="text-foreground">{user.address}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">District</label>
                      <p className="text-foreground">{user.district}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">State</label>
                      <p className="text-foreground">{user.state}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Pin Code</label>
                      <p className="text-foreground">{user.pinCode}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Information */}
              {(user.particulars !== 'None' || user.remarks) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {user.particulars !== 'None' && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Particulars</label>
                          <p className="text-foreground">{user.particulars}</p>
                        </div>
                      )}
                      {user.remarks && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Remarks</label>
                          <p className="text-foreground">{user.remarks}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
