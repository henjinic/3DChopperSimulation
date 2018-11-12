/*
    GraphicsManager.js

    Hyeonjin Kim
    2013875008
    Landscape Architecture

    2018.11.12
*/
var GraphicsManager = function(canvas) {
    
    var VSHADER_SOURCE =
        'attribute vec4 a_Position;\n' +
        'attribute vec4 a_Color;\n' +
        'attribute vec2 a_TexCoord;\n' +
        'uniform   mat4 u_Matrix;\n' +
        'varying   vec4 v_Color;\n' +
        'varying   vec2 v_TexCoord;\n' +
        'void main() {\n' +
        '    gl_Position = u_Matrix * a_Position;\n' +
        '    v_Color     = a_Color;\n' +
        '    v_TexCoord  = a_TexCoord;\n' +
        '}\n';
    var FSHADER_SOURCE =
        '#ifdef GL_ES\n' +
        'precision mediump float;\n' +
        '#endif\n' +
        'uniform sampler2D u_Sampler;\n' +
        'varying vec2      v_TexCoord;\n' +
        'varying vec4      v_Color;\n' +
        'void main() {\n' +
        '    gl_FragColor = v_Color * texture2D(u_Sampler, v_TexCoord);\n' +
        '}\n';
    var gl = getWebGLContext(canvas);
    
    this.viewMatrix = new Matrix4();
    this.viewMatrix.lookAt(0, -3, 2, 0, 0, 0, 0, 1, 0);
    this.projMatrix = new Matrix4();
    this.projMatrix.setPerspective(90, 1.0, 0.1, 100);
    
    this.gl = gl;
    
    this.vertexBuffer = gl.createBuffer();
    this.colorBuffer = gl.createBuffer();
    this.indexBuffer = gl.createBuffer();
    this.texCoordBuffer = gl.createBuffer();
    this.texture = gl.createTexture();
    
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    
    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    
    this.locOfMatrix = gl.getUniformLocation(gl.program, 'u_Matrix');
    this.locOfSampler = gl.getUniformLocation(gl.program, 'u_Sampler');
    this.locOfPosition = gl.getAttribLocation(gl.program, 'a_Position');
    this.locOfColor = gl.getAttribLocation(gl.program, 'a_Color');
    this.locOfTexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');

    gl.enable(gl.DEPTH_TEST);
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
    this.clear();
};


GraphicsManager.prototype.draw = function(component) {
    
    var gl = this.gl;
    var mvpMatrix = new Matrix4(this.projMatrix).concat(this.viewMatrix).concat(component.getMatrix());
    
    gl.uniformMatrix4fv(this.locOfMatrix, false, mvpMatrix.elements);
    
    this._setBuffer(this.vertexBuffer, component.vertices, this.locOfPosition, 3);
    
    if (component.colors == 0) {
        var image = new Image();
        
        image.onload = function() {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
            
            gl.uniform1i(locOfSampler, 0);
            
            this._setBuffer(this.texCoordBuffer, [
                0.0, 1.0,
                0.0, 0.0,
                1.0, 1.0,
                1.0, 0.0,
            ], this.locOfTexCoord, 2);
        };
        image.src = component.texturePath;
    } else {
        this._setBuffer(this.colorBuffer, component.colors, this.locOfColor, 3);
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, component.indices, gl.STATIC_DRAW);
    gl.drawElements(gl.TRIANGLES, component.indices.length, gl.UNSIGNED_BYTE, 0);
};


GraphicsManager.prototype._setBuffer = function(buffer, array, location, num) {
    
    var gl = this.gl;
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
    gl.vertexAttribPointer(location, num, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(location);
};


GraphicsManager.prototype.clear = function() {
    
    var gl = this.gl;
    
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
};


GraphicsManager.prototype.setViewport = function(posX, posY, width, height) {
    
    this.gl.viewport(posX, posY, width, height);
};
