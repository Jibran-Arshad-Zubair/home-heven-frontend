import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ScrollStory from "@/components/ScrollStory";
import VideoSection from "@/components/VideoSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <ScrollStory />
      <VideoSection />
      <FAQSection /> 
      <Footer />
    </main>
  );
}