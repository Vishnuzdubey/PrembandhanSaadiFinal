import { Button } from "@/components/ui/button";
import { MapPin, Search, User, Heart, Phone, Shield, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AuthModal from "./AuthModal";

const Header = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleRegisterClick = () => {
    setShowAuthModal(true);
  };

  return (
    <>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      
      {/* Top Bar */}
      <div className="hidden md:block bg-gradient-to-r from-rose/10 to-gold/10 border-b border-rose/20">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>100% Verified Profiles</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-muted-foreground">Follow us:</span>
              <div className="flex space-x-2">
                <a href="#" className="text-muted-foreground hover:text-rose transition-colors">Facebook</a>
                <a href="#" className="text-muted-foreground hover:text-rose transition-colors">Instagram</a>
                <a href="#" className="text-muted-foreground hover:text-rose transition-colors">WhatsApp</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/90 shadow-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Heart className="h-10 w-10 text-rose fill-rose/20" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <Link to="/" className="flex flex-col">
                <span className="text-2xl font-bold text-foreground leading-none">
                  PremBandhan<span className="text-rose">Shaadi</span>
                </span>
                <span className="text-xs text-muted-foreground font-medium">Gorakhpur's Trusted Platform</span>
              </Link>
            </div>
            
            {/* City Selector */}
            <div className="hidden lg:flex items-center space-x-2 bg-gray-50 rounded-full px-4 py-2">
              <MapPin className="h-4 w-4 text-rose" />
              <select className="bg-transparent border-none focus:outline-none font-medium text-sm">
                <option>Gorakhpur, UP</option>
              </select>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-sm font-semibold hover:text-rose transition-colors duration-200 relative group">
              How It Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a href="#success-stories" className="text-sm font-semibold hover:text-rose transition-colors duration-200 relative group">
              Success Stories
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose transition-all duration-200 group-hover:w-full"></span>
            </a>
            <Link to="/ContactUs" className="text-sm font-semibold hover:text-rose transition-colors duration-200 relative group">
              Contact Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link to="/BrowseProfile" className="text-sm font-semibold hover:text-rose transition-colors duration-200 relative group">
              Browse Profile
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose transition-all duration-200 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
       
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAuthModal(true)}
              className="font-semibold border-2 hover:bg-rose hover:border-rose hover:text-white transition-all duration-200"
            >
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>
            <Button 
              variant="hero" 
              size="sm"
              className="font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={handleRegisterClick}
            >
              Register Free
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white/95 backdrop-blur-md">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-4 py-3">
                <MapPin className="h-4 w-4 text-rose" />
                <select className="bg-transparent border-none focus:outline-none font-medium text-sm w-full">
                  <option>Gorakhpur, UP</option>
                </select>
              </div>
              
              <nav className="space-y-3">
                <a href="#how-it-works" className="block text-sm font-semibold hover:text-rose transition-colors py-2">
                  How It Works
                </a>
                <a href="#success-stories" className="block text-sm font-semibold hover:text-rose transition-colors py-2">
                  Success Stories
                </a>
                <Link to="/ContactUs" className="block text-sm font-semibold hover:text-rose transition-colors py-2">
                  Contact Us
                </Link>
              </nav>

              <div className="space-y-3 pt-4 border-t">
                <Button variant="ghost" size="sm" className="w-full justify-start font-semibold">
                  <Search className="h-4 w-4 mr-2" />
                  Quick Search
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowAuthModal(true)}
                  className="w-full font-semibold"
                >
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
                <Button 
                  variant="hero" 
                  size="sm"
                  className="w-full font-semibold"
                  onClick={handleRegisterClick}
                >
                  Register Free
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;