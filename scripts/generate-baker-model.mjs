import * as THREE from "three";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import { mkdir, writeFile } from "node:fs/promises";

// GLTFExporter uses the browser FileReader API for its final binary step. Node
// provides Blob but not FileReader, so this tiny compatible shim keeps the
// asset generator dependency-free.
globalThis.FileReader = class FileReader {
  result = null;
  onloadend = null;

  readAsArrayBuffer(blob) {
    Promise.resolve().then(async () => {
      this.result = await blob.arrayBuffer();
      this.onloadend?.();
    });
  }
};

const scene = new THREE.Scene();
scene.name = "Cake_Decorating_Baker";

const colors = {
  skin: "#efb79e",
  skinShade: "#c98070",
  hair: "#3c211b",
  hairLight: "#6b3729",
  jacket: "#f6bdc9",
  jacketShade: "#e58ca7",
  apron: "#4b302d",
  apronDark: "#311e1d",
  cake: "#ec9bad",
  cakeDark: "#bc506e",
  cream: "#fff8ee",
  piping: "#f5d9cf",
  table: "#e7bc88",
  tableEdge: "#a86545",
  gold: "#f3bd58",
  eye: "#351923",
};

const material = (color, options = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.62, metalness: 0, ...options });

const mat = Object.fromEntries(Object.entries(colors).map(([name, color]) => [name, material(color)]));
const creamShiny = material(colors.cream, { roughness: 0.33 });
const metal = material("#c78370", { metalness: 0.28, roughness: 0.35 });

function mesh(geometry, materialValue, name, position, scale, rotation) {
  const part = new THREE.Mesh(geometry, materialValue);
  part.name = name;
  if (position) part.position.set(...position);
  if (scale) part.scale.set(...scale);
  if (rotation) part.rotation.set(...rotation);
  part.castShadow = true;
  part.receiveShadow = true;
  return part;
}

function sphere(name, position, scale, materialValue, parent = scene) {
  const part = mesh(new THREE.SphereGeometry(1, 32, 24), materialValue, name, position, scale);
  parent.add(part);
  return part;
}

function box(name, position, scale, materialValue, parent = scene, rotation) {
  const part = mesh(new THREE.BoxGeometry(1, 1, 1), materialValue, name, position, scale, rotation);
  parent.add(part);
  return part;
}

function cylinder(name, position, radiusTop, radiusBottom, height, materialValue, parent = scene, rotation) {
  const part = mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 32), materialValue, name, position, undefined, rotation);
  parent.add(part);
  return part;
}

