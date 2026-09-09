import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const FOV = 30;

/* Padding around the model's bounding sphere, so nothing clips as the stage
   auto-rotates and the box is re-fitted on resize. */
const FIT_MARGIN = 1.18;

interface FlowModelProps {
  /** Path under public/, e.g. "/mixer.glb". */
  src: string;
  /** Describes the prop for assistive tech, e.g. "Stand mixer". */
  label: string;
}

/**
 * A single prop from public/ rendered into one stage of the ritual flow.
 *
 * These models are ~10 MB each and the flow sits well below the fold, so
 * nothing is fetched until the stage nears the viewport, and the render loop
 * only runs while it is on screen.
 */
export function FlowModel({ src, label }: FlowModelProps) {
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
    let radius = 1;
    const clock = new THREE.Clock();

    /* Distance depends on aspect: a stage narrower than it is tall has to pull
       back further or the model overflows sideways. */
    const fit = () => {
      const { clientWidth: width, clientHeight: height } = host;
      if (!width || !height) return;
      const aspect = width / height;
      const half = (FOV * Math.PI) / 360;
      const forHeight = radius / Math.sin(half);
      const forWidth = radius / Math.sin(Math.atan(Math.tan(half) * aspect));
      const distance = Math.max(forHeight, forWidth) * FIT_MARGIN;

      camera.aspect = aspect;
      camera.position.set(0, radius * 0.3, distance);
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

          /* Every prop ships normalised to a unit cube on the origin, but centre
             and re-fit from the real bounds rather than trusting that. */
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center);
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
      if (model && !reduceMotion) {
        /* Sway around the authored front rather than spinning: in a box this
           small a full rotation shows the model's back half the time. */
        const elapsed = clock.getElapsedTime();
        model.rotation.y = Math.sin(elapsed * 0.5) * 0.36;
        model.position.y = Math.sin(elapsed * 1.05) * radius * 0.02;
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
  }, [src]);

  return (
    <div
      ref={hostRef}
      className={`flow-model ${failed ? "flow-model--failed" : ""}`.trim()}
      role="img"
      aria-label={label}
    />
  );
}
