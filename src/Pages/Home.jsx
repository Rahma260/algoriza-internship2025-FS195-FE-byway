import HeroSection from "../Components/Home/HeroSection";
import CountersSection from "../Components/Home/CounterSection";
import CategoriesSection from "../Components/Home/CategoriesSection";
import CoursesSection from "../Components/Home/CoursesSection";
import InstructorsSection from "../Components/Home/InstructorsSection";
import TestimonialsSection from "../Components/Home/TestimonialsSection";
import CallToAction from "../Components/Home/CallToAction";
import CallToActionTwo from "../Components/Home/CallToActionTwo";
import Footer from "../Components/Layout/Footer";
import Navbar from "../Components/Layout/Navbar";

function HomePage() {
  return (
    <div className="bg-white text-gray-900">
      <Navbar />
      <HeroSection />
      <CountersSection />
      <CategoriesSection />
      <CoursesSection />
      <InstructorsSection />
      <TestimonialsSection />
      <CallToAction />
      <CallToActionTwo />
      <Footer />
    </div>
  );
}

export default HomePage;
