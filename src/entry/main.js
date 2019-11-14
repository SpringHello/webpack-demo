import {mat4, vec3} from 'gl-matrix'

let gl = document.getElementById('glcanvas').getContext('webgl')

let program = initProgram(gl)
gl.useProgram(program)

gl.clearColor(0.0, 0.0, 0.0, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT)

let vertex = [
  0.0, 0.0, -1, 1
]
let color = [1.0, 1.0, 1.0, 1.0]
for (let i = 0; i <= 360; i += 45) {
  let y = Math.sin(i * 2 * Math.PI / 360)
  let x = Math.cos(i * 2 * Math.PI / 360)
  vertex.push(x, y, 0.0, 1)
  color.push(x, y, 0.0, 1.0)
} 
let buffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW)
let positionLocation = gl.getAttribLocation(program, 'position')
gl.enableVertexAttribArray(positionLocation)
gl.vertexAttribPointer(positionLocation, 4, gl.FLOAT, false, 0, 0);

//  颜色
let colorBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW)
let colorLocation = gl.getAttribLocation(program, 'color')
gl.enableVertexAttribArray(colorLocation)
gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);

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
mat4.translate(modelView, modelView, vec3.fromValues(3, 3, -10))
//mat4.rotateY(modelView, modelView, 90 * Math.PI / 180)
let modelViewLocation = gl.getUniformLocation(program, 'modelView')
gl.uniformMatrix4fv(modelViewLocation, false, modelView)

gl.drawArrays(gl.TRIANGLE_FAN, 0, vertex.length)


//modelView
/*let modelView1 = mat4.create()
mat4.translate(modelView1, modelView1, vec3.fromValues(0, 0, -6))
mat4.rotateY(modelView1, modelView1, 180 * Math.PI / 180)
let modelViewLocation1 = gl.getUniformLocation(program, 'modelView')
gl.uniformMatrix4fv(modelViewLocation1, false, modelView1)

gl.drawArrays(gl.TRIANGLE_FAN, 0, position.length)*/

function initProgram (gl) {
  const vs = `
    attribute vec4 position;
    uniform mat4 projection;
    uniform mat4 modelView;
    attribute vec4 color;
    varying lowp vec4 vColor;
    void main(){
      gl_Position = projection * modelView * position;
      vColor = color;
    }
  `
  const fs = `
    varying lowp vec4 vColor;
    void main(){
      gl_FragColor = vColor;
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

  return program
}
