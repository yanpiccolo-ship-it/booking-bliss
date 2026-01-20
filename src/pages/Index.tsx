import Navbar from "@/components/Navbar";
import HeroVideo from "@/components/HeroVideo";
import ModuleCarousel from "@/components/ModuleCarousel";
import EditorialSection from "@/components/EditorialSection";
import AIAgents from "@/components/AIAgents";
import Verticals from "@/components/Verticals";
import Pricing from "@/components/Pricing";
import SocialProof from "@/components/SocialProof";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroVideo />
      <ModuleCarousel />
      <EditorialSection />
      <AIAgents />
      <Verticals />
      <SocialProof />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
