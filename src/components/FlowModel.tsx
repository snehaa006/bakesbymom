import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const FOV = 30;

/* Padding on the fitted distance, covering the idle bob and the fact that
   perspective brings the near side closer as the model sways. */
const FIT_MARGIN = 1.08;

/* Total scroll-driven swing, in radians. The fit has to account for half of it
   either side of the resting angle: turning a model presents a wider
   silhouette than its resting one. */
const SWING = 0.8;

interface FlowModelProps {
  /** Path under public/, e.g. "/mixer.glb". */
  src: string;
  /** Describes the prop for assistive tech, e.g. "Stand mixer". */
  label: string;
  /**
   * Y rotation in degrees that turns the model's real front to the camera.
   * None of these props are authored facing forward — the oven's door is at
   * 270, so at 0 it shows a blank back panel — so each one carries its own.
   */
  front: number;
  /**
   * How much room the prop takes relative to its stage box. Above 1 it grows
   * up and out past the box rather than being cropped, for a prop whose scene
   * holds more than one object and so reads small at the shared size.
   */
  scale?: number;
  /** Degrees the prop leans to the right, in the plane of the screen. */
  tilt?: number;
}

/**
 * A single prop from public/ rendered into one stage of the ritual flow.
 *
 * These models are ~10 MB each and the flow sits well below the fold, so
 * nothing is fetched until the stage nears the viewport, and the render loop
 * only runs while it is on screen.
 */
export function FlowModel({ src, label, front, scale = 1, tilt = 0 }: FlowModelProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let animationFrame = 0;
    let disposed = false;
    let onScreen = false;
    let started = false;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    /* These props are authored fully metallic with their metal/roughness map
       doing the work, so they need an environment to reflect or render black. */
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.62;

    const keyLight = new THREE.DirectionalLight(0xffe4bd, 2.4);
    keyLight.position.set(2.5, 4, 3.5);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xf4a5bd, 1.3);
    fillLight.position.set(-3, 1.5, 2);
    scene.add(fillLight);
    scene.add(new THREE.HemisphereLight(0xffefd1, 0x6b1735, 1.5));

    let model: THREE.Object3D | undefined;
    const half = new THREE.Vector3(0.5, 0.5, 0.5);
    let radius = 1;
    const clock = new THREE.Clock();

    /* Scrolling drives the turn, like the hero: 0 with the stage low in the
       viewport, 1 with it high, so moving up and down swings the prop either
       way around its front, which it faces when centred. */
    let scrollTarget = 0.5;
    let scrollCurrent = 0.5;

    const readScroll = () => {
      const rect = host.getBoundingClientRect();
      const centre = rect.top + rect.height / 2;
      scrollTarget = THREE.MathUtils.clamp(1 - centre / (window.innerHeight || 1), 0, 1);
    };

    readScroll();
    scrollCurrent = scrollTarget;
    window.addEventListener("scroll", readScroll, { passive: true });

    /* Fit to the bounding box, not the bounding sphere: these props are tall and
       thin, so a sphere fit wastes a third of the stage on empty margin. The
       horizontal term takes the wider of the resting and fully-swayed
       silhouettes, and a stage narrower than it is tall has to pull back
       further or the model overflows sideways. */
    const fit = () => {
      const { clientWidth: width, clientHeight: height } = host;
      if (!width || !height) return;
      const aspect = width / height;
      const halfFov = (FOV * Math.PI) / 360;
      /* Widest silhouette anywhere in the swing around the resting angle. */
      const base = (front * Math.PI) / 180;
      let horizontal = 0;
      for (let i = 0; i <= 8; i++) {
        const angle = base + (i / 8 - 0.5) * SWING;
        horizontal = Math.max(
          horizontal,
          Math.abs(half.x * Math.cos(angle)) + Math.abs(half.z * Math.sin(angle)),
        );
      }
      /* Leaning the prop trades width for height: bound the rotated silhouette
         rather than the upright one, or a tilted prop clips at the corners. */
      const lean = Math.abs((tilt * Math.PI) / 180);
      const leanedWidth = horizontal * Math.cos(lean) + half.y * Math.sin(lean);
      const leanedHeight = horizontal * Math.sin(lean) + half.y * Math.cos(lean);
      const forHeight = leanedHeight / Math.tan(halfFov);
      const forWidth = leanedWidth / (Math.tan(halfFov) * aspect);
      const distance = Math.max(forHeight, forWidth) * FIT_MARGIN;

      camera.aspect = aspect;
      camera.position.set(0, half.y * 0.22, distance);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const load = () => {
      if (started) return;
      started = true;
      new GLTFLoader().load(
        src,
        (gltf) => {
          if (disposed) return;
          model = gltf.scene;
          /* The lean is a screen-plane turn, so it has to sit outside the
             scroll-driven yaw: ZYX applies z last, in the camera's frame. */
          model.rotation.order = "ZYX";
          model.rotation.z = -(tilt * Math.PI) / 180;

          /* Every prop ships normalised to a unit cube on the origin, but centre
             and re-fit from the real bounds rather than trusting that. */
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center);
          box.getSize(half).multiplyScalar(0.5);
          radius = box.getBoundingSphere(new THREE.Sphere()).radius || 1;

          scene.add(model);
          fit();
        },
        undefined,
        () => {
          if (!disposed) setFailed(true);
        },
      );
    };

    const render = () => {
      scrollCurrent = THREE.MathUtils.lerp(scrollCurrent, scrollTarget, 0.08);
      if (model) {
        model.rotation.y = (front * Math.PI) / 180 + (scrollCurrent - 0.5) * SWING;
        if (!reduceMotion) {
          model.position.y = Math.sin(clock.getElapsedTime() * 1.05) * radius * 0.02;
        }
      }
      renderer.render(scene, camera);
      animationFrame = onScreen ? window.requestAnimationFrame(render) : 0;
    };

    /* Fetch just before the stage arrives, and only render while it is visible
       so four WebGL loops are never all running at once. */
    const observer = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0]?.isIntersecting ?? false;
        if (onScreen) {
          load();
          if (!animationFrame) render();
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(host);

    const resizeObserver = new ResizeObserver(fit);
    resizeObserver.observe(host);

    return () => {
      disposed = true;
      onScreen = false;
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", readScroll);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((value) => {
            Object.values(value).forEach((slot) => {
              if (slot instanceof THREE.Texture) slot.dispose();
            });
            value.dispose();
          });
        }
      });
      environment.texture.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [src, front, tilt]);

  return (
    <div
      ref={hostRef}
      className={`flow-model ${failed ? "flow-model--failed" : ""}`.trim()}
      style={{ "--flow-model-scale": scale } as CSSProperties}
      role="img"
      aria-label={label}
    />
  );
}
