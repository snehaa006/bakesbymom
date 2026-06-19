"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette, DepthOfField } from "@react-three/postprocessing";
import CameraRig from "./CameraRig";
import Cake from "./Cake";
import FloatingDesserts from "./FloatingDesserts";
import AmbientParticles from "./AmbientParticles";
import { CookieStack, MacaronTower, GiftBox } from "./SetPieces";

export default function Scene() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [2.2, 1.6, 7.5], fov: 45, near: 0.1, far: 100 }}
    >
      <color attach="background" args={["#16100A"]} />
      <fog attach="fog" args={["#16100A", 8, 22]} />

      <ambientLight intensity={0.55} color="#F8E8D0" />
      <directionalLight
        position={[3, 6, 4]}
        intensity={2.2}
        color="#FFE4B5"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-4, 3, 2]} intensity={1.4} color="#C9A96E" distance={15} />
      <pointLight position={[0, 4, -4]} intensity={0.9} color="#D4A5A0" distance={10} />
      <pointLight position={[-3, -1, 4]} intensity={0.7} color="#E8C5B0" distance={10} />

      <Suspense fallback={null}>
        <CameraRig />

        {/* Hero centerpiece */}
        <Cake position={[1.2, -0.4, 0]} scale={0.85} />

        {/* Set pieces positioned along the camera's path so they reveal in sequence */}
        <MacaronTower position={[-3, -0.6, -2]} />
        <CookieStack position={[0, -1.2, -3]} />
        <GiftBox position={[-4, -0.4, -1]} />
        <GiftBox position={[3.5, -1, -4]} />

        <FloatingDesserts count={28} spread={18} />
        <AmbientParticles count={250} spread={22} />
      </Suspense>

      <EffectComposer>
        <Bloom intensity={0.45} luminanceThreshold={0.65} luminanceSmoothing={0.3} mipmapBlur />
        <DepthOfField focusDistance={0.02} focalLength={0.04} bokehScale={3} />
        <Vignette eskil={false} offset={0.15} darkness={0.6} />
      </EffectComposer>
    </Canvas>
  );
}
