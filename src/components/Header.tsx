import { Button } from "@/components/ui/button";
import { MapPin, Search, User, Heart, Phone, Shield, Menu, X, LogOut, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AuthModal from "./AuthModal";

const Header = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // Track token in state so UI updates when token is added/removed
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('prembandhanToken'));
  const { toast } = useToast();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const storedToken = localStorage.getItem('prembandhanToken');
    setToken(storedToken);

    if (storedToken) {
      try {
        const response = await fetch('https://pb-app-lac.vercel.app/api/v1/myprofile', {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUser(data.user);
          } else {
            // Token invalid according to API
            localStorage.removeItem('prembandhanToken');
            setToken(null);
          }
        } else {
          // Token is invalid, remove it
          localStorage.removeItem('prembandhanToken');
          setToken(null);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        localStorage.removeItem('prembandhanToken');
        setToken(null);
      }
    }

    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('prembandhanToken');
  setUser(null);
  setToken(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

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
                <span>+91 93691 67302</span>
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
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : token ? (
              user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={user.images?.[0]?.url}
                          alt={user.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-rose text-white">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.phone}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // Token exists but user data not yet loaded; show a simple My Account link
                <Link to="/profile" className="text-sm">
                  <Button variant="outline" size="sm" className="font-semibold">My Account</Button>
                </Link>
              )
            ) : (
              <>
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
              </>
            )}
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
                <Link to="/BrowseProfile" className="block text-sm font-semibold hover:text-rose transition-colors py-2">
                  Browse Profile
                </Link>
              </nav>

              <div className="space-y-3 pt-4 border-t">
                {isLoading ? (
                  <div className="w-full h-10 bg-gray-200 rounded-md animate-pulse"></div>
                ) : token ? (
                  user ? (
                  <>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={user.images?.[0]?.url}
                          alt={user.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-rose text-white">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.phone}</p>
                      </div>
                    </div>
                    <Link to="/profile" className="w-full">
                      <Button variant="outline" size="sm" className="w-full justify-start font-semibold">
                        <User className="h-4 w-4 mr-2" />
                        My Profile
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="w-full justify-start font-semibold"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                  ) : (
                    // Token exists but user not loaded yet - show quick account link
                    <>
                      <Link to="/profile">
                        <Button variant="outline" size="sm" className="w-full justify-start font-semibold">
                          <User className="h-4 w-4 mr-2" />
                          My Account
                        </Button>
                      </Link>
                    </>
                  )
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;