"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import CameraRig from "./CameraRig";
import Cake from "./Cake";
import FloatingDesserts from "./FloatingDesserts";
import AmbientParticles from "./AmbientParticles";
import { CookieStack, MacaronTower, GiftBox } from "./SetPieces";

export default function Scene({
  frameloop = "always",
}: {
  frameloop?: "always" | "never" | "demand";
}) {
  // Auto-scale resolution down on weaker machines (and back up when there's headroom).
  const [dpr, setDpr] = useState(1.25);

  return (
    <Canvas
      // Shadows are the single biggest cost here and barely visible behind the
      // bloom + fog, so they stay off for a smooth framerate.
      shadows={false}
      // Pause the render loop entirely when the scene is offscreen or the tab
      // is hidden — this is what kills the "lag after leaving it open" problem.
      frameloop={frameloop}
      dpr={dpr}
      // Adaptive throttle: lets R3F drop quality instead of dropping frames.
      performance={{ min: 0.5 }}
      // Postprocessing does its own anti-aliasing, so we can skip MSAA on the canvas.
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      }}
      camera={{ position: [2.2, 1.6, 7.5], fov: 45, near: 0.1, far: 100 }}
    >
      <color attach="background" args={["#1A120B"]} />
      <fog attach="fog" args={["#1A120B", 8, 22]} />

      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(1.5)}
      />

      <ambientLight intensity={0.6} color="#F3E5CE" />
      <directionalLight position={[3, 6, 4]} intensity={2.1} color="#FFE4B5" />
      <pointLight position={[-4, 3, 2]} intensity={1.3} color="#C9A074" distance={15} />
      <pointLight position={[0, 4, -4]} intensity={0.9} color="#C98A6A" distance={10} />

      <Suspense fallback={null}>
        <CameraRig />

        {/* Hero centerpiece */}
        <Cake position={[1.2, -0.4, 0]} scale={0.85} />

        {/* Set pieces positioned along the camera's path so they reveal in sequence */}
        <MacaronTower position={[-3, -0.6, -2]} />
        <CookieStack position={[0, -1.2, -3]} />
        <GiftBox position={[-4, -0.4, -1]} />
        <GiftBox position={[3.5, -1, -4]} />

        <FloatingDesserts count={16} spread={16} />
        <AmbientParticles count={140} spread={22} />
      </Suspense>

      {/* Lighter composer: bloom glow + vignette only, no MSAA, no depth-of-field. */}
      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom
          intensity={0.4}
          luminanceThreshold={0.7}
          luminanceSmoothing={0.3}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.18} darkness={0.62} />
      </EffectComposer>

      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
