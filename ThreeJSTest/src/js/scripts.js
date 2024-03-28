import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const orbit = new OrbitControls(camera,renderer.domElement);

camera.position.set(1,1,5);
orbit.update();


const axesHelper =  new THREE.AxesHelper(3);
scene.add(axesHelper);


const boxGeo = new THREE.BoxGeometry();
const boxMat = new THREE.MeshBasicMaterial({color: 0x00ff00});
const box = new THREE.Mesh(boxGeo,boxMat);
scene.add(box);
box.position.set(0,0,0);


function animate()
{
    box.rotation.x +=.01;
    
    renderer.render(scene,camera);
}

renderer.setAnimationLoop(animate);




