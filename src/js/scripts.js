import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from 'dat.gui';

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

const orbit = new OrbitControls(camera,renderer.domElement);

camera.position.set(-10,30,30);
orbit.update();

const axesHelper =  new THREE.AxesHelper(3);
scene.add(axesHelper);

const planeGeo = new THREE.PlaneGeometry(30,30);
const planeMat = new THREE.MeshBasicMaterial({color: 0x008000, side : THREE.DoubleSide});
const plane = new THREE.Mesh(planeGeo,planeMat);
scene.add(plane);
plane.rotation.x= -.5* Math.PI;

const gridHelper = new THREE.GridHelper(30,60);
scene.add(gridHelper);

const boxGeo = new THREE.BoxGeometry();
const boxMat = new THREE.MeshBasicMaterial({color: 0x00ff00});
const box = new THREE.Mesh(boxGeo,boxMat);
scene.add(box);
box.position.set(0,0,0);

const sphereGeo = new THREE.SphereGeometry(1,50,50);
const sphereMat = new THREE.MeshLambertMaterial({color: 0x00ff00 , wireframe : false});
const sphere = new THREE.Mesh(sphereGeo,sphereMat);
scene.add(sphere);
sphere.position.set(2,2,2);


// Create a directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(1, 1, 1).normalize(); // Set position
scene.add(directionalLight);


const gui =  new dat.GUI();

const options = {
    boxColor : '#ffea00',
    sphereColor : '#ffea00',
    wireframe : false,
    speed : 0.01
};

gui.addColor(options,'sphereColor').onChange(function (e)
{
    sphere.material.color.set(e);
});

gui.add(options,'wireframe').onChange(function (e)
{
    sphere.material.wireframe = e;
});

gui.addColor(options,'boxColor').onChange(function (e)
{
    box.material.color.set(e);
});
gui.add(options,'speed',0,.1);

let step =0;


function animate(time)
{
    step+=options.speed;
    box.rotation.x = time / 1000;
    sphere.position.y = 10 * Math.abs(Math.sin(step));
    renderer.render(scene,camera);
}


renderer.setAnimationLoop(animate);
