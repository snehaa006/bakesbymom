"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { sampleCameraPath } from "@/lib/camera-path";
import { useScrollProgress } from "@/lib/scroll-context";

export default function CameraRig() {
  const { camera } = useThree();
  const progressRef = useScrollProgress();
  const currentPos = useRef(new THREE.Vector3(2.2, 1.6, 7.5));
  const currentLook = useRef(new THREE.Vector3(1.2, 0.8, 0));
  const mouseOffset = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const progress = progressRef.current.value;
    const target = sampleCameraPath(progress);

    // smooth lerp toward target waypoint position
    const lerpFactor = Math.min(1, delta * 1.8);
    currentPos.current.lerp(target.position, lerpFactor);
    currentLook.current.lerp(target.lookAt, lerpFactor);

    // mouse parallax offset, subtle
    mouseOffset.current.x +=
      (state.pointer.x * 0.4 - mouseOffset.current.x) * 0.04;
    mouseOffset.current.y +=
      (state.pointer.y * 0.25 - mouseOffset.current.y) * 0.04;

    camera.position.set(
      currentPos.current.x + mouseOffset.current.x,
      currentPos.current.y + mouseOffset.current.y,
      currentPos.current.z
    );

    const lookTarget = new THREE.Vector3(
      currentLook.current.x + mouseOffset.current.x * 0.5,
      currentLook.current.y + mouseOffset.current.y * 0.5,
      currentLook.current.z
    );
    camera.lookAt(lookTarget);

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov += (target.fov - camera.fov) * 0.05;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
