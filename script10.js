import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as lilGUI from "https://esm.sh/lil-gui";

// Canvas and Scene
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

// Environment Map
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMapTexture = cubeTextureLoader.load([
  'px.png',
  'nx.png',
  'py.png',
  'ny.png',
  'pz.png',
  'nz.png',
]);

// Material
const mat = new THREE.MeshStandardMaterial({
  metalness: 0.7,
  roughness: 0.2,
  envMap: envMapTexture,
});
mat.needsUpdate = true;

// GUI
const gui = new lilGUI.GUI();
gui.add(mat, 'metalness').min(0).max(1).step(0.0001);
gui.add(mat, 'roughness').min(0).max(1).step(0.0001);

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), mat);
sphere.position.x = -1.5;
sphere.castShadow = true;

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  new THREE.MeshStandardMaterial({ color: 0x888888 })
);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
plane.receiveShadow = true;

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 16, 32), mat);
torus.position.x = 1.5;
torus.castShadow = true;

scene.add(sphere, plane, torus);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
directionalLight.position.set(2, 2, -1);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;

scene.add(directionalLight);

const spotLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3);
spotLight.position.set(0, 2, 2);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;
scene.add(spotLight);

const pointLight = new THREE.PointLight(0xffffff, 0.3);
pointLight.position.set(-1, 1, 0);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;
scene.add(pointLight);

// Helpers
const directionalLightHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
directionalLightHelper.visible = false;
scene.add(directionalLightHelper);

const spotLightHelper = new THREE.CameraHelper(spotLight.shadow.camera);
spotLightHelper.visible = false;
scene.add(spotLightHelper);

const pointLightHelper = new THREE.CameraHelper(pointLight.shadow.camera);
pointLightHelper.visible = false;
scene.add(pointLightHelper);

// Renderer
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Camera
const cam = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
cam.position.set(0, 1, 5);
scene.add(cam);

// Controls
const controls = new OrbitControls(cam, canvas);
controls.enableDamping = true;

// Resize Event
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  cam.aspect = sizes.width / sizes.height;
  cam.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
});

// Fullscreen Event
window.addEventListener('dblclick', () => {
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) canvas.requestFullscreen();
    else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  }
});

// Animations
const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Rotate Objects
  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update Controls
  controls.update();

  // Render
  renderer.render(scene, cam);

  // Loop
  window.requestAnimationFrame(tick);
};

tick();
