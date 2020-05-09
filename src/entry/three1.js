import * as THREE from 'three'

window.onload = function () {
    console.log(window.innerWidth / window.innerHeight)
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
    camera.translateZ(20)
    const sense = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    //创建一条平滑的曲线，取曲线上50个点
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-10, 0, 10),
        new THREE.Vector3(-5, 5, 5),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(5, -5, 5),
        new THREE.Vector3(10, 0, 10)
    ]);

    let points = curve.getPoints(5000);
    let geometry = new THREE.BufferGeometry().setFromPoints(points);
    let material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    // Create the final object to add to the scene
    let curveObject = new THREE.Line(geometry, material);
    sense.add(curveObject)
    renderer.render(sense, camera)
}