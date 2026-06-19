"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

export default function SceneRoot() {
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Honour reduced-motion: skip WebGL entirely and show a calm gradient.
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onMq = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onMq);

    // Stop rendering while the tab is in the background. Without this, the
    // animation loop keeps queuing work and the page feels heavy when you
    // come back to it minutes later.
    const onVisibility = () =>
      setFrameloop(document.hidden ? "never" : "always");
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      mq.removeEventListener("change", onMq);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  if (reducedMotion) {
    return (
      <div
        id="scene-root"
        className="ambient-bg"
        style={{ position: "fixed", inset: 0, zIndex: 0 }}
        aria-hidden
      />
    );
  }

  return (
    <div id="scene-root">
      <Scene frameloop={frameloop} />
    </div>
  );
}
