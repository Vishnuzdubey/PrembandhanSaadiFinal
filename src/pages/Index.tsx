import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProfiles from "@/components/FeaturedProfiles";
import HowItWorks from "@/components/HowItWorks";
import TrustSafety from "@/components/TrustSafety";
import SuccessStories from "@/components/SuccessStories";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <FeaturedProfiles />
  <HowItWorks id="how-it-works" />
        <TrustSafety />
  <SuccessStories id="success-stories" />
      </main>
      <Footer />
    </div>
  );
};

export default Index;