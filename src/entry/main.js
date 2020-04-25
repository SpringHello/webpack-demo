import initShader from './initShader'
const canvas = document.getElementById('canvas')
const gl = canvas.getContext('webgl')
gl.viewport(0, 0, 500, 500)
gl.clearColor(1.0, 1.0, 1.0, 1.0)
gl.enable(gl.DEPTH_TEST)

const VERTEX_SOURCE = ``
const FRAGMENT_SOURCE = ``
const program = initShader(gl, VERTEX_SOURCE, FRAGMENT_SOURCE)
gl.useProgram(program)

const vertexPoints = [
  {}
]
const vBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer)
gl.bufferData(gl.ARRAY_BUFFER, vBuffer)