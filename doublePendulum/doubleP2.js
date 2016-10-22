var pend, pend2; // the pendulum
var w;
var h;
var s; //scaling factor for drawing the arms
// Control Parameters
/*var waves = 3
    , spacing = 50
    , radius = 50
    , speed = 50
    , trail = 50;*/
//var pause = false;
//var moveCenter = false;
//var history = 20;
// GUI functions
var gui;
var guiP;
var guiParams = function () {
    /*
    this.waves = 3;
    this.spacing = 50;
    this.radius = 50;
    this.speed = 50;
    this.trail = 50;
    this.funnyRadius = false;
    
    */
    this.pause = false;
    this.moveCenter = false;
    this.history = 50;
};

function initGUI() {
    guiP = new guiParams();
    gui = new dat.GUI();
    /*
    gui.add(guiP, 'waves', 0, 8);
    gui.add(guiP, 'spacing', 1, 100);
    gui.add(guiP, 'radius', 1, 100);
    gui.add(guiP, 'speed', 1, 100);
    gui.add(guiP, 'trail', 1, 100);
    */
    
    gui.add(guiP, 'moveCenter', false);
    gui.add(guiP, 'pause', false);
    gui.add(guiP, 'history', 0, 100);
};

function updateParams() {
    /*
    sp = guiP.spacing / 2;
    r = guiP.radius / 5;
    c = map(guiP.speed, 1, 100, 2, 0.3);
    // cohForce = map(guiP.cohesion,1,100,0,1.0);
    */
};

function setup() {
    initGUI();
    var canvas = createCanvas(windowWidth, windowHeight);
    // Move the canvas so it's inside our <div id="sketch-holder">.
    canvas.parent('sketch-holder');
    colorMode(HSB, 360, 100, 100, 100);
    noStroke();
    background(0);
    smooth();
    initPendulum();
}

function initPendulum() {
    background(0);
    pend = new DoublePendulum();
   // pend2 = pend;
    s = 30;
    pend.centerx = width / 3;
    pend.centery = height / 2;
    pend.m1 = random(1, 3);
    pend.m2 = random(0.5, 2);
    pend.l1 = random(3.5,4.5);
    pend.l2 = 8 - pend.l1;
    pend.g = 10;
    pend.x[0] = 3;
    pend.x[1] = 0;
    pend.x[2] = 3.14;
    pend.x[3] = 0;
    
    pend.posx = pend.centerx + s * pend.l1 * sin(pend.x[0]) + s * pend.l2 * sin(pend.x[2]);
    pend.posy = pend.centery + s * pend.l1 * cos(pend.x[0]) + s * pend.l2 * cos(pend.x[2]);

    
    pend2 = new DoublePendulum();
    pend2.centerx = 2*width / 3;
    pend2.centery = height / 2;
    pend2.m1 = random(1, 3);
    pend2.m2 = random(0.5, 2);
    pend2.l1 = random(3.5,4.5);
    pend2.l2 = 8 - pend2.l1;
    pend2.g = 1.5;
    pend2.x[0] = 3;
    pend2.x[1] = 0;
    pend2.x[2] = 3.14;
    pend2.x[3] = 0;
    
    pend2.posx = pend2.centerx + s * pend2.l1 * sin(pend2.x[0]) + s * pend2.l2 * sin(pend2.x[2]);
    pend2.posy = pend2.centery + s * pend2.l1 * cos(pend2.x[0]) + s * pend2.l2 * cos(pend2.x[2]);

    
}

function mouseReleased() {
    
    if(mouseX< 0.8*width) initPendulum();
}

