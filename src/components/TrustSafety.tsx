import { Shield, Lock, UserCheck, Phone, Eye, AlertTriangle } from "lucide-react";

const TrustSafety = () => {
  const features = [
    {
      icon: UserCheck,
      title: "Verified Profiles",
      description: "All profiles go through strict verification process including document and photo verification"
    },
    {
      icon: Lock,
      title: "Privacy Protected",
      description: "Your contact details are kept private and shared only after mutual consent"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Advanced security measures protect your data with end-to-end encryption"
    },
    {
      icon: Phone,
      title: "Phone Verification",
      description: "Every member's phone number is verified through OTP for authentic connections"
    },
    {
      icon: Eye,
      title: "Profile Moderation",
      description: "Our team manually reviews each profile to ensure quality and authenticity"
    },
    {
      icon: AlertTriangle,
      title: "Report & Block",
      description: "Easy reporting system to maintain a safe and respectful community"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-rose/5 to-coral/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trust & Safety First
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your safety and privacy are our top priorities. We've built multiple layers of protection 
            to ensure you have a secure and trustworthy experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="group bg-white rounded-xl p-6 shadow-card hover:shadow-premium transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-rose/10 to-coral/10 flex items-center justify-center group-hover:from-rose/20 group-hover:to-coral/20 transition-all duration-300">
                    <feature.icon className="w-6 h-6 text-rose" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="bg-white rounded-2xl p-8 shadow-card">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Trusted by Millions
            </h3>
            <p className="text-muted-foreground">
              Join our community of verified members looking for meaningful relationships
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-rose mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Verified Profiles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-coral mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Customer Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gold mb-2">SSL</div>
              <div className="text-sm text-muted-foreground">Secure Connection</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-rose mb-2">ISO</div>
              <div className="text-sm text-muted-foreground">Certified Platform</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSafety;