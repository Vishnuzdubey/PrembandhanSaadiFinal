import React from "react";
import BrowseProfile from "@/components/BrowseProfile";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BrowseProfilePage = () => {
  const handleViewProfile = (profileId: string) => {
    // For now, just log. Later you can navigate to a profile detail page.
    console.log("View profile:", profileId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <BrowseProfile onViewProfile={handleViewProfile} />
      </main>
      <Footer />
    </div>
  );
};

export default BrowseProfilePage;
