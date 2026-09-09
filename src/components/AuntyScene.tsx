import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

type SceneStatus = "loading" | "ready" | "error";

/* aunty.glb arrives normalised to a unit cube centred on the origin, so it is
   scaled to this height and re-grounded once the bounding box is known. */
const TARGET_HEIGHT = 2.2;

/* Camera distance is what sets how much of the frame she fills: the vertical
   span visible at her plane is 2 * dist * tan(fov / 2), so 4.0 leaves just
   over 10% headroom above TARGET_HEIGHT. */
const CAMERA_DISTANCE = 4;

/* Scroll travel, as a fraction of the viewport, over which her turn plays out.
   She sits at the top of the page and is mostly scrolled away by half a
   viewport, so the turn has to finish inside that or it plays off-screen. */
const SCROLL_RANGE = 0.45;

export function AuntyScene() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<SceneStatus>("loading");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let animationFrame = 0;
    let disposed = false;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, TARGET_HEIGHT / 2, CAMERA_DISTANCE);
    camera.lookAt(0, TARGET_HEIGHT / 2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    /* The model is authored fully metallic with its metal/roughness map doing
       the work, so it needs an environment to reflect or it renders black. */
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.55;

    const keyLight = new THREE.DirectionalLight(0xffe4bd, 2.6);
    keyLight.position.set(3, 5.5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -2.5;
    keyLight.shadow.camera.right = 2.5;
    keyLight.shadow.camera.top = 3.5;
    keyLight.shadow.camera.bottom = -1;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf4a5bd, 1.5);
    fillLight.position.set(-4, 2.5, 2);
    scene.add(fillLight);
    scene.add(new THREE.HemisphereLight(0xffefd1, 0x6b1735, 1.6));

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(2.2, 64),
      new THREE.ShadowMaterial({ color: 0x78223c, opacity: 0.16 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    let aunty: THREE.Object3D | undefined;
    let restingY = 0;
    const clock = new THREE.Clock();

    /* She is driven entirely by scroll position, not by the pointer: 0 with the
       page at rest, 1 once the hero has scrolled away. The rendered value is
       eased towards the target so a jumpy wheel still reads as a smooth turn. */
    let scrollTarget = 0;
    let scrollCurrent = 0;

    const readScroll = () => {
      scrollTarget = THREE.MathUtils.clamp(
        window.scrollY / (window.innerHeight * SCROLL_RANGE || 1),
        0,
        1,
      );
    };

    readScroll();
    window.addEventListener("scroll", readScroll, { passive: true });

    new GLTFLoader().load(
      "/aunty.glb",
      (gltf) => {
        if (disposed) return;
        aunty = gltf.scene;

        /* Normalise: centre on X/Z, scale to TARGET_HEIGHT, sit on the floor. */
        const box = new THREE.Box3().setFromObject(aunty);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const scale = TARGET_HEIGHT / (size.y || 1);
        aunty.scale.setScalar(scale);
        aunty.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
        restingY = aunty.position.y;

        aunty.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.castShadow = true;
            object.receiveShadow = true;
          }
        });

        scene.add(aunty);
        setStatus("ready");
      },
      (event) => {
        if (!disposed && event.total > 0) {
          setProgress(Math.round((event.loaded / event.total) * 100));
        }
      },
      () => {
        if (!disposed) setStatus("error");
      },
    );

    const resize = () => {
      const { clientWidth: width, clientHeight: height } = host;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    const render = () => {
      const elapsed = clock.getElapsedTime();
      scrollCurrent = THREE.MathUtils.lerp(scrollCurrent, scrollTarget, 0.07);
      if (aunty) {
        /* Scroll scrubs the turn: she pivots to face the page and settles down
           a touch, as if leaning over the counter. */
        aunty.rotation.y = scrollCurrent * 0.62;
        aunty.rotation.z = scrollCurrent * -0.045;
        aunty.position.y = restingY - scrollCurrent * 0.075;
        if (!reduceMotion) {
          aunty.position.y += Math.sin(elapsed * 1.1) * 0.018;
          aunty.rotation.z += Math.sin(elapsed * 0.85) * 0.008;
        }
      }
      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
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
  }, []);

  return (
    <div className="aunty-3d" aria-label="3D model of the baker behind Bakesbymom">
      <div ref={hostRef} className="aunty-3d__canvas" />
      {status === "loading" && (
        <span className="aunty-3d__status">
          {progress > 0 ? `Warming the kitchen… ${progress}%` : "Warming the kitchen…"}
        </span>
      )}
      {status === "error" && <span className="aunty-3d__status">The 3D scene could not load.</span>}
    </div>
  );
}
