/*
    Renderer.js

    Hyeonjin Kim
    2013875008
    Landscape Architecture

    2018.11.25
*/
class Renderer {

    constructor(canvas) {
        var gl = this.gl = canvas.getContext('webgl2');

        this.program = {};

        initShaders(gl, document.getElementById('vshader-colored').text, document.getElementById('fshader-colored').text);
        this.program['COLORED'] = this._setProgram(gl.program, ['a_Position', 'a_Color', 'u_MvpMatrix']);

        initShaders(gl, document.getElementById('vshader-textured').text, document.getElementById('fshader-textured').text);
        this.program['TEXTURED'] = this._setProgram(gl.program, ['a_Position', 'a_TexCoord', 'u_Sampler']);

        this.viewMatrix = new Matrix4();
        this.viewMatrix.lookAt(0, -3, 2, 0, 0, 0, 0, 1, 0);

        this.projMatrix = new Matrix4();
        this.projMatrix.setPerspective(90, 1.0, 0.1, 100);

        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.clear();
    }

    _setProgram(program, locations) {
        program.loc = {};
        for (var location of locations) {
            if (location[0] == 'a') {
                program.loc[location] = this.gl.getAttribLocation(program, location);
            } else if (location[0] == 'u') {
                program.loc[location] = this.gl.getUniformLocation(program, location);
            } else {
                console.log('Error: Renderer._setProgram');
            }
        }
        return program;
    }

    load(component) {
        var gl = this.gl;

        component.vao = gl.createVertexArray();
        gl.bindVertexArray(component.vao);
        if (component instanceof ColoredComponent) {
            var program = this.program['COLORED'];

            this._setArrayBuffer(component.vertices, program.loc['a_Position']);
            this._setArrayBuffer(component.colors, program.loc['a_Color']);

            var indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, component.indices, gl.STATIC_DRAW);

        } else if (component instanceof TexturedComponent) {

        } else {
            console.log('Error: Renderer.load()');
        }
        
        //gl.bindVertexArray(null); 
    }

    _setArrayBuffer(data, location) {
        var gl = this.gl;
        var buffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(location);
    }

    render(component) {
        var gl = this.gl;
        var mvpMatrix = new Matrix4(this.projMatrix).concat(this.viewMatrix).concat(component.modelMatrix);

        if (component instanceof ColoredComponent) {
            var program = this.program['COLORED'];
            gl.useProgram(program);
            gl.uniformMatrix4fv(program.loc['u_MvpMatrix'], false, mvpMatrix.elements);
            gl.bindVertexArray(component.vao);
            gl.drawElements(gl.TRIANGLES, component.indices.length, gl.UNSIGNED_BYTE, 0);
        } else if (component instanceof TexturedComponent) {

        } else {
            console.log('Error: Renderer.render()');
        }
    }

    setViewport(posX, posY, width, height) {
    
        this.gl.viewport(posX, posY, width, height);
    }

    clear() {
        var gl = this.gl;
    
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    }
}


var GraphicsManager = function(canvas) {

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
    
    this._setBuffer(this.texCoordBuffer, [
        0.0, 1.0,
        0.0, 0.0,
        1.0, 1.0,
        1.0, 0.0
    ], this.locOfTexCoord, 2);

    var texture = this.texture;
    var locOfSampler = this.locOfSampler;
    this._setBuffer(this.colorBuffer, component.colors, this.locOfColor, 3); 
    component.image.onload = function() {        
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, component.image);
        
        gl.uniform1i(locOfSampler, 0);
    };
    component.image.src = component.texturePath;
    

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, component.indices, gl.STATIC_DRAW);
    gl.drawElements(gl.TRIANGLES, component.indices.length, gl.UNSIGNED_BYTE, 0);
};
