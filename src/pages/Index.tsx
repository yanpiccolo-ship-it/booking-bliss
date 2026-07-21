import Navbar from "@/components/Navbar";
import HeroVideo from "@/components/HeroVideo";
import ModuleCarousel from "@/components/ModuleCarousel";
import EditorialSection from "@/components/EditorialSection";
import AIAgents from "@/components/AIAgents";
import ShowcaseTrio from "@/components/ShowcaseTrio";
import Verticals from "@/components/Verticals";
import Pricing from "@/components/Pricing";
import SocialProof from "@/components/SocialProof";
import EditorialNotesCarousel from "@/components/EditorialNotesCarousel";
import Marketplace from "@/components/Marketplace";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { SalesChatWidget } from "@/components/SalesChat";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroVideo />
      <ModuleCarousel />
      <EditorialSection />
      <AIAgents />
      <ShowcaseTrio />
      <Verticals />
      <Pricing />
      <EditorialNotesCarousel />
      <Marketplace />
      <CTA />
      <SocialProof />
      <FAQ />
      <Footer />

      {/* AI Sales Agent Chat Widget */}
      <SalesChatWidget />
    </div>
  );
};

export default Index;
