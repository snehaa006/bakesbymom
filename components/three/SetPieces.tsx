"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function CookieStack({ position }: { position: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
    }
  });
  const colors = ["#C4843A", "#B8762E", "#CC9040"];
  return (
    <group ref={group} position={position}>
      {colors.map((c, i) => (
        <mesh key={i} position={[0, i * 0.12, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.55, 0.55, 0.1, 32]} />
          <meshStandardMaterial color={c} roughness={0.75} />
        </mesh>
      ))}
    </group>
  );
}

export function MacaronTower({ position }: { position: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  const colors = ["#D4A5A0", "#C9A96E", "#E8C5B0", "#8BAA7A", "#F5D5C0"];
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.08;
    }
  });
  return (
    <group ref={group} position={position}>
      {colors.map((c, i) => {
        const angle = (i / colors.length) * Math.PI * 2;
        const radius = 0.4 - i * 0.04;
        return (
          <group
            key={i}
            position={[
              Math.cos(angle) * radius,
              i * 0.22,
              Math.sin(angle) * radius,
            ]}
          >
            <mesh castShadow>
              <cylinderGeometry args={[0.28, 0.3, 0.14, 24]} />
              <meshStandardMaterial color={c} roughness={0.6} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export function GiftBox({ position }: { position: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (group.current) {
      group.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.6) * 0.08;
    }
  });
  return (
    <group ref={group} position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.5, 0.9]} />
        <meshStandardMaterial color="#2C1810" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.27, 0]}>
        <boxGeometry args={[1, 0.08, 1]} />
        <meshStandardMaterial color="#3D2218" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.05, 0.46]}>
        <boxGeometry args={[0.06, 0.5, 0.02]} />
        <meshStandardMaterial color="#C9A96E" roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.32, 0.05]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#C9A96E" roughness={0.3} metalness={0.4} />
      </mesh>
    </group>
  );
}
