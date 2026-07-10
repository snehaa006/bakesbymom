import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

type SceneStatus = "loading" | "ready" | "error";

export function BakerScene() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<SceneStatus>("loading");

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let animationFrame = 0;
    let disposed = false;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(3.85, 2.65, 6.4);
    camera.lookAt(0, 1.28, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const keyLight = new THREE.DirectionalLight(0xffe4bd, 3.2);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -4;
    keyLight.shadow.camera.right = 4;
    keyLight.shadow.camera.top = 4;
    keyLight.shadow.camera.bottom = -2;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf4a5bd, 2.1);
    fillLight.position.set(-5, 3, 2);
    scene.add(fillLight);
    scene.add(new THREE.HemisphereLight(0xffefd1, 0x6b1735, 2.3));

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(2.7, 64),
      new THREE.ShadowMaterial({ color: 0x78223c, opacity: 0.16 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.025;
    floor.receiveShadow = true;
    scene.add(floor);

    let baker: THREE.Object3D | undefined;
    let head: THREE.Object3D | undefined;
    let leftArm: THREE.Object3D | undefined;
    let rightArm: THREE.Object3D | undefined;
    let pipingBag: THREE.Object3D | undefined;
    const clock = new THREE.Clock();
    const pointerTarget = new THREE.Vector2();
    const pointerCurrent = new THREE.Vector2();
    let scrollIntensity = 0;
    let scrollTarget = 0;

    const updateScrollIntensity = () => {
      const bounds = host.getBoundingClientRect();
      const distance = window.innerHeight - bounds.top;
      scrollTarget = THREE.MathUtils.clamp(distance / (window.innerHeight + bounds.height * 0.15), 0, 1);
    };

    const moveFace = (event: PointerEvent) => {
      const bounds = host.getBoundingClientRect();
      pointerTarget.set(
        THREE.MathUtils.clamp(((event.clientX - bounds.left) / bounds.width - 0.5) * 2, -1, 1),
        THREE.MathUtils.clamp(((event.clientY - bounds.top) / bounds.height - 0.5) * 2, -1, 1),
      );
    };

    const resetFace = () => pointerTarget.set(0, 0);
    updateScrollIntensity();
    window.addEventListener("scroll", updateScrollIntensity, { passive: true });
    host.addEventListener("pointermove", moveFace);
    host.addEventListener("pointerleave", resetFace);

    new GLTFLoader().load(
      "/models/baker-decorating-cake.glb",
      (gltf) => {
        if (disposed) return;
        baker = gltf.scene;
        baker.rotation.y = -0.16;
        baker.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.castShadow = true;
            object.receiveShadow = true;
          }
        });
        head = baker.getObjectByName("Baker_Head");
        leftArm = baker.getObjectByName("Baker_Arm_Left");
        rightArm = baker.getObjectByName("Baker_Arm_Right");
        pipingBag = baker.getObjectByName("Piping_Bag");
        scene.add(baker);
        setStatus("ready");
      },
      undefined,
      () => {
        if (!disposed) setStatus("error");
      },
    );

    const resize = () => {
      const { clientWidth: width, clientHeight: height } = host;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    const render = () => {
      const elapsed = clock.getElapsedTime();
      pointerCurrent.lerp(pointerTarget, 0.08);
      scrollIntensity = THREE.MathUtils.lerp(scrollIntensity, scrollTarget, 0.055);
      if (baker) {
        const decoratingBeat = elapsed * (1.2 + scrollIntensity * 2.1);
        const pipingMotion = Math.sin(decoratingBeat * 2.25);
        baker.position.y = Math.sin(elapsed * 1.15) * 0.014 - scrollIntensity * 0.045;
        baker.position.x = scrollIntensity * -0.08;
        if (head) {
          head.rotation.x = pointerCurrent.y * -0.07;
          head.rotation.y = pointerCurrent.x * 0.22;
          head.rotation.z = 0.12 + Math.sin(elapsed * 1.45) * 0.025 + pointerCurrent.x * -0.025;
        }
        if (leftArm) leftArm.rotation.z = 0.7 + pipingMotion * (0.025 + scrollIntensity * 0.07);
        if (rightArm) rightArm.rotation.z = -0.74 + Math.sin(decoratingBeat * 2.25 + 0.35) * (0.02 + scrollIntensity * 0.06);
        if (pipingBag) pipingBag.position.y = 1.35 + pipingMotion * (0.012 + scrollIntensity * 0.04);
      }
      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", updateScrollIntensity);
      host.removeEventListener("pointermove", moveFace);
      host.removeEventListener("pointerleave", resetFace);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((value) => value.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className="baker-3d" aria-label="Interactive 3D scene of a baker decorating a cake">
      <div ref={hostRef} className="baker-3d__canvas" />
      {status === "loading" && <span className="baker-3d__status">Preparing the cake studio…</span>}
      {status === "ready" && <span className="baker-3d__hint">A little cake magic, in motion</span>}
      {status === "error" && <span className="baker-3d__status">The 3D scene could not load.</span>}
    </div>
  );
}
