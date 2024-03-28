﻿import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";


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




function animate()
{
    box.rotation.x +=.01;

    renderer.render(scene,camera);
}


renderer.setAnimationLoop(animate);
