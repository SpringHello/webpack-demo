import {mat4} from 'gl-matrix'

let gl = document.getElementById('glcanvas').getContext('webgl')

let program = initProgram(gl)
gl.useProgram(program)

let positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
let position = []
for (let i = 0; i <= 360; i += 15) {
  let y = Math.sin(i * Math.PI / 180)
  let x = Math.cos(i * Math.PI / 180)
  position.push(x, y, 0)
}
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW)

let positionLocation = gl.getAttribLocation(program, 'position')
gl.enableVertexAttribArray(positionLocation)
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 12, 0);
gl.clearColor(0.0, 0.0, 0.0, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT)
gl.drawArrays(gl.TRIANGLE_FAN, 0, position.length)

function initProgram (gl) {
  const vs = `
    attribute vec4 position;
    void main(){
      gl_Position = position;
    }
  `
  const fs = `
    void main(){
      gl_FragColor = vec4(1.0,1.0,1.0,1.0);
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