function tube(name, points, radius, materialValue, parent = scene) {
  const curve = new THREE.CatmullRomCurve3(points.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
  const part = mesh(new THREE.TubeGeometry(curve, 40, radius, 10, false), materialValue, name);
  parent.add(part);
  return part;
}

// The tabletop and cake are included in the GLB so the character reads as a single complete scene.
const table = new THREE.Group();
table.name = "Cake_Table";
scene.add(table);
box("Tabletop", [0, 0.93, 0], [2.65, 0.16, 1.46], mat.table, table);
box("Table_Apron", [0, 0.82, 0], [2.72, 0.14, 1.53], mat.tableEdge, table);
[
  [-1.03, 0.38, -0.53],
  [1.03, 0.38, -0.53],
  [-1.03, 0.38, 0.53],
  [1.03, 0.38, 0.53],
].forEach((position, index) => cylinder(`Table_Leg_${index + 1}`, position, 0.09, 0.12, 0.8, mat.tableEdge, table));

const cake = new THREE.Group();
cake.name = "Celebration_Cake";
cake.position.set(-0.38, 1.055, 0.08);
table.add(cake);
cylinder("Cake_Board", [0, 0.035, 0], 0.61, 0.61, 0.07, metal, cake);
cylinder("Cake_Base", [0, 0.26, 0], 0.55, 0.57, 0.39, mat.cake, cake);
cylinder("Cake_Cream_Layer", [0, 0.38, 0], 0.574, 0.574, 0.06, creamShiny, cake);
cylinder("Cake_Top", [0, 0.52, 0], 0.53, 0.55, 0.24, mat.cake, cake);
cylinder("Cake_Icing_Top", [0, 0.65, 0], 0.49, 0.54, 0.06, creamShiny, cake);
for (let i = 0; i < 12; i += 1) {
  const angle = (i / 12) * Math.PI * 2;
  sphere(
    `Icing_Rosette_${i + 1}`,
    [Math.cos(angle) * 0.43, 0.7 + (i % 2) * 0.015, Math.sin(angle) * 0.43],
    [0.078, 0.052, 0.078],
    creamShiny,
    cake,
  );
}
tube(
  "Icing_Swirl",
  [
    [-0.3, 0.73, -0.18],
    [-0.08, 0.75, -0.34],
    [0.2, 0.75, -0.27],
    [0.33, 0.76, -0.02],
    [0.18, 0.77, 0.22],
    [-0.1, 0.78, 0.25],
    [-0.2, 0.79, 0.05],
  ],
  0.034,
  creamShiny,
  cake,
);

const baker = new THREE.Group();
baker.name = "Baker_Root";
baker.position.set(0.53, 0, 0.18);
scene.add(baker);

// Shoes and apron create a full-body silhouette rather than a bust or flat icon.
sphere("Shoe_Left", [0.32, 0.12, 0.17], [0.28, 0.12, 0.42], mat.apronDark, baker);
sphere("Shoe_Right", [0.78, 0.12, 0.17], [0.28, 0.12, 0.42], mat.apronDark, baker);
cylinder("Leg_Left", [0.39, 0.47, 0], 0.18, 0.21, 0.62, mat.apronDark, baker, [0, 0, -0.08]);
cylinder("Leg_Right", [0.71, 0.47, 0], 0.18, 0.21, 0.62, mat.apronDark, baker, [0, 0, 0.08]);

const torso = new THREE.Group();
torso.name = "Baker_Torso";
torso.position.set(0.55, 1.3, 0);
torso.rotation.z = -0.11;
baker.add(torso);
sphere("Pink_Blouse", [0, 0.3, 0], [0.43, 0.61, 0.28], mat.jacket, torso);
box("Chocolate_Apron_Bib", [-0.015, 0.3, 0.275], [0.52, 0.6, 0.075], mat.apron, torso, [0, 0, 0.02]);
box("Apron_Waist", [-0.015, -0.18, 0.29], [0.6, 0.1, 0.09], mat.apronDark, torso);
for (const [index, y] of [0.52, 0.31, 0.1].entries()) {
  sphere(`Jacket_Button_${index + 1}`, [0.09, y, 0.36], [0.035, 0.035, 0.027], mat.apronDark, torso);
}

const neck = cylinder("Baker_Neck", [0.55, 1.91, 0.02], 0.14, 0.15, 0.25, mat.skin, baker);
const head = new THREE.Group();
head.name = "Baker_Head";
head.position.set(0.48, 2.24, 0.03);
head.rotation.z = 0.12;
baker.add(head);
sphere("Face", [0, 0, 0.02], [0.36, 0.43, 0.34], mat.skin, head);
// Long, loose dark hair and a soft pink blouse echo the requested cake artist.
sphere("Hair_Back", [0.045, 0.08, -0.13], [0.41, 0.44, 0.25], mat.hair, head);
sphere("Hair_Crown", [-0.02, 0.26, 0.02], [0.39, 0.24, 0.31], mat.hair, head);
sphere("Hair_Side_Sweep", [-0.23, 0.1, 0.24], [0.14, 0.31, 0.12], mat.hairLight, head);
tube(
  "Hair_Long_Lock_Right",
  [[0.27, 0.2, -0.09], [0.43, 0.0, -0.11], [0.4, -0.35, -0.08], [0.32, -0.7, -0.03], [0.22, -1.0, 0.02]],
  0.115,
  mat.hair,
  head,
);
tube(
  "Hair_Long_Lock_Left",
  [[-0.27, 0.2, -0.08], [-0.4, -0.04, -0.1], [-0.34, -0.37, -0.08], [-0.24, -0.7, -0.04], [-0.3, -0.96, 0.02]],
  0.11,
  mat.hairLight,
  head,
);
tube(
  "Hair_Front_Lock",
  [[-0.26, 0.22, 0.25], [-0.34, 0.07, 0.29], [-0.31, -0.11, 0.27]],
  0.07,
  mat.hair,
  head,
);
sphere("Eye_White_Left", [-0.13, 0.02, 0.335], [0.079, 0.088, 0.026], creamShiny, head);
sphere("Eye_White_Right", [0.13, 0.02, 0.335], [0.079, 0.088, 0.026], creamShiny, head);
sphere("Eye_Left", [-0.13, 0.02, 0.365], [0.037, 0.052, 0.019], mat.eye, head);
sphere("Eye_Right", [0.13, 0.02, 0.365], [0.037, 0.052, 0.019], mat.eye, head);
sphere("Nose", [0.0, -0.075, 0.365], [0.05, 0.075, 0.045], mat.skinShade, head);
tube("Baker_Brow_Left", [[-0.2, 0.15, 0.36], [-0.13, 0.18, 0.385], [-0.07, 0.15, 0.36]], 0.013, mat.hair, head);
tube("Baker_Brow_Right", [[0.07, 0.15, 0.36], [0.13, 0.18, 0.385], [0.2, 0.15, 0.36]], 0.013, mat.hair, head);
sphere("Baker_Cheek_Left", [-0.23, -0.14, 0.315], [0.075, 0.045, 0.018], mat.jacketShade, head);
sphere("Baker_Cheek_Right", [0.23, -0.14, 0.315], [0.075, 0.045, 0.018], mat.jacketShade, head);
tube("Baker_Smile", [[-0.085, -0.19, 0.35], [0, -0.225, 0.38], [0.085, -0.19, 0.35]], 0.014, mat.apronDark, head);

function addArm(name, shoulder, side, startRotation) {
  const arm = new THREE.Group();
  arm.name = name;
  arm.position.set(...shoulder);
  arm.rotation.set(...startRotation);
  baker.add(arm);

  cylinder(`${name}_Upper`, [0, -0.28, 0], 0.12, 0.145, 0.56, mat.jacket, arm);
  sphere(`${name}_Elbow`, [0, -0.58, 0], [0.14, 0.14, 0.14], mat.jacket, arm);
  const forearm = new THREE.Group();
  forearm.name = `${name}_Forearm`;
  forearm.position.set(0, -0.56, 0);
  forearm.rotation.z = side * -0.58;
  arm.add(forearm);
  cylinder(`${name}_Forearm_Mesh`, [0, -0.23, 0], 0.105, 0.125, 0.46, mat.jacket, forearm);
  sphere(`${name}_Hand`, [0, -0.51, 0.015], [0.125, 0.13, 0.115], mat.skin, forearm);
  return arm;
}

const armLeft = addArm("Baker_Arm_Left", [0.25, 1.72, 0.19], -1, [0.15, 0.38, 0.7]);
const armRight = addArm("Baker_Arm_Right", [0.8, 1.71, 0.2], 1, [0.15, -0.35, -0.74]);

const bag = new THREE.Group();
bag.name = "Piping_Bag";
bag.position.set(0.46, 1.35, 0.51);
bag.rotation.set(-0.65, 0, 0.45);
baker.add(bag);
const pipingBag = mesh(new THREE.ConeGeometry(0.17, 0.54, 32), mat.piping, "Piping_Bag_Mesh", [0, 0, 0]);
pipingBag.rotation.x = Math.PI;
bag.add(pipingBag);
cylinder("Piping_Nozzle", [0, -0.32, 0], 0.035, 0.055, 0.17, metal, bag);
// Bring the hands visually around the bag, which makes the decorating pose clear from the front camera.
sphere("Hand_On_Bag_1", [0.34, 1.58, 0.5], [0.13, 0.12, 0.11], mat.skin, baker);
sphere("Hand_On_Bag_2", [0.58, 1.43, 0.5], [0.13, 0.12, 0.11], mat.skin, baker);

// A simple tray edge and scattered sugar pearls add depth, shadows, and a polished hero-scene finish.
for (let i = 0; i < 8; i += 1) {
  const angle = (i / 8) * Math.PI * 2 + 0.2;
  sphere(
    `Sugar_Pearl_${i + 1}`,
    [-0.38 + Math.cos(angle) * 0.73, 1.065, 0.08 + Math.sin(angle) * 0.74],
    [0.026, 0.026, 0.026],
    i % 2 ? mat.gold : mat.cream,
    table,
  );
}

const exporter = new GLTFExporter();
const glb = await new Promise((resolve, reject) => {
  exporter.parse(scene, resolve, reject, { binary: true, trs: true, onlyVisible: true });
});

await mkdir(new URL("../public/models/", import.meta.url), { recursive: true });
await writeFile(new URL("../public/models/baker-decorating-cake.glb", import.meta.url), Buffer.from(glb));
