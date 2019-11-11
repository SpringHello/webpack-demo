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
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
  `;

  // Fragment shader program

  const fsSource = `
    void main() {
      gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
    }
  `;
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  gl.useProgram(shaderProgram)

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

  //  圆形
  let vertex = [
    0.0, 0.0, 0.0
  ]
  for (let i = 0; i <= 360; i += 1) {
    let y = Math.sin(i * Math.PI / 180)
    let x = Math.cos(i * Math.PI / 180)
    vertex.push(x, y, 0.0)
  }
  console.log(vertex)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW)
  let vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition')
  gl.enableVertexAttribArray(vertexPosition)
  //  模型视图矩阵
  let uModelViewMatrix = mat4.create();
  mat4.translate(uModelViewMatrix, uModelViewMatrix, vec3.fromValues(0.0, 0.0, -6.0))
  //mat4.scale(s, s, vec3.fromValues(1.0, 0.5, 0.5));
  let ModelViewMatrixLocation = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix')
  gl.uniformMatrix4fv(ModelViewMatrixLocation, false, uModelViewMatrix);

  //  投影矩阵
  let projectionMatrix = mat4.create()
  let fieldOfView = 45 * Math.PI / 180
  let aspect = 1.0
  const zNear = 1.0
  const zFar = 100.0
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)
  let projectionMatrixLocation = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix')
  gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);

  gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 12, 0);
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLE_FAN, 0, vertex.length);
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
