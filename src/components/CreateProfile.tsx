import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Page = 'auth' | 'createProfile' | 'login';

interface CreateProfileProps {
  onNavigate: (page: Page) => void;
}

const CreateProfile = ({ onNavigate }: CreateProfileProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    // Basic Info - matching API structure
    name: '',
    phone: '',
    dateOfBirth: '',
    gender: 'MALE',
    caste: '',
    manglik: 'No',
    kundali: '',
    religion: 'Hindu',
    gotra: '',
    diet: 'Vegetarian',
    disability: 'None',
    education: '',
    occupation: '',
    income: '',
    fatherName: '',
    fatherOcc: '',
    motherName: '',
    motherOcc: '',
    sibling1Name: '',
    sibling1Occ: '',
    sibling2Name: '',
    sibling2Occ: '',
    sibling3Name: '',
    sibling3Occ: '',
    contactInfo: '',
    maritalStatus: 'Single',
    address: '',
    district: '',
    state: '',
    pinCode: '',
    complexion: 'Fair',
    height: '',
    weight: '',
    bloodGroup: '',
    particulars: 'None',
    inCaste: 'Yes',
    remarks: '',

    // Additional fields for UI
    motherTongue: 'Hindi',
    country: 'India',
    city: '',
    email: '',

    // Preferences
    preferredAgeFrom: '21',
    preferredAgeTo: '35',
    preferredHeightFrom: '5.0',
    preferredHeightTo: '6.0',
    preferredEducation: 'Any',
    preferredOccupation: 'Any',
    preferredLocation: 'Any',

    // About
    aboutMe: '',
    hobbies: '',
    expectations: ''
  });

  const steps = [
    { id: 1, title: 'Basic Information', icon: '1' },
    { id: 2, title: 'Education & Career', icon: '2' },
    { id: 3, title: 'Family Details', icon: '3' },
    { id: 4, title: 'Contact Information', icon: '4' },
    { id: 5, title: 'Partner Preferences', icon: '5' },
    { id: 6, title: 'About Me & Photos', icon: '6' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    // Validate step 6 before proceeding
    if (currentStep === 6 && images.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one photo before proceeding",
        variant: "destructive",
      });
      return;
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.phone || !formData.dateOfBirth || !formData.gender) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate images - make it mandatory
    if (images.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one image",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create FormData for multipart/form-data
      const formDataToSend = new FormData();

      // Add all form fields according to API specification
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          formDataToSend.append(key, value.toString());
        }
      });

      // Add images if any
      images.forEach((image, index) => {
        formDataToSend.append('images', image);
      });

      const response = await fetch('https://pb-app-lac.vercel.app/api/v1/register', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Profile created successfully! You can now login.",
        });
        onNavigate('auth');
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create profile. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const progress = (currentStep / steps.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="MALE">Male</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height *</Label>
                <Input
                  id="height"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  placeholder="e.g., 5.6"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="religion">Religion *</Label>
                <Select value={formData.religion} onValueChange={(value) => handleInputChange('religion', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hindu">Hindu</SelectItem>
                    <SelectItem value="Muslim">Muslim</SelectItem>
                    <SelectItem value="Christian">Christian</SelectItem>
                    <SelectItem value="Sikh">Sikh</SelectItem>
                    <SelectItem value="Buddhist">Buddhist</SelectItem>
                    <SelectItem value="Jain">Jain</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="caste">Caste *</Label>
                <Input
                  id="caste"
                  value={formData.caste}
                  onChange={(e) => handleInputChange('caste', e.target.value)}
                  placeholder="Enter your caste"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gotra">Gotra</Label>
                <Input
                  id="gotra"
                  value={formData.gotra}
                  onChange={(e) => handleInputChange('gotra', e.target.value)}
                  placeholder="Enter your gotra"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manglik">Manglik</Label>
                <Select value={formData.manglik} onValueChange={(value) => handleInputChange('manglik', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Don't Know">Don't Know</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="diet">Diet</Label>
                <Select value={formData.diet} onValueChange={(value) => handleInputChange('diet', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="Non-Vegetarian">Non-Vegetarian</SelectItem>
                    <SelectItem value="Vegan">Vegan</SelectItem>
                    <SelectItem value="Jain">Jain</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="complexion">Complexion</Label>
                <Select value={formData.complexion} onValueChange={(value) => handleInputChange('complexion', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Wheatish">Wheatish</SelectItem>
                    <SelectItem value="Dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maritalStatus">Marital Status</Label>
                <Select value={formData.maritalStatus} onValueChange={(value) => handleInputChange('maritalStatus', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="disability">Disability</Label>
                <Input
                  id="disability"
                  value={formData.disability}
                  onChange={(e) => handleInputChange('disability', e.target.value)}
                  placeholder="Enter any disability or 'None'"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="education">Education *</Label>
                <Select value={formData.education} onValueChange={(value) => handleInputChange('education', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High School">High School</SelectItem>
                    <SelectItem value="Diploma">Diploma</SelectItem>
                    <SelectItem value="Bachelor">Bachelor's</SelectItem>
                    <SelectItem value="Master">Master's</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation *</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  placeholder="Enter your occupation"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="education">Education *</Label>
                <Input
                  id="education"
                  value={formData.education}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                  placeholder="Enter your education"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="income">Annual Income</Label>
                <Input
                  id="income"
                  value={formData.income}
                  onChange={(e) => handleInputChange('income', e.target.value)}
                  placeholder="Enter your annual income"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fatherName">Father's Name</Label>
                <Input
                  id="fatherName"
                  value={formData.fatherName}
                  onChange={(e) => handleInputChange('fatherName', e.target.value)}
                  placeholder="Enter father's name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fatherOcc">Father's Occupation</Label>
                <Input
                  id="fatherOcc"
                  value={formData.fatherOcc}
                  onChange={(e) => handleInputChange('fatherOcc', e.target.value)}
                  placeholder="Enter father's occupation"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motherName">Mother's Name</Label>
                <Input
                  id="motherName"
                  value={formData.motherName}
                  onChange={(e) => handleInputChange('motherName', e.target.value)}
                  placeholder="Enter mother's name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motherOcc">Mother's Occupation</Label>
                <Input
                  id="motherOcc"
                  value={formData.motherOcc}
                  onChange={(e) => handleInputChange('motherOcc', e.target.value)}
                  placeholder="Enter mother's occupation"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sibling1Name">Sibling 1 Name</Label>
                <Input
                  id="sibling1Name"
                  value={formData.sibling1Name}
                  onChange={(e) => handleInputChange('sibling1Name', e.target.value)}
                  placeholder="Enter sibling 1 name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sibling1Occ">Sibling 1 Occupation</Label>
                <Input
                  id="sibling1Occ"
                  value={formData.sibling1Occ}
                  onChange={(e) => handleInputChange('sibling1Occ', e.target.value)}
                  placeholder="Enter sibling 1 occupation"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sibling2Name">Sibling 2 Name</Label>
                <Input
                  id="sibling2Name"
                  value={formData.sibling2Name}
                  onChange={(e) => handleInputChange('sibling2Name', e.target.value)}
                  placeholder="Enter sibling 2 name (optional)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sibling2Occ">Sibling 2 Occupation</Label>
                <Input
                  id="sibling2Occ"
                  value={formData.sibling2Occ}
                  onChange={(e) => handleInputChange('sibling2Occ', e.target.value)}
                  placeholder="Enter sibling 2 occupation (optional)"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactInfo">Contact Info</Label>
                <Input
                  id="contactInfo"
                  value={formData.contactInfo}
                  onChange={(e) => handleInputChange('contactInfo', e.target.value)}
                  placeholder="Enter contact information"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter your address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District *</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  placeholder="Enter your district"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="Enter your state"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pinCode">Pin Code *</Label>
                <Input
                  id="pinCode"
                  value={formData.pinCode}
                  onChange={(e) => handleInputChange('pinCode', e.target.value)}
                  placeholder="Enter your pin code"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="Enter your weight"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select value={formData.bloodGroup} onValueChange={(value) => handleInputChange('bloodGroup', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferredAgeFrom">Preferred Age From</Label>
                <Input
                  id="preferredAgeFrom"
                  value={formData.preferredAgeFrom}
                  onChange={(e) => handleInputChange('preferredAgeFrom', e.target.value)}
                  placeholder="21"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredAgeTo">Preferred Age To</Label>
                <Input
                  id="preferredAgeTo"
                  value={formData.preferredAgeTo}
                  onChange={(e) => handleInputChange('preferredAgeTo', e.target.value)}
                  placeholder="35"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredEducation">Preferred Education</Label>
                <Select value={formData.preferredEducation} onValueChange={(value) => handleInputChange('preferredEducation', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any">Any</SelectItem>
                    <SelectItem value="Bachelor">Bachelor's</SelectItem>
                    <SelectItem value="Master">Master's</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredLocation">Preferred Location</Label>
                <Input
                  id="preferredLocation"
                  value={formData.preferredLocation}
                  onChange={(e) => handleInputChange('preferredLocation', e.target.value)}
                  placeholder="Any"
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="kundali">Kundali Details</Label>
              <Textarea
                id="kundali"
                value={formData.kundali}
                onChange={(e) => handleInputChange('kundali', e.target.value)}
                placeholder="Enter kundali details..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="particulars">Particulars</Label>
              <Textarea
                id="particulars"
                value={formData.particulars}
                onChange={(e) => handleInputChange('particulars', e.target.value)}
                placeholder="Any specific particulars..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                value={formData.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
                placeholder="Looking for match, any additional remarks..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inCaste">Preference for In-Caste Marriage</Label>
              <Select value={formData.inCaste} onValueChange={(value) => handleInputChange('inCaste', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="images">Upload Photos *</Label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setImages(files);
                }}
                className={`cursor-pointer ${images.length === 0 ? 'border-red-300' : 'border-green-300'}`}
              />
              <p className="text-sm text-muted-foreground">
                Please upload at least one photo. Accepted formats: JPG, PNG, GIF
              </p>
              {images.length > 0 ? (
                <div className="mt-2">
                  <p className="text-sm text-green-600">
                    ✓ {images.length} photo(s) selected
                  </p>
                </div>
              ) : (
                <div className="mt-2">
                  <p className="text-sm text-red-600">
                    ⚠ No photos selected - at least one photo is required
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Create Your Profile</h2>
        <p className="text-muted-foreground">Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>

        {currentStep === steps.length ? (
          <Button
            variant="hero"
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? "Creating Profile..." : "Create Profile"}
          </Button>
        ) : (
          <Button variant="hero" onClick={nextStep} className="flex items-center gap-2">
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateProfile;