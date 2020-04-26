import initShader from './initShader'
window.onload = function () {
    const canvas = document.getElementById('canvas')
    const gl = canvas.getContext('webgl', { antialias: true, preserveDrawingBuffer: true })
    console.log(canvas.width, canvas.height)
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clearColor(1.0, 1.0, 1.0, 1.0)
    gl.enable(gl.DEPTH_TEST)

    const VERTEX_SOURCE = `
attribute vec4 vPosition;
attribute vec4 vColor;
uniform vec3 theta;

varying vec4 fColor;
void main(){
    vec3 angles = radians(theta);
    vec3 s = sin(angles);
    vec3 c = cos(angles);
    mat4 x = mat4(
        1.0,0.0,0.0,0.0,
        0.0,c.x,-s.x,0.0,
        0.0,s.x,c.x,0.0,
        0.0,0.0,0.0,1.0
    );

    mat4 y = mat4(
        c.y,0.0,s.y,0.0,
        0.0,1.0,0.0,0.0,
        -s.y,0.0,c.y,0.0,
        0.0,0.0,0.0,1.0
    );

    mat4 z = mat4(
        c.z,-s.z,0.0,0.0,
        s.z,c.z,0.0,0.0,
        0.0,0.0,1.0,0.0,
        0.0,0.0,0.0,1.0
    );
    fColor = vColor;
    gl_Position = z * y * x * vPosition;
}
`
    const FRAGMENT_SOURCE = `
precision mediump float;
varying vec4 fColor;
void main(){
    gl_FragColor = fColor;
}
`
    const program = initShader(gl, VERTEX_SOURCE, FRAGMENT_SOURCE)
    gl.useProgram(program)

    const vertexPoints = [
        [-0.5, -0.5, -0.5],
        [-0.5, -0.5, 0.5],
        [0.5, -0.5, 0.5],
        [0.5, -0.5, -0.5],
        [-0.5, 0.5, -0.5],
        [-0.5, 0.5, 0.5],
        [0.5, 0.5, 0.5],
        [0.5, 0.5, -0.5]
    ]
    const pointIndex = [
        [0, 3, 2, 1], [4, 5, 6, 7], [6, 2, 3, 7], [4, 0, 1, 5], [7, 3, 0, 4], [5, 1, 2, 6]
    ]
    const points = []

    const faceColors = [
        [0.5, 0.0, 0.0], [0.0, 0.5, 0.0], [0.0, 0.0, 0.5], [0.5, 0.5, 0.0], [0.5, 0.0, 0.5], [0.0, 0.5, 0.5]

    ]
    const colors = []

    const theta = [0, 45, 0]
    const xAxis = 0
    const yAxis = 1
    const zAxis = 2
    let axis = xAxis
    for (let i = 0; i < pointIndex.length; i++) {
        quad(...pointIndex[i], faceColors[i])
    }
    const vBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW)
    const vPosition = gl.getAttribLocation(program, 'vPosition')
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(vPosition)

    const cBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)
    const vColor = gl.getAttribLocation(program, 'vColor')
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(vColor)

    const thetaLoc = gl.getUniformLocation(program, 'theta')
    function quad(a, b, c, d, color) {
        const index = [a, b, c, a, c, d]
        for (let i = 0; i < index.length; i++) {
            points.push(...vertexPoints[index[i]])
            colors.push(...color)
        }

    }
    render()
    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        theta[axis] += 2;
        gl.uniform3fv(thetaLoc, theta)
        gl.drawArrays(gl.TRIANGLES, 0, points.length / 3);
        requestAnimationFrame(render);
    }

}