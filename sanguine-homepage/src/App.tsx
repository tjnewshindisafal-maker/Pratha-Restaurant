import { MotionConfig } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Trust from "./components/Trust";
import Products from "./components/Products";
import Solutions from "./components/Solutions";
import Showcase from "./components/Showcase";
import Benefits from "./components/Benefits";
import Industries from "./components/Industries";
import Proof from "./components/Proof";
import About from "./components/About";
import LeadCta from "./components/LeadCta";
import EnquiryForm from "./components/EnquiryForm";
import Footer from "./components/Footer";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <Trust />
        <Products />
        <Solutions />
        <Showcase />
        <Benefits />
        <Industries />
        <Proof />
        <About />
        <LeadCta />
        <EnquiryForm />
      </main>
      <Footer />
    </MotionConfig>
  );
}
