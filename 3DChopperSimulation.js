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
    var ground = createGround('https://raw.githubusercontent.com/henjinic/3DChopperSimulation/master/img/land.jpg');
    var chopper = new Chopper();
    chopper.up(0.5);

    renderer.load(ground);
    renderer.load(chopper.body);
    renderer.load(chopper.rotor1);
    renderer.load(chopper.rotor2);

    var drawAll = function() {
        renderer.clear();
        {
            renderer.setViewport(0, 0, W, H);
            renderer.defaultView();
            renderer.render(ground);
            renderer.render(chopper.body);
            renderer.render(chopper.rotor1);
            renderer.render(chopper.rotor2);
        }
        {
            renderer.setViewport(W, 0, W, H);
            var src = moveAlong(chopper.body, [0.0, 0.0, 0.0]);
            var dest = src.slice();
            dest[2] -= 1;
            var up = moveAlong(chopper.body, [0.0, 1.0, 0.0]);
            for (var i = 0; i < 3; i++) {
                up[i] -= src[i];
            }
            renderer.view(src, dest, up);
            renderer.render(ground);
        }
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
    iterator.start();
};

function moveAlong(component, vector) {
    vector.push(1.0)
    var vector4 = new Vector4(vector);

    return Array.from(component.accumulatedDynamicMatrix.multiplyVector4(vector4).elements).slice(0, 3);
}

function createGround(path) {
    return new TexturedComponent([
       -2.0, 2.0, 0.0,
        2.0, 2.0, 0.0,
        2.0,-2.0, 0.0,
       -2.0,-2.0, 0.0
    ], [
        0, 1, 2,
        0, 2, 3
    ],
        path
    );
}

class Chopper {

    constructor() {
        this.body = new ColoredComponent([
            0.1,  0.1, 0.1,  -0.1,  0.1, 0.1,  -0.1, -0.1, 0.1,   0.1, -0.1, 0.1,
            0.1,  0.1, 0.1,   0.1, -0.1, 0.1,   0.1, -0.1,-0.1,   0.1,  0.3,-0.1,
            0.1,  0.1, 0.1,   0.1,  0.3,-0.1,  -0.1,  0.3,-0.1,  -0.1,  0.1, 0.1,
           -0.1,  0.1, 0.1,  -0.1,  0.3,-0.1,  -0.1, -0.1,-0.1,  -0.1, -0.1, 0.1,
            0.1, -0.1,-0.1,  -0.1, -0.1,-0.1,  -0.1,  0.3,-0.1,   0.1,  0.3,-0.1,
           -0.02,-0.5,-0.02,  0.02,-0.5,-0.02,  0.02,-0.5, 0.02, -0.02,-0.5, 0.02,
           -0.02,-0.5, 0.02,  0.02,-0.5, 0.02,  0.1, -0.1, 0.1,  -0.1, -0.1, 0.1,
            0.02,-0.5, 0.02,  0.02,-0.5,-0.02,  0.1, -0.1,-0.1,   0.1, -0.1, 0.1,
            0.02,-0.5,-0.02, -0.02,-0.5,-0.02, -0.1, -0.1,-0.1,   0.1, -0.1,-0.1,
           -0.02,-0.5,-0.02, -0.02,-0.5, 0.02, -0.1, -0.1, 0.1,  -0.1, -0.1,-0.1
        ], [
            0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,
            0.5, 0.5, 0.5,  0.5, 0.5, 0.5,  0.5, 0.5, 0.5,  0.5, 0.5, 0.5,
            0.5, 0.7, 1.0,  0.5, 0.7, 1.0,  0.5, 0.7, 1.0,  0.5, 0.7, 1.0,
            0.5, 0.5, 0.5,  0.5, 0.5, 0.5,  0.5, 0.5, 0.5,  0.5, 0.5, 0.5,
            0.1, 0.1, 0.1,  0.1, 0.1, 0.1,  0.1, 0.1, 0.1,  0.1, 0.1, 0.1,
            0.3, 0.3, 0.3,  0.3, 0.3, 0.3,  0.3, 0.3, 0.3,  0.3, 0.3, 0.3,
            0.5, 0.5, 1.0,  0.5, 0.5, 1.0,  0.5, 0.5, 1.0,  0.5, 0.5, 1.0,
            0.6, 0.6, 0.6,  0.6, 0.6, 0.6,  0.6, 0.6, 0.6,  0.6, 0.6, 0.6,
            0.2, 0.2, 0.2,  0.2, 0.2, 0.2,  0.2, 0.2, 0.2,  0.2, 0.2, 0.2,
            0.6, 0.6, 0.6,  0.6, 0.6, 0.6,  0.6, 0.6, 0.6,  0.6, 0.6, 0.6
        ], [
             0, 1, 2,   0, 2, 3,
             4, 5, 6,   4, 6, 7,
             8, 9,10,   8,10,11,
            12,13,14,  12,14,15,
            16,17,18,  16,18,19,
            20,21,22,  20,22,23,
            24,25,26,  24,26,27,
            28,29,30,  28,30,31,
            32,33,34,  32,34,35,
            36,37,38,  36,38,39
        ]);
        this.rotor1 = this._createRotor();
        this.rotor2 = this._createRotor();
        this.height = 0.0;

        this.body.scale(0.7, 0.8, 0.5);
        this.rotor1.scale(3.0, 0.1, 0.1);
        this.rotor2.scale(0.1, 3.0, 0.1);
        this.rotor1.moveZ(0.6);
        this.rotor2.moveZ(0.6);

        this.body.fix();
        this.rotor1.fix();
        this.rotor2.fix();

        this.body.addChild(this.rotor1);
        this.body.addChild(this.rotor2);


    }

