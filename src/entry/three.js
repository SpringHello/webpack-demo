//threejs的一个例子
import * as THREE from 'three'
import { CylinderGeometry } from 'three';
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({
    //增加下面两个属性，可以抗锯齿
    antialias: true

});
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//var geometry = new THREE.BoxGeometry(1, 1, 1);
var curve = new THREE.CubicBezierCurve(
    new THREE.Vector2(0, -8),
    new THREE.Vector2(0, 0),
    new THREE.Vector2(5, 8)
);

var points = curve.getPoints(500);
console.log(points)
var geometry = new THREE.BufferGeometry().setFromPoints(points);
var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
var curveObject = new THREE.Mesh(geometry, material);


//var geometry = new THREE.ConeBufferGeometry(1, 2, 32);
//var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
//var cone = new THREE.Mesh(geometry, material);
//geometry.lookAt(new THREE.Vector3(0, -1, 0))
scene.add(curveObject);


camera.position.z = 5;
camera.lookAt(0, 0, 0)


function animate() {

    //requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();