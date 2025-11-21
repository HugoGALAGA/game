import Navbar from "@/components/Navbar";
import SocialSidebar from "@/components/SocialSidebar";
import HeroSection from "@/components/HeroSection";
import StorySection from "@/components/StorySection";
import CharactersSection from "@/components/CharactersSection";
import GameFeaturesCarousel from "@/components/GameFeaturesCarousel";
import RankingSection from "@/components/RankingSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen text-foreground overflow-x-hidden">
      <Navbar />
      <SocialSidebar />
      
      <main className="animate-fade-in">
        <HeroSection />
        <StorySection />
        <CharactersSection />
        <GameFeaturesCarousel />
        <RankingSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
