import { useMemo } from "react";

const PARTICLE_COUNT = 34;

interface Particle {
  left: number;
  size: number;
  duration: number;
  delay: number;
}

export function FlourLayer() {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: PARTICLE_COUNT }, () => {
        const size = 2 + Math.random() * 4;
        const duration = 11 + Math.random() * 12;
        return {
          left: Math.random() * 100,
          size,
          duration,
          delay: -Math.random() * duration,
        };
      }),
    [],
  );

  return (
    <div className="flour-layer" aria-hidden="true">
      {particles.map((p, i) => (
        <span
          key={i}
          className="flour-speck"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
