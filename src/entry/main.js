import {mat4, vec3} from 'gl-matrix'

const canvas = document.getElementById("webgl")
const width = window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth
canvas.setAttribute('width', width);
const height = window.innerHeight
  || document.documentElement.clientHeight
  || document.body.clientHeight
canvas.setAttribute('height', height);

const gl = canvas.getContext('webgl', {
  preserveDrawingBuffer: true
})

//  烟花上升program
function initProgram (gl) {
  const vertexSource = `
    attribute vec4 vPosition;
    attribute vec4 cPosition;
    attribute vec4 aVertexColor;
    varying lowp vec4 vColor;
    uniform int u_mode;
    void main(){
      if (u_mode>2) {
        gl_Position = cPosition;
        vColor = vec4(1,0,0,1);
      }else{
        gl_Position = vPosition;
        vColor = aVertexColor;
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
const cPosition = gl.getAttribLocation(program, 'cPosition')
const aVertexColor = gl.getAttribLocation(program, 'aVertexColor')
const u_mode = gl.getUniformLocation(program, 'u_mode')
//  初始化四个顶点，用于清空窗口
const fireworkPath = [
  -1, -1, 0,
  -1, 1, 0,
  1, -1, 0,
  1, 1, 0
]
const boomPath = []
const color = [
  0, 0, 0, 0.2,
  0, 0, 0, 0.2,
  0, 0, 0, 0.2,
  0, 0, 0, 0.2
]

//  存放所有烟花上升的路径,默认规划1000条路径
let pathNum = 10000
for (let i = 0; i < pathNum; i++) {
  let offsetX = (Math.random() * 2 - 1) / 10000,
    offsetY = (Math.random() + 0.7) / 100
  //每条路径规划100个点
  let count = 0
  for (let step = 1; step <= 100; step += 1) {
    count++
    color.push((120 - step) / 100, (120 - step) / 100, (120 - step) / 100, 1)
    fireworkPath.push(step * step * offsetX, step * offsetY - 1, -0.5)
  }
}
for (let i = 0; i < 360; i += 30) {
  let x = Math.cos((i / 180) * Math.PI)
  let y = Math.sin((i / 180) * Math.PI)
  //  爆炸路径上一共一百个点
  for (let j = 2; j < 52; j++) {
    boomPath.push(x * j / 50, y * j / 50, 0)
  }
}

//颜色混合
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
gl.enable(gl.BLEND);

//  上升轨迹
let buffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(fireworkPath), gl.STATIC_DRAW)
gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(vPosition)

//  爆炸轨迹
let vbuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boomPath), gl.STATIC_DRAW)
gl.vertexAttribPointer(cPosition, 3, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(cPosition)

//  上升颜色
let cbuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, cbuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW)
gl.vertexAttribPointer(aVertexColor, 4, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(aVertexColor)


!(function (fireworkNum) {
  //  烟花上升的数组
  let fireworkArray = []
  //  烟花爆炸数组
  let fireworkBoomArray = []
  for (let i = 0; i < fireworkNum; i++) {
    fireworkArray.push(
      {
        step: Math.floor(Math.random() * -100),
        fireworkNo: Math.floor(Math.random() * pathNum)
      }
    )
  }
  const boomRadus = 100;
  // 0,0 对应的点位
  let x = width / 2 - boomRadus;
  let y = height / 2 - boomRadus

  function render () {
    //gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0)
    gl.uniform1i(u_mode, 0)
    gl.viewport(0, 0, width, height)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    for (let i = 0; i < fireworkArray.length; i++) {
      let currentFirework = fireworkArray[i]
      if (currentFirework.step > -1) {
        gl.drawArrays(gl.LINES, currentFirework.fireworkNo * 100
          + currentFirework.step + 4, 2
        )
        if (currentFirework.step > 95) {
          let x = fireworkPath[(currentFirework.fireworkNo * 100 + currentFirework.step + 4) * 3]
          let y = fireworkPath[(currentFirework.fireworkNo * 100 + currentFirework.step + 4) * 3 + 1]
          fireworkBoomArray.push({
            location: {x, y},
            step: 0
          })
          currentFirework.step = 0
          currentFirework.fireworkNo = Math.floor(Math.random() * pathNum)
        }
      }
      currentFirework.step++
    }
    gl.uniform1i(u_mode, 3)
    //alert(gl.getUniform(program, u_mode))
    for (let j = 0; j < fireworkBoomArray.length; j++) {
      let currentFireworkBoom = fireworkBoomArray[j]

      gl.viewport(currentFireworkBoom.location.x * width / 2 + x, currentFireworkBoom.location.y * height / 2 + y, boomRadus * 2, boomRadus * 2)
      for (let i = 0; i < 12; i++) {
        gl.drawArrays(gl.LINES, i * 50 + currentFireworkBoom.step, 2)
      }
      currentFireworkBoom.step++
    }
    fireworkBoomArray = fireworkBoomArray.filter(firework => {
      return firework.step < 49
    })
    requestAnimationFrame(render)
  }

  render()
})(5)





