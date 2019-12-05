import {mat4, vec3} from 'gl-matrix'

let gl = document.getElementById('glcanvas').getContext('webgl')

let program = initProgram(gl)
gl.useProgram(program)
let colorList = [[0, 1, 0, 1], [0, 1, 0, 1], [0, 1, 0, 1]]
let count = 0
let step = 10
let front = [
  0.0, 0.0, -1, 1
]
let back = [
  0.0, 0.0, 1, 1
]
let qiu = []
let qiuColor = []
//每一角度的弧度数
let radianPerAngle = Math.PI / 180
let color = [1.0, 1.0, 1.0, 1.0]
//for(let i=180)
let frontZ = Math.cos(step * radianPerAngle)
let backZ = -frontZ
let length = Math.abs(Math.sin(step * radianPerAngle))
for (let i = 0; i <= 360; i += step) {
  let y = Math.sin(i * radianPerAngle) * length
  let x = Math.cos(i * radianPerAngle) * length
  front.push(x, y, frontZ, 1)
  back.push(x, y, backZ, 1)
  color.push(...colorList[count++ % 3])
}

for (let i = 180 - step; i > step; i -= step) {
  let z = Math.cos(i * radianPerAngle)
  let preZ = Math.cos((i + step) * radianPerAngle)
  let length = Math.abs(Math.sin(i * radianPerAngle))
  let preLength = Math.abs(Math.sin((i + step) * radianPerAngle))
  for (let j = 0; j <= 360; j += step) {
    let x = Math.cos(j * radianPerAngle) * length
    let y = Math.sin(j * radianPerAngle) * length
    let preX = Math.cos(j * radianPerAngle) * preLength
    let preY = Math.sin(j * radianPerAngle) * preLength
    qiu.push(x, y, z, 1)
    qiuColor.push(...colorList[count++ % 3])
    qiu.push(preX, preY, preZ, 1)
    qiuColor.push(...colorList[count++ % 3])
  }
}
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
mat4.translate(modelView, modelView, vec3.fromValues(0, 0, -10))
mat4.rotateY(modelView, modelView, 40 * Math.PI / 180)
let modelViewLocation = gl.getUniformLocation(program, 'modelView')
gl.uniformMatrix4fv(modelViewLocation, false, modelView)

gl.enable(gl.DEPTH_TEST)
gl.clearColor(0.0, 0.0, 0.0, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//圆背面
let buffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(front), gl.STATIC_DRAW)
let positionLocation = gl.getAttribLocation(program, 'position')
gl.enableVertexAttribArray(positionLocation)
gl.vertexAttribPointer(positionLocation, 4, gl.FLOAT, false, 0, 0);
gl.drawArrays(gl.TRIANGLE_FAN, 0, front.length)

buffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(back), gl.STATIC_DRAW)
gl.enableVertexAttribArray(positionLocation)
gl.vertexAttribPointer(positionLocation, 4, gl.FLOAT, false, 0, 0);
gl.drawArrays(gl.TRIANGLE_FAN, 0, back.length)


colorBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(qiuColor), gl.STATIC_DRAW)
colorLocation = gl.getAttribLocation(program, 'color')
gl.enableVertexAttribArray(colorLocation)
gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);

buffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(qiu), gl.STATIC_DRAW)
gl.enableVertexAttribArray(positionLocation)
gl.vertexAttribPointer(positionLocation, 4, gl.FLOAT, false, 0, 0);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, qiu.length)

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
