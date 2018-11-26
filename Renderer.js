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
        this.program['TEXTURED'] = this._setProgram(gl.program, ['a_Position', 'a_TexCoord', 'u_MvpMatrix', 'u_Sampler']);

        this.viewMatrix = new Matrix4();
        this.defaultView();
        this.projMatrix = new Matrix4();
        this.projMatrix.setPerspective(90, 1.0, 0.1, 100);

        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.clear();
    }

    view(src, dest, up) {
        this.viewMatrix.setLookAt(...src, ...dest, ...up);
    }

    defaultView() {
        this.viewMatrix.setLookAt(0, -3, 2, 0, 0, 0, 0, 1, 0);
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
        if (component instanceof ColoredComponent) {
            component.vao = gl.createVertexArray();
            this._setColoredVao(component.vao, component.vertices, component.colors, component.indices);
        } else if (component instanceof TexturedComponent) {
            {
                component.vao = gl.createVertexArray();
                gl.bindVertexArray(component.vao);
                this._setArrayBuffer(component.vertices, this.program['TEXTURED'].loc['a_Position'], 3);
                this._setArrayBuffer(new Float32Array([0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0]), this.program['TEXTURED'].loc['a_TexCoord'], 2);
                component.image.onload = function() {
                    component.texture = gl.createTexture();
                    gl.bindTexture(gl.TEXTURE_2D, component.texture);
                    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, component.image);
                    component.isLoaded = true;
                };
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, component.indices, gl.STATIC_DRAW);
            }
            {
                component.loadingVao = gl.createVertexArray();
                var loadingColor = [0.2, 0.3, 0.1];
                var loadingColors = [];
                for (var i = 0; i < 4; i++) {
                    loadingColors = loadingColors.concat(loadingColor);
                }
                this._setColoredVao(component.loadingVao, component.vertices, new Float32Array(loadingColors), component.indices);
            }
        } else {
            console.log('Error: Renderer.load()');
        }
    }

    _setColoredVao(vao, vertices, colors, indices) {
        var gl = this.gl;
        gl.bindVertexArray(vao);
        this._setArrayBuffer(vertices, this.program['COLORED'].loc['a_Position'], 3);
        this._setArrayBuffer(colors, this.program['COLORED'].loc['a_Color'], 3);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    }

    _setArrayBuffer(data, location, num) {
        var gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        gl.vertexAttribPointer(location, num, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(location);
    }

    render(component) {
        var gl = this.gl;
        var mvpMatrix = new Matrix4(this.projMatrix).concat(this.viewMatrix).concat(component.modelMatrix);
        if (component instanceof ColoredComponent) {
            gl.bindVertexArray(component.vao);
            gl.useProgram(this.program['COLORED']);
            gl.uniformMatrix4fv(this.program['COLORED'].loc['u_MvpMatrix'], false, mvpMatrix.elements);
            gl.drawElements(gl.TRIANGLES, component.indices.length, gl.UNSIGNED_BYTE, 0);
        } else if (component instanceof TexturedComponent) {
            if (component.isLoaded) {
                gl.bindVertexArray(component.vao);
                gl.useProgram(this.program['TEXTURED']);
                gl.uniformMatrix4fv(this.program['TEXTURED'].loc['u_MvpMatrix'], false, mvpMatrix.elements);
                gl.bindTexture(gl.TEXTURE_2D, component.texture);
                gl.activeTexture(gl.TEXTURE0);
                gl.uniform1i(this.program['TEXTURED'].loc['u_Sampler'], 0);
                gl.drawElements(gl.TRIANGLES, component.indices.length, gl.UNSIGNED_BYTE, 0);
            } else {
                gl.bindVertexArray(component.loadingVao);
                gl.useProgram(this.program['COLORED']);
                gl.uniformMatrix4fv(this.program['COLORED'].loc['u_MvpMatrix'], false, mvpMatrix.elements);
                gl.drawElements(gl.TRIANGLES, component.indices.length, gl.UNSIGNED_BYTE, 0);
            }
        } else {
            console.log('Error: Renderer.render()');
        }
    }

    setViewport(posX, posY, width, height) {
        this.gl.viewport(posX, posY, width, height);
    }

    clear() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT);
    }
}
