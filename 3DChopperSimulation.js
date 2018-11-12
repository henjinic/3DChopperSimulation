/*
    3DChopperSimulation.js

    Hyeonjin Kim
    2013875008
    Landscape Architecture

    2018.11.11
*/
function main() {
    
    // var chopper = new Chopper();
    var canvas = document.getElementById('webgl');
    const W = canvas.width / 2;
    const H = canvas.height;
    
    var gm = new GraphicsManager(canvas);

    var chopper = new Chopper();
    var ground = new Component([
       -2.0, 2.0, 0.0, 
        2.0, 2.0, 0.0,
        2.0,-2.0, 0.0,
       -2.0,-2.0, 0.0
    ], 0, [
        0, 1, 2,
        0, 2, 3
    ], './land.jpg');
    
    gm.clear();
    gm.setViewport(0, 0, W, H);
    gm.draw(chopper.body);
    gm.draw(ground);
    gm.setViewport(W, 0, W, H);
    // gm.addComponent(chopper.body);
    // gm.addComponent(chopper.rotor);
    // gm.addComponent(chopper.subrotor);

    // var iterForRotor = new Iterator(1.0, 200.0, function(amount) { // 200 degrees per 1 sec
        // chopper.rotor.rotate(amount);
        // gm.drawComponents();
    // });
    // var iterForSubrotor = new Iterator(1.0, 350.0, function(amount) { // 350 degrees per 1 sec
        // chopper.subrotor.rotate(amount);
        // gm.drawComponents();
    // });

    document.addEventListener('keydown', function(event) {
        switch (event.keyCode) {
            case 37: chopper.turn(10.0);     break; // left
            case 38: chopper.forward(0.05);  break; // up
            case 39: chopper.turn(-10.0);    break; // right
            case 40: chopper.forward(-0.05); break; // down
            case 87: chopper.up(0.05);  break; // W
            case 83: chopper.up(-0.05); break; // S
        }
        gm.clear();
        gm.setViewport(0, 0, W, H);
        gm.draw(chopper.body);
        gm.draw(ground);
        gm.setViewport(W, 0, W, H);
    });

    // iterForRotor.start();
    // iterForSubrotor.start();
};


var Chopper = function() {
   
    this.body = new Component([
        0.1, 0.1, 0.1,  -0.1, 0.1, 0.1,  -0.1,-0.1, 0.1,   0.1,-0.1, 0.1,  // v0-v1-v2-v3 front
        0.1, 0.1, 0.1,   0.1,-0.1, 0.1,   0.1,-0.1,-0.1,   0.1, 0.1,-0.1,  // v0-v3-v4-v5 right
        0.1, 0.1, 0.1,   0.1, 0.1,-0.1,  -0.1, 0.1,-0.1,  -0.1, 0.1, 0.1,  // v0-v5-v6-v1 up
       -0.1, 0.1, 0.1,  -0.1, 0.1,-0.1,  -0.1,-0.1,-0.1,  -0.1,-0.1, 0.1,  // v1-v6-v7-v2 left
       -0.1,-0.1,-0.1,   0.1,-0.1,-0.1,   0.1,-0.1, 0.1,  -0.1,-0.1, 0.1,  // v7-v4-v3-v2 down
        0.1,-0.1,-0.1,  -0.1,-0.1,-0.1,  -0.1, 0.1,-0.1,   0.1, 0.1,-0.1   // v4-v7-v6-v5 back
    ], [0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  // v0-v1-v2-v3 front(blue)
        0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  // v0-v3-v4-v5 right(green)
        1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  // v0-v5-v6-v1 up(red)
        1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
        1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
        0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0   // v4-v7-v6-v5 back
    ], [ 0, 1, 2,   0, 2, 3,    // front
         4, 5, 6,   4, 6, 7,    // right
         8, 9,10,   8,10,11,    // up
        12,13,14,  12,14,15,    // left
        16,17,18,  16,18,19,    // down
        20,21,22,  20,22,23     // back
    ], 0);

    // turning method
    this.turn = function(angle) {
        this.body.turn(angle);
        // this.rotor.turn(angle);
        // this.rotor.rotate(-angle); // adjustment
        // this.subrotor.turn(angle);
        // this.subrotor.rotate(-angle); // adjustment
    };
    
    // forwarding method
    this.forward = function(distance) {
        this.body.forward(distance);
        // this.rotor.forward(distance);
        // this.subrotor.forward(distance);
    };
    
    this.up = function(distance) {
        this.body.up(distance);
    }
};