    _createRotor() {
        return new ColoredComponent([
            0.1, 0.1, 0.1,  -0.1, 0.1, 0.1,  -0.1,-0.1, 0.1,   0.1,-0.1, 0.1,
            0.1, 0.1, 0.1,   0.1,-0.1, 0.1,   0.1,-0.1,-0.1,   0.1, 0.1,-0.1,
            0.1, 0.1, 0.1,   0.1, 0.1,-0.1,  -0.1, 0.1,-0.1,  -0.1, 0.1, 0.1,
           -0.1, 0.1, 0.1,  -0.1, 0.1,-0.1,  -0.1,-0.1,-0.1,  -0.1,-0.1, 0.1,
           -0.1,-0.1,-0.1,   0.1,-0.1,-0.1,   0.1,-0.1, 0.1,  -0.1,-0.1, 0.1,
            0.1,-0.1,-0.1,  -0.1,-0.1,-0.1,  -0.1, 0.1,-0.1,   0.1, 0.1,-0.1
        ], [
            0.0, 0.0, 0.0,  0.0, 0.0, 0.0,  0.0, 0.0, 0.0,  0.0, 0.0, 0.0,
            0.6, 0.6, 0.6,  0.6, 0.6, 0.6,  0.6, 0.6, 0.6,  0.6, 0.6, 0.6,
            0.6, 0.6, 0.6,  0.6, 0.6, 0.6,  0.6, 0.6, 0.6,  0.6, 0.6, 0.6,
            0.6, 0.6, 0.6,  0.6, 0.6, 0.6,  0.6, 0.6, 0.6,  0.6, 0.6, 0.6,
            0.6, 0.6, 0.6,  0.6, 0.6, 0.6,  0.6, 0.6, 0.6,  0.6, 0.6, 0.6,
            0.0, 0.0, 0.0,  0.0, 0.0, 0.0,  0.0, 0.0, 0.0,  0.0, 0.0, 0.0
        ], [
             0, 1, 2,   0, 2, 3,
             4, 5, 6,   4, 6, 7,
             8, 9,10,   8,10,11,
            12,13,14,  12,14,15,
            16,17,18,  16,18,19,
            20,21,22,  20,22,23
        ]);
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
        this.height += distance;
    }

    down(distance) {
        if (this.height > 0.2) {
            this.body.moveZ(-distance);
            this.height -= distance;
        }
    }
};
