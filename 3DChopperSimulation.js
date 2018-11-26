/*
    3DChopperSimulation.js

    Hyeonjin Kim
    2013875008
    Landscape Architecture

    2018.11.25
*/
function main() {
    var canvas = document.getElementById('webgl');

    const W = canvas.width / 2;
    const H = canvas.height;

    var renderer = new Renderer(canvas);



    var ground = new TexturedComponent([
       -2.0, 2.0, 0.0,
        2.0, 2.0, 0.0,
        2.0,-2.0, 0.0,
       -2.0,-2.0, 0.0
    ], [
        0, 1, 2,
        0, 2, 3
    ],
        'https://raw.githubusercontent.com/henjinic/3DChopperSimulation/master/img/land.jpg'
    );
    var chopper = new Chopper();
    renderer.load(ground);
    renderer.load(chopper.body);
    renderer.load(chopper.rotor1);
    renderer.load(chopper.rotor2);

    var drawAll = function() {
        renderer.clear();
        renderer.setViewport(0, 0, W, H);
        renderer.render(ground);
        renderer.render(chopper.body);
        renderer.render(chopper.rotor1);
        renderer.render(chopper.rotor2);
        renderer.setViewport(W, 0, W, H);
        //renderer.render(ground);
    }
    drawAll();

    document.addEventListener('keydown', function(event) {
        switch (event.keyCode) {
            case 37: chopper.clockwise(10.0);        break; // left
            case 38: chopper.forward(0.05);          break; // up
            case 39: chopper.counterclockwise(10.0); break; // right
            case 40: chopper.backward(0.05);         break; // down
            case 87: chopper.up(0.05);               break; // W
            case 83: chopper.down(0.05);             break; // S
        }
        drawAll();
    });

    var iterator = new Iterator(1.0, 200.0, function(amount) { // 200 degrees per 1 sec
        chopper.rotor1.rotateZ(amount);
        chopper.rotor2.rotateZ(amount);
        drawAll();
    });
    //iterator.start();
};

class Chopper {

