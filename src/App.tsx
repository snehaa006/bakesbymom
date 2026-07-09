import { useRef } from "react";
import { FlourLayer } from "./components/FlourLayer";
import { Seal } from "./components/Seal";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Ritual } from "./components/Ritual";
import { Breads } from "./components/Breads";
import { Timeline } from "./components/Timeline";
import { Visit } from "./components/Visit";
import { useNavAndSealScroll } from "./hooks/useScrollEffects";

function App() {
  const navRef = useRef<HTMLElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);

  useNavAndSealScroll(navRef, sealRef);

  return (
    <div className="page">
      <FlourLayer />
      <div className="ambient-glow" />
      <Seal ref={sealRef} />
      <Nav ref={navRef} />

      <main id="top">
        <Hero />
        <Ritual />
        <Breads />
        <Timeline />
        <Visit />
      </main>
    </div>
  );
}

export default App;
