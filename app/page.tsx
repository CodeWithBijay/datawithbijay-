import Background from "@/components/Background";
import Pixel from "@/components/Pixel";
import Boot from "@/components/Boot";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import About from "@/components/About";
import Work from "@/components/Work";
import Activity from "@/components/Activity";
import Journey from "@/components/Journey";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Palette from "@/components/Palette";
import Effects from "@/components/Effects";

export default function Home() {
  return (
    <>
      <Background />
      <Pixel />
      <Boot />
      <Nav />
      <main className="wrap" id="top">
        <Hero />
        <Skills />
        <About />
        <Work />
        <Activity />
        <Journey />
        <Contact />
        <Footer />
      </main>
      <Palette />
      <Effects />
    </>
  );
}
