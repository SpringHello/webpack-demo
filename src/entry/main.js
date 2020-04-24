window.onload = (function () {
    const canvas = document.getElementById('canvas')
    const gl = canvas.getContext('webgl')

    //设置gl的视口
    gl.viewPort(0, 0, canvas.width, canvas.height)
    //设置clearColor，背景颜色
    gl.clearColor(1.0, 1.0, 1.0, 1.0)
    //开启深度测试
    gl.enable(gl.DEPTH_TEST)

    function initShader(type, source) {
        const shader = gl.createShader(type)
        gl.shaderSource(source)
        gl.compileShader(shader)
        return shader
    }
    return function () {
        const vertex = initShader(gl.VERTEX_SHADER)
        const fragment = initShader(gl.FRAGMENT_SHADER)
        const program = gl.createProgram()
        gl.attachShader(program, vertex)
        gl.attachShader(program, fragment)
    }
})()