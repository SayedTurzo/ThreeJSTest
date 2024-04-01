import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from 'dat.gui';
import {DirectionalLightHelper, TextureLoader} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

import nebula from '../textures/nebula.jpg';
import stars from '../textures/stars.jpg';
import * as url from "url";


const monkeyUrl = new URL('../assets/monkey.glb', import.meta.url);

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
//renderer.setClearColor(0xFFEA00);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);



// Create a scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

const textureLoader = new THREE.TextureLoader();
//scene.background = textureLoader.load(stars);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load(
    [
        nebula,
        nebula,
        nebula,
        nebula,
        nebula,
        nebula
    ]
)


const orbit = new OrbitControls(camera,renderer.domElement);

camera.position.set(-10,30,30);
orbit.update();

const axesHelper =  new THREE.AxesHelper(3);
scene.add(axesHelper);

const planeGeo = new THREE.PlaneGeometry(30,30);
const planeMat = new THREE.MeshLambertMaterial({color: 0x008000, side : THREE.DoubleSide});
const plane = new THREE.Mesh(planeGeo,planeMat);
scene.add(plane);
plane.rotation.x= -.5* Math.PI;
plane.receiveShadow = true;

const plane2Geo = new THREE.PlaneGeometry(10,10);
const plane2Mat = new THREE.MeshLambertMaterial({color: 0xFFFF00, side : THREE.DoubleSide , wireframe : false});
const plane2 = new THREE.Mesh(plane2Geo,plane2Mat);
scene.add(plane2);
plane2.rotation.x= -.5* Math.PI;
plane2.position.set(-10,5,0);
plane2.castShadow = true;

const gridHelper = new THREE.GridHelper(30,30,0x000000,0x000000);
scene.add(gridHelper);

const boxGeo = new THREE.BoxGeometry();
const boxMat = new THREE.MeshLambertMaterial({color: 0x00ff00});
const box = new THREE.Mesh(boxGeo,boxMat);
scene.add(box);
box.position.set(-2,2,-1);
box.castShadow = true;
box.receiveShadow = true;

const newBoxGeo = new THREE.BoxGeometry(2,2,2);
const newboxMat = new THREE.MeshLambertMaterial({});
const newboxMultiMaterial = [
    new THREE.MeshLambertMaterial(
        {
            map : textureLoader.load(stars),
        }
    ),
    new THREE.MeshLambertMaterial(
        {
            map : textureLoader.load(stars),
        }
    ),
    new THREE.MeshLambertMaterial(
        {
            map : textureLoader.load(nebula),
        }
    ),
    new THREE.MeshLambertMaterial(
        {
            map : textureLoader.load(stars),
        }
    ),
    new THREE.MeshLambertMaterial(
        {
            map : textureLoader.load(nebula),
        }
    ),
    new THREE.MeshLambertMaterial(
        {
            map : textureLoader.load(stars),
        }
    )
];
const newbox = new THREE.Mesh(newBoxGeo,newboxMultiMaterial);
scene.add(newbox);
newbox.position.set(-4,2,3);
newbox.castShadow = true;
newbox.receiveShadow = true;
//newbox.material.map = textureLoader.load(nebula);
//newbox.material.map = textureLoader.load(nebula);
newbox.name = 'newbox';


const sphereGeo = new THREE.SphereGeometry(1,50,50);
const sphereMat = new THREE.MeshLambertMaterial({color: 0x00ff00 , wireframe : false});
const sphere = new THREE.Mesh(sphereGeo,sphereMat);
scene.add(sphere);
sphere.position.set(2,2,2);
sphere.castShadow = true;
sphere.receiveShadow = true;
const sphereId = sphere.id;


const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// Create a directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
scene.add(directionalLight);
directionalLight.position.set(-30,30,0);
directionalLight.castShadow = true;
directionalLight.shadow.camera.bottom = -12;
directionalLight.shadow.camera.top = 15;
directionalLight.shadow.camera.left = -15;
directionalLight.shadow.camera.right = 15;

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight , 5);
scene.add(directionalLightHelper);

const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(dLightShadowHelper);

console.log("Monkey URL:", monkeyUrl.href);

const assetLoader = new GLTFLoader();
assetLoader.load(
    monkeyUrl.href,
    function (gltf) {
        const model = gltf.scene;
        scene.add(model);
        model.position.set(12, 3, 0);
        console.log("Monkey model loaded successfully:", model);
    },
    undefined,
    function (error) {
        console.error("Error loading monkey model:", error);
    }
);


const gui =  new dat.GUI();

const options = {
    boxColor : '#ffea00',
    sphereColor : '#ffea00',
    wireframe : false,
    speed : 0.01
    //skyColor : '#FFEA00'
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

// gui.addColor(options, 'skyColor').onChange(function (e)
// {
//     renderer.setClearColor(e);
// })

let step =0;


const mousePosition = new THREE.Vector2();
window.addEventListener('mousemove',function (e)
{
   mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1 ;
   mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1 ;
});

const rayCaster = new THREE.Raycaster();


function animate(time)
{
    step+=options.speed;
    box.rotation.x = time / 1000;
    sphere.position.y = 10 * Math.abs(Math.sin(step));
    
    rayCaster.setFromCamera(mousePosition,camera);
    const intersects = rayCaster.intersectObjects(scene.children);
    //console.log(intersects);
    for (let i =0;i<intersects.length ; i++)
    {
        if(intersects[i].object.id === sphereId)
        {
            intersects[i].object.material.color.set(0xFF0000);
        }
        if(intersects[i].object.name === 'newbox')
        {
            intersects[i].object.rotation.x = time / 1000;
            intersects[i].object.rotation.y = time / 1000;
        }
    }
    
    renderer.render(scene,camera);
}


renderer.setAnimationLoop(animate);
