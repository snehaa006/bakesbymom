"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type FloaterType = "macaron" | "donut" | "cookie" | "cherry" | "star";

interface FloaterDef {
  type: FloaterType;
  position: [number, number, number];
  color: string;
  scale: number;
  speed: number;
  offset: number;
  spin: [number, number, number];
}

function Macaron({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.09, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.34, 0.16, 32]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.09, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.32, 0.16, 32]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.08, 32]} />
        <meshStandardMaterial color="#FFFAF0" roughness={0.5} />
      </mesh>
    </group>
  );
}

function Donut({ color }: { color: string }) {
  return (
    <mesh castShadow>
      <torusGeometry args={[0.3, 0.14, 12, 28]} />
      <meshStandardMaterial color={color} roughness={0.45} metalness={0.05} />
    </mesh>
  );
}

function Cookie({ color }: { color: string }) {
  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.1, 24]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.15, 0.06, Math.sin(a) * 0.15]}
          >
            <sphereGeometry args={[0.035, 6, 6]} />
            <meshStandardMaterial color="#3D2010" roughness={0.7} />
          </mesh>
        );
      })}
    </group>
  );
}

function Cherry({ color }: { color: string }) {
  return (
    <group>
      <mesh castShadow>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0.02, 0.18, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.012, 0.012, 0.2, 6]} />
        <meshStandardMaterial color="#4A6B2A" roughness={0.6} />
      </mesh>
    </group>
  );
}

function StarSprinkle({ color }: { color: string }) {
  return (
    <mesh castShadow>
      <octahedronGeometry args={[0.16, 0]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.3} />
    </mesh>
  );
}

function FloaterMesh({ type, color }: { type: FloaterType; color: string }) {
  switch (type) {
    case "macaron":
      return <Macaron color={color} />;
    case "donut":
      return <Donut color={color} />;
    case "cookie":
      return <Cookie color={color} />;
    case "cherry":
      return <Cherry color={color} />;
    case "star":
      return <StarSprinkle color={color} />;
  }
}

const PALETTE = ["#F5D5C0", "#E8A87C", "#C9A96E", "#D4A5A0", "#F8EDD8", "#E8C5B0", "#8BAA7A"];

function makeFloaters(count: number, spread: number, seedOffset = 0): FloaterDef[] {
  const types: FloaterType[] = ["macaron", "donut", "cookie", "cherry", "star"];
  return Array.from({ length: count }, (_, i) => {
    const seed = i + seedOffset;
    const rand = (n: number) => {
      const x = Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453;
      return x - Math.floor(x);
    };
    return {
      type: types[Math.floor(rand(1) * types.length)],
      position: [
        (rand(2) - 0.5) * spread,
        (rand(3) - 0.5) * spread * 0.6,
        (rand(4) - 0.5) * spread * 0.5,
      ],
      color: PALETTE[Math.floor(rand(5) * PALETTE.length)],
      scale: 0.6 + rand(6) * 0.8,
      speed: 0.2 + rand(7) * 0.4,
      offset: rand(8) * Math.PI * 2,
      spin: [rand(9) * 0.01, rand(10) * 0.012, rand(11) * 0.008],
    };
  });
}

export default function FloatingDesserts({
  count = 24,
  spread = 16,
}: {
  count?: number;
  spread?: number;
}) {
  const defs = useMemo(() => makeFloaters(count, spread), [count, spread]);
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const mouseTarget = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    mouseTarget.current.x += (state.pointer.x - mouseTarget.current.x) * 0.03;
    mouseTarget.current.y += (state.pointer.y - mouseTarget.current.y) * 0.03;

    if (group.current) {
      group.current.children.forEach((child, i) => {
        const def = defs[i];
        if (!def) return;
        child.position.y =
          def.position[1] + Math.sin(t * def.speed + def.offset) * 0.4;
        child.position.x =
          def.position[0] +
          Math.cos(t * def.speed * 0.6 + def.offset) * 0.3 +
          mouseTarget.current.x * 1.2;
        child.rotation.x += def.spin[0];
        child.rotation.y += def.spin[1];
        child.rotation.z += def.spin[2];
      });
      group.current.position.z = mouseTarget.current.y * 0.6;
    }
  });

  return (
    <group ref={group}>
      {defs.map((def, i) => (
        <group key={i} position={def.position} scale={def.scale}>
          <FloaterMesh type={def.type} color={def.color} />
        </group>
      ))}
    </group>
  );
}
