const gl = document.getElementById('webgl').getContext('webgl')

function initProgram (gl) {
  const vertexSource = `
    attribute vec4 vPosition;
    void main(){
      gl_Position = vPosition;
      gl_PointSize = 1.0;
    }
  `
  const fragmentSource = `
    precision mediump float;
    void main(){
      gl_FragColor = vec4(1,0,0,1);
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

// createBuffer函数创建一个缓冲区对象并返回到buffer标识符（GPU中创建buffer）
let buffer = gl.createBuffer()
//  ARRAY_BUFFER表示缓冲区的数据是顶点属性数据，通过上面的绑定，标识符为buffer的缓冲区为当前缓冲区。
//  后面所有将数据放入缓冲区的操作都将放入buffer缓冲区，直到重新绑定新的当前缓冲区
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

const vPosition = gl.getAttribLocation(program, 'vPosition')
const initPoints = [
  [-1, -1],
  [0, 1],
  [1, -1]
]
const vertex = [0, 0]

function mix (inner, point) {
  return [(inner[0] + point[0]) / 2, (inner[1] + point[1]) / 2]
}

for (let i = 0; i < 50000; i++) {
  //  index可能值是0，1，2
  let index = Math.floor(Math.random() * 3)
  let point = mix([vertex[vertex.length - 2], vertex[vertex.length - 1]], initPoints[index])
  vertex.push(...point)
}

const linePoints = []
//  曲线方程
//  x = u,y = 2u,z=3u
let u = 0.01
for (let i = 0; i < 100; i++) {
  linePoints.push(u * u * 0.9, u, -1)
  u += 0.01
}
gl.clearColor(1.0, 1.0, 1.0, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT)

//  开启着色器中的顶点属性
gl.enableVertexAttribArray(vPosition)
//  描述顶点数组中的数据形式。
//  每个顶点包含2个Float数据
//  不使用归一化到（0.0，1.0）
//  第五个参数说明数组中的值是连续的
//  最后一个参数说明缓冲区中数据的起始位置
gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0)

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW)
gl.drawArrays(gl.POINTS, 0, vertex.length / 2)