    constructor() {
        this.body = new ColoredComponent([
            0.1, 0.1, 0.1,  -0.1, 0.1, 0.1,  -0.1,-0.1, 0.1,   0.1,-0.1, 0.1,  // v0-v1-v2-v3 front
            0.1, 0.1, 0.1,   0.1,-0.1, 0.1,   0.1,-0.1,-0.1,   0.1, 0.1,-0.1,  // v0-v3-v4-v5 right
            0.1, 0.1, 0.1,   0.1, 0.1,-0.1,  -0.1, 0.1,-0.1,  -0.1, 0.1, 0.1,  // v0-v5-v6-v1 up
           -0.1, 0.1, 0.1,  -0.1, 0.1,-0.1,  -0.1,-0.1,-0.1,  -0.1,-0.1, 0.1,  // v1-v6-v7-v2 left
           -0.1,-0.1,-0.1,   0.1,-0.1,-0.1,   0.1,-0.1, 0.1,  -0.1,-0.1, 0.1,  // v7-v4-v3-v2 down
            0.1,-0.1,-0.1,  -0.1,-0.1,-0.1,  -0.1, 0.1,-0.1,   0.1, 0.1,-0.1   // v4-v7-v6-v5 back
        ], [
            0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  // v0-v1-v2-v3 front(blue)
            0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  // v0-v3-v4-v5 right(green)
            1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  // v0-v5-v6-v1 up(red)
            1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
            1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
            0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0   // v4-v7-v6-v5 back
        ], [
             0, 1, 2,   0, 2, 3,    // front
             4, 5, 6,   4, 6, 7,    // right
             8, 9,10,   8,10,11,    // up
            12,13,14,  12,14,15,    // left
            16,17,18,  16,18,19,    // down
            20,21,22,  20,22,23     // back
        ]);

        this.rotor1 = new ColoredComponent([
            0.1, 0.1, 0.1,  -0.1, 0.1, 0.1,  -0.1,-0.1, 0.1,   0.1,-0.1, 0.1,  // v0-v1-v2-v3 front
            0.1, 0.1, 0.1,   0.1,-0.1, 0.1,   0.1,-0.1,-0.1,   0.1, 0.1,-0.1,  // v0-v3-v4-v5 right
            0.1, 0.1, 0.1,   0.1, 0.1,-0.1,  -0.1, 0.1,-0.1,  -0.1, 0.1, 0.1,  // v0-v5-v6-v1 up
           -0.1, 0.1, 0.1,  -0.1, 0.1,-0.1,  -0.1,-0.1,-0.1,  -0.1,-0.1, 0.1,  // v1-v6-v7-v2 left
           -0.1,-0.1,-0.1,   0.1,-0.1,-0.1,   0.1,-0.1, 0.1,  -0.1,-0.1, 0.1,  // v7-v4-v3-v2 down
            0.1,-0.1,-0.1,  -0.1,-0.1,-0.1,  -0.1, 0.1,-0.1,   0.1, 0.1,-0.1   // v4-v7-v6-v5 back
        ], [
            0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  // v0-v1-v2-v3 front(blue)
            0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  // v0-v3-v4-v5 right(green)
            1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  // v0-v5-v6-v1 up(red)
            1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
            1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
            0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0   // v4-v7-v6-v5 back
        ], [
             0, 1, 2,   0, 2, 3,    // front
             4, 5, 6,   4, 6, 7,    // right
             8, 9,10,   8,10,11,    // up
            12,13,14,  12,14,15,    // left
            16,17,18,  16,18,19,    // down
            20,21,22,  20,22,23     // back
        ]);

        this.rotor2 = new ColoredComponent([
            0.1, 0.1, 0.1,  -0.1, 0.1, 0.1,  -0.1,-0.1, 0.1,   0.1,-0.1, 0.1,  // v0-v1-v2-v3 front
            0.1, 0.1, 0.1,   0.1,-0.1, 0.1,   0.1,-0.1,-0.1,   0.1, 0.1,-0.1,  // v0-v3-v4-v5 right
            0.1, 0.1, 0.1,   0.1, 0.1,-0.1,  -0.1, 0.1,-0.1,  -0.1, 0.1, 0.1,  // v0-v5-v6-v1 up
           -0.1, 0.1, 0.1,  -0.1, 0.1,-0.1,  -0.1,-0.1,-0.1,  -0.1,-0.1, 0.1,  // v1-v6-v7-v2 left
           -0.1,-0.1,-0.1,   0.1,-0.1,-0.1,   0.1,-0.1, 0.1,  -0.1,-0.1, 0.1,  // v7-v4-v3-v2 down
            0.1,-0.1,-0.1,  -0.1,-0.1,-0.1,  -0.1, 0.1,-0.1,   0.1, 0.1,-0.1   // v4-v7-v6-v5 back
        ], [
            0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  // v0-v1-v2-v3 front(blue)
            0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  // v0-v3-v4-v5 right(green)
            1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  // v0-v5-v6-v1 up(red)
            1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
            1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
            0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0   // v4-v7-v6-v5 back
        ], [
             0, 1, 2,   0, 2, 3,    // front
             4, 5, 6,   4, 6, 7,    // right
             8, 9,10,   8,10,11,    // up
            12,13,14,  12,14,15,    // left
            16,17,18,  16,18,19,    // down
            20,21,22,  20,22,23     // back
        ]);

        this.rotor1.scale(2.0, 0.2, 0.2);
        this.rotor2.scale(0.2, 2.0, 0.2);

        this.rotor1.moveZ(0.5);
        this.rotor2.moveZ(0.5);

        this.rotor1.fix();
        this.rotor2.fix();

        this.body.addChild(this.rotor1);
        this.body.addChild(this.rotor2);
    }

    forward(distance) {
        this.body.moveY(distance);
    }

    backward(distance) {
        this.body.moveY(-distance);
    }

    clockwise(angle) {
        this.body.rotateZ(angle);
        this.rotor1.rotateZ(-angle);
        this.rotor2.rotateZ(-angle); // adjustment
    }

    counterclockwise(angle) {
        this.body.rotateZ(-angle);
        this.rotor1.rotateZ(angle);
        this.rotor2.rotateZ(angle); // adjustment
    }

    up(distance) {
        this.body.moveZ(distance);
    }

    down(distance) {
        this.body.moveZ(-distance);
    }
};
