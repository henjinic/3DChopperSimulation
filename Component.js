/*
    Component.js

    Hyeonjin Kim
    2013875008
    Landscape Architecture

    2018.11.12
*/
var Component = function(vertices, colors, indices, texturePath) {
    
    this.vertices = new Float32Array(vertices);
    this.colors = new Float32Array(colors);
    this.indices = new Uint8Array(indices);
    this.texturePath = texturePath;
    
    this.moveMatrix = new Matrix4();
    this.posMatrix = new Matrix4();
    this.rotateMatrix = new Matrix4();
};


Component.prototype.position = function(x, y) {
    
    this.posMatrix.translate(x, y, 0.0);
};


Component.prototype.rotate = function(angle) {
    
    this.rotateMatrix.rotate(angle, 0.0, 0.0, 1.0);
};


Component.prototype.turn = function(angle) {
    
    this.moveMatrix.rotate(angle, 0.0, 0.0, 1.0);
};


Component.prototype.forward = function(distance) {
    
    this.moveMatrix.translate(0.0, distance, 0.0);
};


Component.prototype.up = function(distance) {
    
    this.moveMatrix.translate(0.0, 0.0, distance);
};


Component.prototype.getMatrix = function() {
    
    var retMatrix = new Matrix4(this.moveMatrix);
    
    retMatrix.concat(this.posMatrix);
    retMatrix.concat(this.rotateMatrix);

    return retMatrix;
};
