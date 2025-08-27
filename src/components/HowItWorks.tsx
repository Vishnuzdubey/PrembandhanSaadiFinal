import { UserPlus, Search, MessageCircle, Heart, Shield, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AuthModal from "./AuthModal";

const HowItWorks = (props: React.HTMLAttributes<HTMLElement>) => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleRegisterClick = () => {
    setShowAuthModal(true);
  };
  const steps = [
    {
      icon: UserPlus,
      title: "Create Your Profile",
      description: "Register with your basic details and create a comprehensive profile with photos, education, and family background",
      color: "text-rose",
      bgColor: "bg-rose/10",
      features: ["Free Registration", "Photo Upload", "Family Details"]
    },
    {
      icon: Search,
      title: "Smart Matching",
      description: "Our advanced algorithm matches you with compatible profiles based on your preferences and family values",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      features: ["AI Matching", "Filter Search", "Compatibility Score"]
    },
    {
      icon: MessageCircle,
      title: "Connect Safely",
      description: "Express interest and communicate through our secure platform with privacy protection at every step",
      color: "text-green-600",
      bgColor: "bg-green-50",
      features: ["Secure Chat", "Contact Exchange", "Privacy Controls"]
    },
    {
      icon: Heart,
      title: "Meet & Decide",
      description: "Meet in person with family involvement and take the next step towards your beautiful journey together",
      color: "text-gold",
      bgColor: "bg-gold/10",
      features: ["Family Meeting", "Personalized Support", "Success Guarantee"]
    }
  ];

  return (
    <>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <section id={props.id} className="py-20 bg-gradient-to-br from-background via-rose/5 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-rose/10 rounded-full px-6 py-2 mb-6">
            <Clock className="w-4 h-4 text-rose" />
            <span className="text-sm font-semibold text-rose">Simple 4-Step Process</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Your Journey to{" "}
            <span className="text-rose">Happily Ever After</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Finding your perfect life partner has never been easier. Our proven 4-step process 
            has helped thousands of couples in Gorakhpur find their soulmates.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-rose/30 to-transparent transform -translate-y-1/2 z-0" />
              )}
              
              {/* Card */}
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 border border-gray-100">
                {/* Step Number */}
                <div className="absolute -top-4 left-8 w-8 h-8 bg-rose text-white text-sm font-bold rounded-full flex items-center justify-center shadow-lg">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${step.bgColor} mb-6 group-hover:scale-110 transition-transform duration-200`}>
                  <step.icon className={`w-8 h-8 ${step.color}`} />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {step.description}
                </p>
                
                {/* Features */}
                <div className="space-y-2">
                  {step.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-rose/10 via-white to-gold/10 rounded-3xl p-8 md:p-12 border border-rose/20 mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-rose mb-2">4 Steps</div>
              <div className="text-sm text-muted-foreground font-medium">Simple Process</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-rose mb-2">24 Hrs</div>
              <div className="text-sm text-muted-foreground font-medium">Profile Approval</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-rose mb-2">100%</div>
              <div className="text-sm text-muted-foreground font-medium">Privacy Protected</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-rose mb-2">24/7</div>
              <div className="text-sm text-muted-foreground font-medium">Support Available</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-green-500" />
              <span className="text-lg font-semibold text-foreground">100% Safe & Secure</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of successful couples from Gorakhpur who found their perfect match.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero" 
                size="lg" 
                className="text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={handleRegisterClick}
              >
                Create Free Profile
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg font-semibold border-2 hover:bg-rose hover:border-rose hover:text-white transition-all duration-200"
                onClick={handleRegisterClick}
              >
                View Success Stories
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default HowItWorks;