"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function FrostingDrips({
  radius,
  y,
  color,
}: {
  radius: number;
  y: number;
  color: string;
}) {
  const drips = useRef<THREE.Group>(null);
  const count = 14;
  const items = Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2 + Math.sin(i) * 0.1;
    const len = 0.1 + Math.random() * 0.22;
    return { a, len };
  });
  return (
    <group ref={drips} position={[0, y, 0]}>
      <mesh>
        <cylinderGeometry args={[radius + 0.04, radius + 0.04, 0.14, 64]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.05} />
      </mesh>
      {items.map((d, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(d.a) * radius,
            -d.len / 2 + 0.02,
            Math.sin(d.a) * radius,
          ]}
        >
          <cylinderGeometry args={[0.035, 0.02, d.len, 8]} />
          <meshStandardMaterial color={color} roughness={0.25} metalness={0.05} />
        </mesh>
      ))}
    </group>
  );
}

function Flower({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  return (
    <group position={position}>
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.12, 0, Math.sin(a) * 0.12]}
            rotation={[0, a, 0]}
          >
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color={color} roughness={0.5} />
          </mesh>
        );
      })}
      <mesh>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#FFE066" roughness={0.3} />
      </mesh>
    </group>
  );
}

export default function Cake({
  position = [0, 0, 0] as [number, number, number],
  scale = 1,
}) {
  const group = useRef<THREE.Group>(null);
  const flame = useRef<THREE.Mesh>(null);
  const flameLight = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y += 0.0022;
      group.current.position.y = position[1] + Math.sin(t * 0.5) * 0.06;
    }
    if (flame.current) {
      flame.current.scale.y = 0.9 + Math.sin(t * 8) * 0.2;
    }
    if (flameLight.current) {
      flameLight.current.intensity = 1.8 + Math.sin(t * 8) * 0.5;
    }
  });

  // Pink ombré tiers — deep raspberry base rising to a soft blush top.
  const layers = [
    { r: 1.8, h: 0.7, y: 0, col: "#F58BB0" },
    { r: 1.4, h: 0.7, y: 0.75, col: "#FBB6CE" },
    { r: 1.0, h: 0.7, y: 1.45, col: "#FDE3EC" },
  ];

  return (
    <group ref={group} position={position} scale={scale}>
      {layers.map((l, i) => (
        <group key={i}>
          <mesh position={[0, l.y, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[l.r, l.r, l.h, 64]} />
            <meshStandardMaterial color={l.col} roughness={0.5} metalness={0.05} />
          </mesh>
          <FrostingDrips radius={l.r} y={l.y + l.h / 2 - 0.02} color="#FFF3E0" />
        </group>
      ))}

      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.7, 2.2, Math.sin(a) * 0.7]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#FF477E" roughness={0.15} metalness={0.55} />
          </mesh>
        );
      })}

      <mesh position={[0, 2.45, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 12]} />
        <meshStandardMaterial color="#FFE7EF" roughness={0.4} />
      </mesh>
      <mesh ref={flame} position={[0, 2.78, 0]} scale={[1, 1.8, 1]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial
          color="#FFCC66"
          emissive="#FF9933"
          emissiveIntensity={2}
          roughness={0}
        />
      </mesh>
      <pointLight ref={flameLight} position={[0, 2.78, 0]} color="#FF9933" intensity={2} distance={3} />

      <Flower position={[-0.25, 2.12, -0.15]} color="#EC1E5A" />
      <Flower position={[0.2, 2.12, 0.2]} color="#FF5C8A" />
      <Flower position={[0, 2.12, 0.3]} color="#F78FB3" />

      <mesh position={[0, -0.35, 0]} receiveShadow>
        <cylinderGeometry args={[2.2, 2.0, 0.1, 64]} />
        <meshStandardMaterial color="#FDFCFA" roughness={0.2} metalness={0.1} />
      </mesh>
    </group>
  );
}
