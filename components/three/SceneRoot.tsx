"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

export default function SceneRoot() {
  return (
    <div id="scene-root">
      <Scene />
    </div>
  );
}
