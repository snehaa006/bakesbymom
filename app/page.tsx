"use client";

import { useState } from "react";
import SceneRoot from "@/components/three/SceneRoot";
import Loader from "@/components/Loader";
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Collections from "@/components/sections/Collections";
import Story from "@/components/sections/Story";
import Process from "@/components/sections/Process";
import Gallery from "@/components/sections/Gallery";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import Order from "@/components/sections/Order";
import Footer from "@/components/sections/Footer";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Loader onDone={() => setLoaded(true)} />
      <SceneRoot />
      <Nav />
      <main id="scroll-content" className={loaded ? "" : "invisible"}>
        <Hero />
        <Marquee />
        <Collections />
        <Story />
        <Process />
        <Gallery />
        <Testimonials />
        <FAQ />
        <Order />
        <Footer />
      </main>
    </>
  );
}
