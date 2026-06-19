import * as THREE from "three";

export interface CameraWaypoint {
  progress: number;
  position: [number, number, number];
  lookAt: [number, number, number];
  fov?: number;
}

// Each waypoint corresponds to a scroll-progress checkpoint (0 to 1)
// mapped across the whole page. The rig interpolates smoothly between them.
export const CAMERA_PATH: CameraWaypoint[] = [
  // Hero: pulled back, cake centered-right, slight high angle
  { progress: 0, position: [2.2, 1.6, 7.5], lookAt: [1.2, 0.8, 0], fov: 45 },
  // Into collections: drift left and lower, grazing past floating desserts
  { progress: 0.14, position: [-3, 0.6, 5.5], lookAt: [0, 0.5, -1], fov: 48 },
  // Story section: push in close, dramatic, slightly below
  { progress: 0.3, position: [0.5, -0.4, 3.2], lookAt: [0, 0.2, -2], fov: 42 },
  // Process: rise up, wide sweeping view
  { progress: 0.46, position: [4, 2.4, 4], lookAt: [0, 0, 0], fov: 50 },
  // Gallery: orbit to the other side, descending
  { progress: 0.62, position: [-4.5, -0.8, 2.5], lookAt: [-1, 0, -1], fov: 46 },
  // Testimonials: settle center, calm
  { progress: 0.76, position: [0, 1.2, 6], lookAt: [0, 0.6, 0], fov: 44 },
  // Order/contact: pull back further, wide establishing shot
  { progress: 0.9, position: [1.5, 0.5, 8.5], lookAt: [0, 0.4, 0], fov: 48 },
  // Footer: final resting wide shot
  { progress: 1, position: [0, 1, 10], lookAt: [0, 0.5, 0], fov: 50 },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpVec3(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

// Smoothstep easing between waypoints for cinematic ease in/out
function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

export function sampleCameraPath(progress: number): {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
  fov: number;
} {
  const p = Math.min(Math.max(progress, 0), 1);

  let i = 0;
  for (; i < CAMERA_PATH.length - 1; i++) {
    if (p >= CAMERA_PATH[i].progress && p <= CAMERA_PATH[i + 1].progress) {
      break;
    }
  }
  const a = CAMERA_PATH[i];
  const b = CAMERA_PATH[Math.min(i + 1, CAMERA_PATH.length - 1)];
  const range = b.progress - a.progress || 1;
  const localT = smoothstep((p - a.progress) / range);

  const pos = lerpVec3(a.position, b.position, localT);
  const look = lerpVec3(a.lookAt, b.lookAt, localT);
  const fov = lerp(a.fov ?? 45, b.fov ?? 45, localT);

  return {
    position: new THREE.Vector3(...pos),
    lookAt: new THREE.Vector3(...look),
    fov,
  };
}
