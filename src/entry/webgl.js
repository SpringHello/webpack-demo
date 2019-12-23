import {mat4, vec3} from 'gl-matrix'

const gl = document.getElementById('webgl').getContext('webgl')

function initProgram (gl) {
  const vertexSource = `
    attribute vec4 vPosition;
    attribute vec4 aVertexColor;
    uniform mat4 uModelViewMatrix;
    varying lowp vec4 vColor;
    void main(){
      gl_Position = vPosition;
      gl_PointSize = 1.0;
      vColor = uModelViewMatrix * aVertexColor;
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

let color = [
  0.1, 0.1, 0, 1,
  0.2, 0.2, 0, 1,
  0.3, 0.3, 0, 1,
  0.4, 0.4, 0, 1,
  0.5, 0.5, 0, 1,
  0.6, 0.5, 0, 1,
  0.7, 0.7, 0, 1,
  0.8, 0.8, 0, 1,
  0.9, 0.9, 0, 1,
  1, 1, 0, 1
]
//  颜色
let colorBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW)
const aVertexColor = gl.getAttribLocation(program, 'aVertexColor')
gl.enableVertexAttribArray(aVertexColor)
gl.vertexAttribPointer(aVertexColor, 4, gl.FLOAT, false, 0, 0);

// createBuffer函数创建一个缓冲区对象并返回到buffer标识符（GPU中创建buffer）
let buffer = gl.createBuffer()
//  ARRAY_BUFFER表示缓冲区的数据是顶点属性数据，通过上面的绑定，标识符为buffer的缓冲区为当前缓冲区。
//  后面所有将数据放入缓冲区的操作都将放入buffer缓冲区，直到重新绑定新的当前缓冲区
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

const vPosition = gl.getAttribLocation(program, 'vPosition')


gl.clearColor(0, 0, 0, 1.0)

//  开启着色器中的顶点属性
gl.enableVertexAttribArray(vPosition)
//  描述顶点数组中的数据形式。
//  每个顶点包含2个Float数据
//  不使用归一化到（0.0，1.0）
//  第五个参数说明数组中的值是连续的
//  最后一个参数说明缓冲区中数据的起始位置
gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0)


let ModelViewMatrixLocation = gl.getUniformLocation(program, 'uModelViewMatrix')

let fireworkNumber = 10
!(function (fireworkNumber) {
  let fireworkArray = []
  for (let i = 0; i < fireworkNumber; i++) {
    fireworkArray.push({
      offsetX: Math.random() * 2 - 1,
      offsetY: Math.random() * 1,
      step: 0,
      speed: Math.random() * 0.007 + 0.01
    })
  }


  function render () {
    gl.clear(gl.COLOR_BUFFER_BIT)
    for (let i = 0; i < fireworkArray.length; i++) {
      let linePoints = []

      //  曲线方程
      //  x = u,y = 2u,z=3u
      for (let step = fireworkArray[i].step; step < fireworkArray[i].step + 0.1; step += 0.01) {
        linePoints.push(step * step * fireworkArray[i].offsetX, step * fireworkArray[i].offsetY - 1, 0)
      }
      let s = mat4.create();
      mat4.scale(s, s, vec3.fromValues(Math.sqrt(1 - fireworkArray[i].step), Math.sqrt(1 - fireworkArray[i].step), 0));
      gl.uniformMatrix4fv(ModelViewMatrixLocation, false, s);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(linePoints), gl.DYNAMIC_DRAW)
      //
      gl.drawArrays(gl.LINE_STRIP, 0, linePoints.length / 3)
      fireworkArray[i].step += fireworkArray[i].speed
      if (fireworkArray[i].step > 1) {
        fireworkArray[i].offsetX = Math.random() * 2 - 1
        fireworkArray[i].step = 0
        fireworkArray[i].offsetY = Math.random() * 2
        fireworkArray[i].speed = Math.random() * 0.007 + 0.007
      }
    }
    requestAnimationFrame(render)
  }

  render()
})(fireworkNumber)



