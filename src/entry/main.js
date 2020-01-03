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
    attribute vec4 cVertexColor;
    varying lowp vec4 vColor;
    uniform int u_mode;
    void clear(){
	    gl_Position = cPosition;
      vColor = cVertexColor;
    }
    void draw(){
	    gl_Position = vPosition;
      vColor = aVertexColor;
    }
    void main(){
      if ( u_mode == 1 ) 
        draw();
      else 
        clear();
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
const cVertexColor = gl.getAttribLocation(program, 'cVertexColor')
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
const boomColor = []

//  存放所有烟花上升的路径,默认规划1000条路径
let pathNum = 300
for (let i = 0; i < pathNum; i++) {
  let offsetX = (Math.random() * 2 - 1) / 10000,
    offsetY = (Math.random() + 0.7) / 100
  //每条路径规划100个点
  let count = 0
  for (let step = 1; step <= 100; step += 1) {
    count++
    color.push((120 - step) / 100, (120 - step) / 100, 0, 1)
    fireworkPath.push(step * step * offsetX, step * offsetY - 1, 0)
  }
}

let boomPointNum = 500
let count = 0
while (count < boomPointNum) {
  let u = Math.random() * 2 - 1
  let v = Math.random() * 2 - 1
  let r2 = u * u + v * v
  if (r2 < 1) {
    count++
    let x = 2 * u * Math.sqrt(1 - r2), y = 2 * v * Math.sqrt(1 - r2), z = 1 - 2 * r2
    boomPath.push([x, y, z])
    /*for (let i = 1; i <= 50; i++) {
      let precent = i / 50
      boomPath.push(x * precent, y * precent, z * precent)
    }*/
  }
}
let array = []
let colorList = [
  [1, 0, 0, 1],
  [0, 1, 0, 1],
  [0, 0, 1, 1]
]
for (let i = 1; i <= 50; i++) {
  let beforePrecent = Math.sqrt(i / 50)
  let afterPrecent = Math.sqrt((i + 1) / 50)
  for (let j = 0; j < boomPath.length; j++) {
    let x = boomPath[j][0], y = boomPath[j][1], z = boomPath[j][2]
    array.push(beforePrecent * x, beforePrecent * y, beforePrecent * z)
    array.push(afterPrecent * x, afterPrecent * y, afterPrecent * z)
    boomColor.push(...colorList[j % colorList.length])
    boomColor.push(...colorList[j % colorList.length])
  }
}
/*let pre = 1
for (let i = 0; i < 360; i += pre) {
  let x = Math.cos((i / 180) * Math.PI)
  let y = Math.sin((i / 180) * Math.PI)
  //  爆炸路径上一共一百个点
  for (let j = 2; j < 52; j++) {
    boomPath.push(x * j / 50, y * j / 50, 0)
    boomColor.push(1, 0, 0, 1)
  }
}*/
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
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.STATIC_DRAW)
gl.vertexAttribPointer(cPosition, 3, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(cPosition)

//  上升颜色
let cbuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, cbuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW)
gl.vertexAttribPointer(aVertexColor, 4, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(aVertexColor)

//  爆炸颜色
let abuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, abuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boomColor), gl.STATIC_DRAW)
gl.vertexAttribPointer(cVertexColor, 4, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(cVertexColor)

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
  const boomRadus = 200;
  // 0,0 对应的点位
  let x = width / 2 - boomRadus;
  let y = height / 2 - boomRadus

  let status = 0

  function render () {
    //gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0)
    gl.uniform1i(u_mode, 1)
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
    gl.uniform1i(u_mode, 0)
    //alert(gl.getUniform(program, u_mode))
    for (let j = 0; j < fireworkBoomArray.length; j++) {
      let currentFireworkBoom = fireworkBoomArray[j]
      gl.viewport(currentFireworkBoom.location.x * width / 2 + x, currentFireworkBoom.location.y * height / 2 + y, boomRadus * 2, boomRadus * 2)
      gl.drawArrays(gl.LINES, boomPointNum * currentFireworkBoom.step, boomPointNum * 2)
      currentFireworkBoom.step++
    }
    fireworkBoomArray = fireworkBoomArray.filter(firework => {
      return firework.step < 40
    })
    requestAnimationFrame(render)
  }

  render()
})(5)




