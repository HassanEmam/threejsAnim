import './style.css'
import * as THREE from 'three';
import gsap from "gsap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

let model = null;
let raycaster = new THREE.Raycaster();
var request = new XMLHttpRequest();

request.open("GET", "models/data.json", false);
request.send(null)
let data = JSON.parse(request.responseText)
console.log(data.data);
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

const scene = new THREE.Scene();

const size = {
    width:800,
    height:600
}


let loader = new GLTFLoader();
loader.load('models/simple.glb', (glb) => {
  console.log(glb);
  scene.add(glb.scene)
  model = glb;
  glb.scene.children.forEach(function(pChild) {
    console.log(pChild.name);
    
  })
})


const camera = new THREE.PerspectiveCamera(45, size.width / size.height, 1, 1000)
camera.position.set(0, 0, 10);
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
const controls = new OrbitControls(camera, renderer.domElement)
controls.update();

const light = new THREE.AmbientLight(0xffffff,1);
scene.add(light);

renderer.setSize(size.width, size.height)
renderer.setClearColor(0x000000,1)
/*
* Handling Mouse 
*/
const mouse = new THREE.Vector2()

canvas.addEventListener("mousemove", (event)=>{
  mouse.x = event.clientX / size.width * 2 -1
  mouse.y = - (event.clientY / size.height * 2 -1)
  console.log(mouse)
})
let objects = scene.children
console.log(objects);
if (objects.length >1){
  for (obj of objects[1].children){
    obj.scale.y = 0.1;
  }
}
const tick = () =>{
    // cast ray
    raycaster.setFromCamera(mouse, camera)
    if (objects.length > 1)
    {
      
      const intersects = raycaster.intersectObjects(objects[1].children)
      for ( const obj of objects[1].children){
        obj.material.color.set('#ffffff') //color.set('#ffffff');
        gsap.to(obj.position, {duration:1, delay:1, y:1.0})
      }
      for (const intr of intersects){
        intr.object.material.color.set('#0000ff')
      }
      

    }
    
    controls.update();
    renderer.render(scene, camera)
    requestAnimationFrame(tick);
}

tick();