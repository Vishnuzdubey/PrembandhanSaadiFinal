import { Button } from "@/components/ui/button";
import { Search, MapPin, Filter, Shield, Users, Heart, Star } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-couple.jpg";
import AuthModal from "./AuthModal";



const Hero = () => {

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    gender: 'FEMALE',
    ageFrom: '18',
    ageTo: '25',
    caste: '',
    religion: '',
    education: '',
    income: '',
    minHeight: '',
    maxHeight: '',
    minWeight: '',
    maxWeight: '',
    state: '',
    district: '',
    featured: false
  });
  const navigate = useNavigate();
  const { toast } = useToast();


  const handleRegisterClick = () => {
    setShowAuthModal(true);
  };

  const handleFilterChange = (field: string, value: string | boolean) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = async () => {
    const token = localStorage.getItem('prembandhanToken');

    if (!token) {
      toast({
        title: "Login Required",
        description: "Please login or create a profile to search for matches",
        variant: "destructive",
      });
      setShowAuthModal(true);
      return;
    }

    // Build search parameters
    const searchParams = new URLSearchParams();

    // Add non-empty filters to search params
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value && value.toString().trim() !== '') {
        // Map form fields to API parameters
        if (key === 'ageFrom') searchParams.append('minAge', value.toString());
        else if (key === 'ageTo') searchParams.append('maxAge', value.toString());
        else if (key === 'featured' && value === true) searchParams.append('featured', 'true');
        else searchParams.append(key, value.toString());
      }
    });

    // Navigate to browse page with search filters
    navigate(`/browse?search=true&${searchParams.toString()}`);
  };

  const handleAdvancedSearch = () => {
    const token = localStorage.getItem('prembandhanToken');

    if (!token) {
      toast({
        title: "Login Required",
        description: "Please login or create a profile to access advanced search",
        variant: "destructive",
      });
      setShowAuthModal(true);
      return;
    }

    // Toggle advanced filters visibility
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  return (
    <>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <section className="relative min-h-[100vh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden pt-16 sm:pt-0">
        {/* Background Image with Enhanced Overlay */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Beautiful Indian wedding couple in traditional attire"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
        </div>

        {/* Floating Elements - Hidden on mobile for cleaner look */}
        <div className="hidden md:block absolute top-20 left-10 w-4 h-4 bg-gold/30 rounded-full animate-pulse" />
        <div className="hidden md:block absolute top-32 right-16 w-6 h-6 bg-rose/20 rounded-full animate-pulse delay-1000" />
        <div className="hidden md:block absolute bottom-40 left-20 w-3 h-3 bg-gold/40 rounded-full animate-pulse delay-500" />

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-1 sm:gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 sm:px-4 py-2 mb-4 sm:mb-6 mt-6">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-gold fill-gold" />
            <span className="text-xs sm:text-sm font-medium">Gorakhpur's Most Trusted Matrimonial Platform</span>
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-gold fill-gold" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2">
            Find Your Perfect{" "}
            <span className="animate-shimmer bg-gradient-to-r from-gold via-white to-gold bg-[length:200%_100%] bg-clip-text text-transparent">
              Life Partner
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 text-white/90 max-w-3xl mx-auto font-light leading-relaxed px-2">
            Connect with verified profiles from Gorakhpur and surrounding areas.
            <br className="hidden sm:block" />
            Join thousands of families who found their perfect match through us.
          </p>

          {/* Enhanced Search Form */}
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl max-w-5xl mx-auto border border-white/20 mb-8 sm:mb-16">
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6 text-center">Start Your Search</h3>

            {/* Basic Filters - Always Visible */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
              {/* Looking For */}
              <div className="space-y-2 sm:space-y-3">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose" />
                  Looking for
                </label>
                <select
                  value={searchFilters.gender}
                  onChange={(e) => handleFilterChange('gender', e.target.value)}
                  className="w-full h-12 sm:h-14 px-3 sm:px-4 rounded-lg sm:rounded-xl border-2 border-gray-200 bg-background text-foreground focus:ring-2 focus:ring-rose focus:border-rose transition-all duration-200 font-medium text-sm sm:text-base"
                >
                  <option value="FEMALE">Bride</option>
                  <option value="MALE">Groom</option>
                </select>
              </div>

              {/* Age Range */}
              <div className="space-y-2 sm:space-y-3">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-rose" />
                  Age Range
                </label>
                <div className="flex gap-2">
                  <select
                    value={searchFilters.ageFrom}
                    onChange={(e) => handleFilterChange('ageFrom', e.target.value)}
                    className="flex-1 h-12 sm:h-14 px-3 sm:px-4 rounded-lg sm:rounded-xl border-2 border-gray-200 bg-background text-foreground focus:ring-2 focus:ring-rose focus:border-rose transition-all duration-200 font-medium text-sm sm:text-base"
                  >
                    <option value="18">18</option>
                    <option value="21">21</option>
                    <option value="25">25</option>
                    <option value="30">30</option>
                    <option value="35">35</option>
                  </select>
                  <span className="flex items-center text-foreground">to</span>
                  <select
                    value={searchFilters.ageTo}
                    onChange={(e) => handleFilterChange('ageTo', e.target.value)}
                    className="flex-1 h-12 sm:h-14 px-3 sm:px-4 rounded-lg sm:rounded-xl border-2 border-gray-200 bg-background text-foreground focus:ring-2 focus:ring-rose focus:border-rose transition-all duration-200 font-medium text-sm sm:text-base"
                  >
                    <option value="25">25</option>
                    <option value="30">30</option>
                    <option value="35">35</option>
                    <option value="40">40</option>
                    <option value="50">50+</option>
                  </select>
                </div>
              </div>

              {/* Caste */}
              <div className="space-y-2 sm:space-y-3">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-rose" />
                  Caste
                </label>
                <select
                  value={searchFilters.caste}
                  onChange={(e) => handleFilterChange('caste', e.target.value)}
                  className="w-full h-12 sm:h-14 px-3 sm:px-4 rounded-lg sm:rounded-xl border-2 border-gray-200 bg-background text-foreground focus:ring-2 focus:ring-rose focus:border-rose transition-all duration-200 font-medium text-sm sm:text-base"
                >
                  <option value="">Select Caste</option>
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
            </div>

            {/* Advanced Filters - Show when toggled */}
            {showAdvancedFilters && (
              <>
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h4 className="text-sm font-semibold text-foreground mb-4 text-center">Advanced Filters</h4>

                  {/* Advanced Filters Row 1 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    {/* Religion */}
                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Star className="w-4 h-4 text-rose" />
                        Religion
                      </label>
                      <select
                        value={searchFilters.religion}
                        onChange={(e) => handleFilterChange('religion', e.target.value)}
                        className="w-full h-12 sm:h-14 px-3 sm:px-4 rounded-lg sm:rounded-xl border-2 border-gray-200 bg-background text-foreground focus:ring-2 focus:ring-rose focus:border-rose transition-all duration-200 font-medium text-sm sm:text-base"
                      >
                        <option value="">Select Religion</option>
                        <option value="Hindu">Hindu</option>
                        <option value="Muslim">Muslim</option>
                        <option value="Christian">Christian</option>
                        <option value="Sikh">Sikh</option>
                        <option value="Buddhist">Buddhist</option>
                        <option value="Jain">Jain</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Education */}
                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Shield className="w-4 h-4 text-rose" />
                        Education
                      </label>
                      <select
                        value={searchFilters.education}
                        onChange={(e) => handleFilterChange('education', e.target.value)}
                        className="w-full h-12 sm:h-14 px-3 sm:px-4 rounded-lg sm:rounded-xl border-2 border-gray-200 bg-background text-foreground focus:ring-2 focus:ring-rose focus:border-rose transition-all duration-200 font-medium text-sm sm:text-base"
                      >
                        <option value="">Select Education</option>
                        <option value="Bachelor">Bachelor</option>
                        <option value="B.Tech">B.Tech</option>
                        <option value="Master">Master</option>
                        <option value="PhD">PhD</option>
                        <option value="Professional">Professional</option>
                        <option value="Diploma">Diploma</option>
                        <option value="High School">High School</option>
                      </select>
                    </div>

                    {/* Annual Income */}
                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Shield className="w-4 h-4 text-rose" />
                        Annual Income
                      </label>
                      <select
                        value={searchFilters.income}
                        onChange={(e) => handleFilterChange('income', e.target.value)}
                        className="w-full h-12 sm:h-14 px-3 sm:px-4 rounded-lg sm:rounded-xl border-2 border-gray-200 bg-background text-foreground focus:ring-2 focus:ring-rose focus:border-rose transition-all duration-200 font-medium text-sm sm:text-base"
                      >
                        <option value="">Select Income</option>
                        <option value="0-3 LPA">0-3 LPA</option>
                        <option value="3-5 LPA">3-5 LPA</option>
                        <option value="5-10 LPA">5-10 LPA</option>
                        <option value="10-15 LPA">10-15 LPA</option>
                        <option value="15-25 LPA">15-25 LPA</option>
                        <option value="25+ LPA">25+ LPA</option>
                      </select>
                    </div>
                  </div>

                  {/* Advanced Filters Row 2 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    {/* State */}
                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-rose" />
                        State
                      </label>
                      <select
                        value={searchFilters.state}
                        onChange={(e) => handleFilterChange('state', e.target.value)}
                        className="w-full h-12 sm:h-14 px-3 sm:px-4 rounded-lg sm:rounded-xl border-2 border-gray-200 bg-background text-foreground focus:ring-2 focus:ring-rose focus:border-rose transition-all duration-200 font-medium text-sm sm:text-base"
                      >
                        <option value="">Select State</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Assam">Assam</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                        <option value="Uttarakhand">Uttarakhand</option>
                      </select>
                    </div>

                    {/* District */}
                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-rose" />
                        District
                      </label>
                      <input
                        type="text"
                        placeholder="Enter District"
                        value={searchFilters.district}
                        onChange={(e) => handleFilterChange('district', e.target.value)}
                        className="w-full h-12 sm:h-14 px-3 sm:px-4 rounded-lg sm:rounded-xl border-2 border-gray-200 bg-background text-foreground focus:ring-2 focus:ring-rose focus:border-rose transition-all duration-200 font-medium text-sm sm:text-base"
                      />
                    </div>

                    {/* Featured Profiles */}
                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-sm font-semibold text-foreground">Profile Type</label>
                      <label className="flex items-center space-x-2 h-12 sm:h-14">
                        <input
                          type="checkbox"
                          checked={searchFilters.featured}
                          onChange={(e) => handleFilterChange('featured', e.target.checked)}
                          className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                        />
                        <span className="text-sm text-foreground">Featured profiles only</span>
                      </label>
                    </div>
                  </div>

                  {/* Height and Weight Filters - Fixed Layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    {/* Height Range */}
                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-sm font-semibold text-foreground">Height Range (ft)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          step="0.1"
                          placeholder="Min Height"
                          value={searchFilters.minHeight}
                          onChange={(e) => handleFilterChange('minHeight', e.target.value)}
                          className="w-full h-10 px-3 rounded-lg border-2 border-gray-200 bg-background text-foreground focus:ring-2 focus:ring-rose focus:border-rose transition-all duration-200 text-sm"
                        />
                        <input
                          type="number"
                          step="0.1"
                          placeholder="Max Height"
                          value={searchFilters.maxHeight}
                          onChange={(e) => handleFilterChange('maxHeight', e.target.value)}
                          className="w-full h-10 px-3 rounded-lg border-2 border-gray-200 bg-background text-foreground focus:ring-2 focus:ring-rose focus:border-rose transition-all duration-200 text-sm"
                        />
                      </div>
                    </div>

                    {/* Weight Range */}
                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-sm font-semibold text-foreground">Weight Range (kg)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Min Weight"
                          value={searchFilters.minWeight}
                          onChange={(e) => handleFilterChange('minWeight', e.target.value)}
                          className="w-full h-10 px-3 rounded-lg border-2 border-gray-200 bg-background text-foreground focus:ring-2 focus:ring-rose focus:border-rose transition-all duration-200 text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Max Weight"
                          value={searchFilters.maxWeight}
                          onChange={(e) => handleFilterChange('maxWeight', e.target.value)}
                          className="w-full h-10 px-3 rounded-lg border-2 border-gray-200 bg-background text-foreground focus:ring-2 focus:ring-rose focus:border-rose transition-all duration-200 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="flex flex-col gap-3 sm:gap-4">
              <Button
                variant="hero"
                size="xl"
                className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={handleSearch}
              >
                <Search className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                Find Matches
              </Button>
              <Button
                variant="elegant"
                size="xl"
                className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={handleAdvancedSearch}
              >
                <Filter className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                {showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
              </Button>
            </div>
          </div>

          {/* Enhanced Trust Indicators */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto mb-8 sm:mb-12">
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gold mb-1 sm:mb-2">10L+</div>
                <div className="text-xs sm:text-sm text-white/90 font-medium">Verified Profiles</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gold mb-1 sm:mb-2">50K+</div>
                <div className="text-xs sm:text-sm text-white/90 font-medium">Success Stories</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gold mb-1 sm:mb-2">100%</div>
                <div className="text-xs sm:text-sm text-white/90 font-medium">Privacy Protected</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gold mb-1 sm:mb-2">24/7</div>
                <div className="text-xs sm:text-sm text-white/90 font-medium">Support</div>
              </div>
            </div>
          </div>

          {/* Security Badge */}

        </div>
      </section>
    </>
  );
};

export default Hero;