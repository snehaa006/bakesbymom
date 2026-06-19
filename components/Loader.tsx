"use client";

import { useEffect, useState } from "react";

export default function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + Math.random() * 4 + 1);
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => setHidden(true), 400);
          setTimeout(() => {
            setRemoved(true);
            onDone();
          }, 1200);
        }
        return next;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [onDone]);

  if (removed) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-dark flex flex-col items-center justify-center transition-opacity duration-700 ${
        hidden ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="font-serif text-3xl text-cream tracking-wide mb-8">
        Bakes by <span className="text-champagne italic">Mom</span>
      </div>
      <div className="w-48 h-px bg-champagne/20 relative overflow-hidden">
        <div
          className="h-full bg-champagne transition-[width] duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-xs tracking-[0.25em] text-champagne/50 mt-4">
        {Math.floor(progress)}%
      </div>
    </div>
  );
}
