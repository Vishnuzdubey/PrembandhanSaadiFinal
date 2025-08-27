import ProfileCard from "./ProfileCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AuthModal from "./AuthModal";

const FeaturedProfiles = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleRegisterClick = () => {
    setShowAuthModal(true);
  };
  // Sample profile data
  const profiles = [
    {
      name: "Priya Sharma",
      age: 26,
      height: "5'4\"",
      religion: "Hindu",
      caste: "Brahmin",
      city: "Gorakhpur",
      education: "MBA",
      occupation: "Software Engineer",
      image: "https://images.unsplash.com/photo-1494790108755-2616b95fb2c5?w=400&h=500&fit=crop&crop=face",
      isVerified: true,
      isFeatured: true,
    },
    {
      name: "Rahul Gupta",
      age: 29,
      height: "5'9\"",
      religion: "Hindu",
      caste: "Kshatriya",
      city: "Gorakhpur",
      education: "B.Tech",
      occupation: "Business Analyst",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face",
      isVerified: true,
      isFeatured: true,
    },
    {
      name: "Ananya Reddy",
      age: 24,
      height: "5'3\"",
      religion: "Hindu",
      caste: "Reddy",
      city: "Gorakhpur",
      education: "CA",
      occupation: "Chartered Accountant",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&crop=face",
      isVerified: true,
      isNew: true,
    },
    {
      name: "Arjun Patel",
      age: 31,
      height: "5'11\"",
      religion: "Hindu",
      caste: "Patel",
      city: "Gorakhpur",
      education: "MS",
      occupation: "Data Scientist",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face",
      isVerified: true,
    },
    {
      name: "Kavya Iyer",
      age: 27,
      height: "5'2\"",
      religion: "Hindu",
      caste: "Iyer",
      city: "Gorakhpur",
      education: "MBBS",
      occupation: "Doctor",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=500&fit=crop&crop=face",
      isVerified: true,
      isFeatured: true,
    },
    {
      name: "Vikram Singh",
      age: 28,
      height: "6'0\"",
      religion: "Sikh",
      caste: "Singh",
      city: "Gorakhpur",
      education: "MBA",
      occupation: "Marketing Manager",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face",
      isVerified: true,
      isNew: true,
    },
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {profiles.map((profile, index) => (
            <div key={index} className="group">
              <ProfileCard {...profile} />
            </div>
          ))}
        </div>

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