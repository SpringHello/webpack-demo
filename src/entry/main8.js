import {mat4, vec3} from 'gl-matrix'

let gl = document.getElementById('glcanvas').getContext('webgl')

let program = initProgram(gl)

//相机
let projection = mat4.create();
let fovy = 45 * Math.PI / 180
let aspect = 1.0
let near = 1.0
let far = 100.0
mat4.perspective(projection, fovy, aspect, near, far)
let projectionMatrixLocation = gl.getUniformLocation(program, 'projection')
gl.uniformMatrix4fv(projectionMatrixLocation, false, projection);

//modelView
let modelView = mat4.create()
mat4.translate(modelView, modelView, vec3.fromValues(2, 0, -10))
mat4.rotateX(modelView, modelView, 90 * Math.PI / 180)
let modelViewLocation = gl.getUniformLocation(program, 'modelView')
gl.uniformMatrix4fv(modelViewLocation, false, modelView)

let step = 20
let step1 = 30
//  两个顶点
let points = [0, 0, -1, 1, 0, 0, 1, 1]
//  生成数据
let radio = Math.PI / 180
for (let j = -90 + step; j <= 90 - step; j += 15) {
  let z = Math.sin(j * radio)
  let radius = Math.cos(j * radio)
  if (j == -90 + step || j == 90 - step) {
    step1 = 30
  } else {
    step1 = 15
  }
  for (let i = 0; i < 360; i += step1) {
    points.push(Math.sin(i * radio) * radius, Math.cos(i * radio) * radius, z, 1)
  }
}
console.log(points)
gl.enable(gl.DEPTH_TEST)
gl.clearColor(0.0, 0.0, 0.0, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

let pointsBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, pointsBuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW)
let positionLocation = gl.getAttribLocation(program, 'position')
gl.enableVertexAttribArray(positionLocation)
gl.vertexAttribPointer(positionLocation, 4, gl.FLOAT, false, 0, 0);
gl.drawArrays(gl.POINTS, 0, points.length / 4)

function initProgram (gl) {
  const vs = `
    attribute vec4 position;
    uniform mat4 projection;
    uniform mat4 modelView;
    attribute vec4 color;
    varying lowp vec4 vColor;
    void main(){
      gl_Position = projection * modelView * position;
      gl_PointSize = 2.0;
    }
  `
  const fs = `
    varying lowp vec4 vColor;
    void main(){
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `
  let vertexShader = gl.createShader(gl.VERTEX_SHADER)
  gl.shaderSource(vertexShader, vs)
  gl.compileShader(vertexShader)

  let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
  gl.shaderSource(fragmentShader, fs)
  gl.compileShader(fragmentShader)
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(fragmentShader));
  }
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(vertexShader));
  }
  let program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  gl.useProgram(program)
  return program
}
