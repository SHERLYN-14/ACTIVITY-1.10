import * as three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as lilGUI from "https://esm.sh/lil-gui"
const canvas = document.querySelector('canvas.webgl');

const scene = new three.Scene();


const cubeTextureLoader = new three.CubeTextureLoader();
const envMapTexture = cubeTextureLoader.load
([
  'pic/px.png',
  'pic/nx.png',
  'pic/py.png',
  'pic/ny.png',
  'pic/pz.png',
  'pic/nz.png'
])

const mat = new three.MeshStandardMaterial
({
  metalness: 0.7,
  roughness: 0.2,
  envMap: envMapTexture
});

mat.needsUpdate = true;

const gui = new lilGUI.GUI()
gui
  .add(mat, 'metalness')
  .min(0)
  .max(1).
  step(0.0001)
gui
  .add(mat, 'roughness')
  .min(0)
  .max(1)
  .step(0.0001)



const sphere = new three.Mesh
(
  new three.SphereGeometry(0.5, 16, 16),
  mat
)
sphere.position.x = -1.5;

const plane = new three.Mesh
(
  new three.PlaneGeometry(1,1),
  mat
)

const torus = new three.Mesh
(
  new three.TorusGeometry(0.3, 0.2, 16, 32),
  mat
)
torus.position.x = 1.5

scene.add(sphere,plane,torus);

const sizes =
{
  width: window.innerWidth,
  height: window.innerHeight
}

const cam = new three.PerspectiveCamera(75, sizes.width / sizes.height);
cam.position.z = 5;
scene.add(cam);

const control = new OrbitControls(cam, canvas);
control.enableDamping = true;

window.addEventListener('resize', () =>
{
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  cam.aspect = sizes.width / sizes.height;
  renderer.setSize(sizes.width, sizes.height);
  
  cam.updateProjectionMatrix();
}) 

window.addEventListener('dblclick', () =>
{
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

  if(!fullscreenElement)
  {
    if(canvas.requestFullscreen)
    {
      canvas.requestFullscreen();
    }
    else if(canvas.webkitFullscreenElement)
    {
      canvas.webkitFullscreenElement();
    }
  }
  else
  {
    if(document.exitFullscreen)
    {
      document.exitFullscreen();
    }
    else if(document.webkitFullscreenElement)
    {
      document.webkitFullscreenElement();
    }
  }
})

const renderer = new three.WebGLRenderer
({
  canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene,cam);


const clock = new three.Clock();
const tick = () =>
{
  const elapsedTime = clock.getElapsedTime();
  sphere.rotation.y = 1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  control.update();
  renderer.render(scene, cam);
  window.requestAnimationFrame(tick);
}

tick();