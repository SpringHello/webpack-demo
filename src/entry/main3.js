//  绘制一个球
import {mat4, vec3} from 'gl-matrix'

main();

function main () {
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl');


  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Vertex shader program

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying lowp vec4 vColor;
    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

  // Fragment shader program

  const fsSource = `
    varying lowp vec4 vColor;
    void main() {
      gl_FragColor = vColor;
    }
  `;
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  gl.useProgram(shaderProgram)

  //  颜色数据
  const colorBuffer = gl.createBuffer();
  const colors = [
    1.0, 0.0, 0.0, 1.0,    // 红
    0.0, 1.0, 1.0, 1.0,    // 绿
    0.0, 0.0, 0.0, 1.0,    // 绿
  ];

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(colors),
    gl.STATIC_DRAW
  );

  //  顶点数据放入缓存
  let buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  //  四边形
  /*let vertex = [
    1.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    1.0, 0.0, 0.0,
    0.0, 0.0, 0.0
  ]*/
  //  投影矩阵
  let projectionMatrix = mat4.create()
  let fieldOfView = 45 * Math.PI / 180
  let aspect = 1.0
  const zNear = 1.0
  const zFar = 100.0
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)
  let projectionMatrixLocation = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix')
  gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);


  //  模型视图矩阵
  let uModelViewMatrix = mat4.create();
  mat4.translate(uModelViewMatrix, uModelViewMatrix, vec3.fromValues(0.0, 0.0, -10.0))
  //mat4.scale(s, s, vec3.fromValues(1.0, 0.5, 0.5));
  let ModelViewMatrixLocation = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')
  gl.uniformMatrix4fv(ModelViewMatrixLocation, false, uModelViewMatrix);

  //  清屏
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  //每15度切一个圆
  let step = 15;

  //  球的两个顶点之一（背面）
  let vertex = [0.0, 0.0, -1.0]
  let j = -90 + step;
  let z = Math.sin(j * Math.PI / 180)
  console.log(z)
  for (let i = 0; i <= 360; i += 15) {
    let y = Math.sqrt(1 - z * z) * Math.sin(i * Math.PI / 180)
    let x = Math.sqrt(1 - z * z) * Math.cos(i * Math.PI / 180)
    vertex.push(x, y, z)
  }
  console.log(vertex)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW)
  let vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition')
  gl.enableVertexAttribArray(vertexPosition)
  gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 12, 0);
  let vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(vertexColorAttribute);
  gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, vertex.length);


  //  球的两个顶点之一（正面）
  /*vertex = [0.0, 0.0, 1.0]
  j = 90 - step;
  z = Math.sin(j * Math.PI / 180)
  for (let i = 0; i <= 360; i += 15) {
    let y = Math.sqrt(1 - z * z) * Math.sin(i * Math.PI / 180)
    let x = Math.sqrt(1 - z * z) * Math.cos(i * Math.PI / 180)
    vertex.push(x, y, z)
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW)
  vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition')
  gl.enableVertexAttribArray(vertexPosition)
  gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 12, 0);

  vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(vertexColorAttribute);
  gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.TRIANGLE_FAN, 0, vertex.length);*/


  //  绘制球体
  vertex = []
  for (let j = -75; j <= 60; j += step) {
    for (let i = 0; i <= 360; i += step) {
      let z = Math.sin(j * Math.PI / 180)
      let y = Math.sqrt(1 - z * z) * Math.sin(i * Math.PI / 180)
      let x = Math.sqrt(1 - z * z) * Math.cos(i * Math.PI / 180)
      vertex.push(x, y, z)
      z = Math.sin((j + step) * Math.PI / 180)
      y = Math.sqrt(1 - z * z) * Math.sin(i * Math.PI / 180)
      x = Math.sqrt(1 - z * z) * Math.cos(i * Math.PI / 180)
      vertex.push(x, y, z)
    }
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW)
  vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition')
  gl.enableVertexAttribArray(vertexPosition)
  gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 12, 0);


  vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(vertexColorAttribute);
  gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertex.length);
}


function initShaderProgram (gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.log('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

function loadShader (gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
