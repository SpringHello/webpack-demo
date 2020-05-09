import THREE from 'three.js'
import { TweenMax, Power1, Stats } from "gsap";
var t1 = new Date().getTime();
var container, stats;
var camera, scene, renderer, group, particle;
var mouseX = 0, mouseY = 0;
var clock = new THREE.Clock();
var delta, speed;
var lastdot = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var points = [];
for (var b = 0; b <= 720; b++) {
    var pointx = x(b, j9(b));
    var pointy = y(b, j9(b));
    var pointz = Math.pow(4 * (pointx * pointx + pointy * pointy), 0.33);
    //debugger;
    console.log(pointx, pointy, -pointz)
    points.push(new THREE.Vector3(pointx, pointy, -pointz));
}

var spline = new THREE.CatmullRomCurve3(points);
var geometry = new THREE.Geometry();
for (var i = 0; i < points.length; i++) {
    var index = i / (points.length);
    var position = spline.getPoint(index);
    geometry.vertices[i] = new THREE.Vector3(position.x, position.y, position.z);
}
geometry.computeLineDistances();

var vl = geometry.vertices.length;


init();
animate();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.z = 1000;
    camera.position.y = 0;

    scene = new THREE.Scene();

    var PI2 = Math.PI * 2;
    //画点
    var program = function (context) {

        context.beginPath();
        context.arc(0, 0, 0.5, 0, PI2, true);
        context.fill();

    };


    group = new THREE.Group();
    scene.add(group);

    for (var i = 0; i < vl; i++) {
        //为每个点附上材质
        var material = new THREE.SpriteMaterial({
            color: Math.random() * 0x808008 + 0x808080,
            program: program
        });

        particle = new THREE.Sprite(material);
        particle.position.x = 0;
        particle.position.y = -500;
        particle.position.z = 0;
        particle.scale.x = particle.scale.y = Math.random() * 6 + 3;
        var timerandom = 0.5 * Math.random() + 0.5;
        //为每个点加动画
        // TweenMax.to(
        //                    particle.position,
        //                    timerandom,
        //                    {x:geometry.vertices[i].x+(0.5-Math.random())*100,y:geometry.vertices[i].y+(0.5-Math.random())*100,z:geometry.vertices[i].z+Math.random()*100,delay:1.8,} 
        //                );
        TweenMax.to(
            particle.position,
            timerandom,
            { x: geometry.vertices[i].x, y: geometry.vertices[i].y, z: geometry.vertices[i].z, delay: 1.8 }
        );
        TweenMax.to(
            particle.position,
            timerandom,
            { y: '-=1500', z: '300', delay: 1.8 + timerandom, ease: Power1.easeIn }
        );
        group.add(particle);
    }




    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    //stats = new Stats();
    //container.appendChild(stats.dom);

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);


    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

//

function onDocumentMouseMove(event) {

    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart(event) {

    if (event.touches.length === 1) {

        event.preventDefault();

        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;

    }

}

function onDocumentTouchMove(event) {

    if (event.touches.length === 1) {

        event.preventDefault();

        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;

    }

}

//

function animate() {

    requestAnimationFrame(animate);

    render();
    //stats.update();

}

function fsin(x) {     //正弦函数
    return 50 * Math.sin(0.8 * x * Math.PI / 180);
}

function j9(o) {
    return 600 * Math.cos(6 * o * Math.PI / 180);
}
//极坐标转x/y坐标 
function x(o, p) {
    return p * Math.cos(o * Math.PI / 180);
}
function y(o, p) {
    return p * Math.sin(o * Math.PI / 180);
}


function render() {


    delta = 10 * clock.getDelta();

    var speed = 80;

    delta = delta < 2 ? delta : 2;

    var dur = new Date().getTime() - t1;
    if (dur < 1800) {
        var k = 0;
        group.traverse(function (child) {
            if (child.position.y < 0) {
                child.position.y += delta * speed * Math.random();
                child.position.x = fsin(child.position.y);
            }

        });
    }


    renderer.render(scene, camera);

}