function draw() {
    updateParams();
    h = 0.03/2;
    if (!guiP.pause) {
        
        if (frameCount % 10 == 0) {
            //background(0, 10);
            background(0, map(guiP.history,0,100,20,0));
        }
        
        if(guiP.moveCenter){
            centerx = map(noise(frameCount/500), 0, 1,width/3,2*width/3);
            
            centery = map(noise(200 + frameCount/500), 0, 1,height/3,2*height/3);
        }
        pend.update();
        pend2.update();
        console.log(pend.centerx);
        
        noStroke();
        
        var vel = sqrt((pend.posx - pend.newposx) * (pend.posx - pend.newposx) + (pend.posy - pend.newposy) * (pend.posy - pend.newposy));
        // should calculate vel wrt the actual states instead of the xy pos as it doesn't scale well right now
         stroke(frameCount / 5 % 360, 100 - vel * 5, 100, vel * 10 + 50);
        strokeWeight(1.5);
       if (frameCount % 5 == 0){
        line(pend.posx, pend.posy, pend2.posx, pend2.posy);
        }
        
        //stroke(100, 0, 100, 15);
        strokeWeight(0.75);
        pend.drawP();
        stroke(100, 0, 100, 15);
    //    ellipse(pend.posx,pend.posy,3,3);
        stroke(100, 100, 100, 15);
     //   ellipse(pend2.posx,pend2.posy,3,3);
        
        pend.posx = pend.newposx;
        pend.posy = pend.newposy;
        pend2.posx = pend2.newposx;
        pend2.posy = pend2.newposy;
        
    }
}

function DoublePendulum() {
    this.posx, this.posy;
    this.newposx, this.newposy;
    this.endx, this.endy;
    this.centerx, this.centery;
    this.m1;
    this.m2; //point masses at the ends of the arms
    this.g; //gravity constant
    this.l1;
    this.l2; //arm lengths
    this.x = [3, 0, 3.14, 0];
    //new float[4];      //state vector,  state vars are theta1 theta1' theta2 theta2'
    this.dx = [0, 0, 0, 0]; // = new float[4];     //for storing the value of the state function at the current state
    this.update = function () {
        //evaluate the state functions
        this.dx[0] = this.x[1];
        this.dx[1] = -this.g * (2 * this.m1 + this.m2) * sin(this.x[0]) - this.m2 * this.g * sin(this.x[0] - 2 * this.x[2]) - 2 * sin(this.x[0] - this.x[2]) * this.m2 * (this.x[3] * this.x[3] * this.l2 + this.x[1] * this.x[1] * this.l1 * cos(this.x[0] - this.x[2]));
        this.dx[1] = this.dx[1] / (this.l1 * (2 * this.m1 + this.m2 - this.m2 * cos(2 * this.x[0] - 2 * this.x[2])));
        this.dx[1] = this.dx[1] - 0.08 * this.x[1] / (abs(this.x[1]) + 0.01); //friction, should probably be elaborated on
        this.dx[2] = this.x[3];
        this.dx[3] = 2 * sin(this.x[0] - this.x[2]) * (this.x[1] * this.x[1] * this.l1 * (this.m1 + this.m2) + this.g * (this.m1 + this.m2) * cos(this.x[0]) + this.x[3] * this.x[3] * this.l2 * this.m2 * cos(this.x[0] - this.x[2]));
        this.dx[3] = this.dx[3] / (this.l2 * (2 * this.m1 + this.m2 - this.m2 * cos(2 * this.x[0] - 2 * this.x[2])));
        this.dx[3] = this.dx[3] - 0.1 * this.x[3] / (abs(this.x[3]) + 0.01); //friction
        //euler step
        this.x[0] += h * this.dx[0];
        this.x[1] += h * this.dx[1];
        this.x[2] += h * this.dx[2];
        this.x[3] += h * this.dx[3];
        // console.log(this.x[0]);
        
        this.newposx = this.centerx + s * this.l1 * sin(this.x[0]) + s * this.l2 * sin(this.x[2]);
        this.newposy = this.centery + s * this.l1 * cos(this.x[0]) + s * this.l2 * cos(this.x[2]);
    }
    this.drawP = function () {
        this.endx = pend.centerx + s * this.l1 * sin(this.x[0]);
        this.endy = pend.centery + s * this.l1 * cos(this.x[0]);
        //line(pend.centerx, pend.centery, this.endx, this.endy);
        //line(this.endx, this.endy, this.endx + s * this.l2 * sin(this.x[2]), this.endy + s * this.l2 * cos(this.x[2]));
    }
}