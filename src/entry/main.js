import {mat4, vec3} from 'gl-matrix'

const canvas = document.getElementById("webgl")
canvas.setAttribute('width', window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth);
canvas.setAttribute('height', window.innerHeight
  || document.documentElement.clientHeight
  || document.body.clientHeight);

const gl = canvas.getContext('webgl')

function initProgram (gl) {
  const vertexSource = `
    attribute vec4 vPosition;
    attribute vec4 cPosition;
    attribute vec4 aVertexColor;
    varying lowp vec4 vColor;
    uniform int u_mode;
    void clear(){
      gl_Position = cPosition;
      vColor = vec4(0,0,0,0.1);
    }
    void main(){
      gl_Position = vPosition;
      if(u_mode==1){
        vColor = vec4(0,0,0,0.1);
      }else{
        vColor = vec4(1,0,0,1);
      }
    }
  `
  const fragmentSource = `
    varying lowp vec4 vColor;
    precision mediump float;
    void main(){
      gl_FragColor = vColor;
    }
  `
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexSource)
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentSource)

  const program = gl.createProgram()

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  return program

  function loadShader (gl, type, source) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader
  }
}

const program = initProgram(gl)

gl.useProgram(program)

const vPosition = gl.getAttribLocation(program, 'vPosition')
const u_mode = gl.getUniformLocation(program, 'u_mode')
//  初始化四个顶点，用于清空窗口
const linePoints = [
  -1, -1, 0,
  -1, 1, 0,
  1, -1, 0,
  1, 1, 0
]
let offsetX = (Math.random() * 2 - 1) / 10000,
  offsetY = (Math.random() + 0.7) / 100
//规划一条路径，一条100个点
for (let step = 1; step <= 100; step += 1) {
  linePoints.push(step * step * offsetX, step * offsetY - 1, 0)
}

//颜色混合
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);


let buffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(linePoints), gl.STATIC_DRAW)
gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(vPosition)

let count = 0

function render () {
  gl.uniform1i(u_mode, 1)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  gl.uniform1i(u_mode, 0)
  gl.drawArrays(gl.LINES, count + 4, 2)
  count++
  if (count == 99) {
    count = 0
  }
  requestAnimationFrame(render)
}

render()



