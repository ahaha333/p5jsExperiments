



// Controls

// fixed variables
var isTouch = false; 
var N;
var w, h;
var lastH;
var dim;

var moan = [];
var meat = [];
var names = [];

var nMoan = 0, nMeat =0;
var lastMoan =0, lastMeat = 0;

var playIcn, muteIcn;
////
// temp. variables

var hue, oldhue, newhue, bkg;
var fadein = 0;
var vol =0;
var soundOn = true; 
var d =0;



function preload(){


 moan[0] = createAudio('sound/stag.mp3');
 moan[1] = createAudio('sound/wolf.mp3');
 moan[2] = createAudio('sound/lion.mp3');
 moan[3] = createAudio('sound/turtle.mp3');
 moan[4] = createAudio('sound/elephant.mp3');
 moan[5] = createAudio('sound/koala.mp3');
 //moan[] = createAudio('sound/.mp3');

 N = moan.length;
 
 for(var i=0; i<N; i++){
    var filename = "images/meat"+i+".png";
    meat[i] = loadImage(filename);

    names[i] = "Cervus elaphus hanglu " + i ;
    
 }
 //console.log(meat);

 playIcn = loadImage("images/icns/play.png");
 muteIcn = loadImage("images/icns/mute.png"); 


 textFont("Schola");


}

function is_touch_device() {
 return (('ontouchstart' in window)
      || (navigator.MaxTouchPoints > 0)
      || (navigator.msMaxTouchPoints > 0));
}

function setup() {
  
  var myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.parent("theCanvas");

  isTouch = is_touch_device();

  console.log(isTouch);
  

  //textStyle(ITALIC);

  // prepare data

  N = moan.length;
  
  w = width/3;
  

  for(var i=0; i<meat.length; i++){
    // resize adds crop here!
    //console.log(meat[i].width);
    //h = meat[i].height* w / meat[i].width;
    //meat[i].resize(w,h); 
    //console.log(w/h);
 }
 
 nMoan = floor(random(100)%N);
 nMeat = floor(random(100)%N);

 h = meat[nMeat].height* w / meat[nMeat].width;
  
 dim= (w+h)/4;
 //dim = sqrt( w*w + h*h)/2;

 colorMode(HSB, 360, 100, 100, 100);
 
 hue = random(120); // hot
 oldhue = hue;
 newhue = hue;
 bkg = color(hue, 90, 100);

 //moan[nMoan].loop();
 /*
 background(bkg);
 image(meat[nMeat], width/2, height/2, w, h);

 fill(0);strokeWeight(0);textSize(20);
 text(names[nMeat], width/2, 0.9*height);
 */
 fill(0);strokeWeight(0);textSize(floor(height/20));
 
 imageMode(CENTER);
 textAlign(CENTER);
  frameRate(10);

   bkg = color(hue, 50, 90);
    background(bkg);
}



function draw() { 

  // background color
  if( hue != newhue){
   
    if(newhue > oldhue){ hue = oldhue++;}
    else{ hue = oldhue--;}
    
    bkg = color(hue, 50, 90);
    background(bkg);
  }

  // meat
  
  if(fadein < 100  && frameCount<100){

    fadein += 1;
    //tint(360,0,100,100-fadein);
    //image(meat[lastMeat], width/2, height/2, w, lastH);
    
  }
  
  tint(255,100,100,fadein);
  image(meat[nMeat], width/2, height/2, w, h);

  noTint();
  text(names[nMeat], width/2, 0.9*height);

  // sound icon

  if(!soundOn){
    image(muteIcn,width - 64, 64-16, 32,32 );
  }
  else{
    image(playIcn,width - 64, 64-16, 32,32 );
    //console.log("now");
  }

  /*
  if(mouseX != pmouseX){
    d = dist(mouseX, mouseY, width/2, height/2);
    
    if(soundOn && d<dim){
      vol = map(d, 0,dim, 1, 0);
    }
    else{
      vol=0;
    }

    //if(!soundOn){vol = 0;}

    //console.log(d + "  " + vol);

    moan[nMoan].volume(vol);
  }
  */

  /*
  background(bkg);
  image(meat[nMeat], width/2, height/2, w, h);

  fill(0).strokeWeight(0).textSize(10);
  text(names[nMeat], width/2, height/2);
  */

}



function touchMoved() {

  d = dist(touchX, touchY, width/2, height/2);
  
  if(soundOn && d<dim){
    if(vol < 0.95){
      vol = (vol+0.05);  // map(d, 0,dim, 1, 0);
    }
  }
  else {
    vol=0;
  }

  //if(!soundOn){vol = 0;}

  //console.log(d + "  " + vol);

  moan[nMoan].volume(vol);

}



function touchEnded() {

if( touchX > width-64-16 && touchY < 64 ){
    soundOn = !soundOn;

    //console.log(soundOn);
  }
  
  lastMoan = nMoan;
  lastMeat = nMeat;
  
  d = dist(touchX, touchY, width/2, height/2);

  oldhue = hue;
  newhue = random(120);
  
  if( d < dim){
 
   nMoan = floor(random(100)%N);
   nMeat = floor(random(100)%N);
   
   // in case they are the same
   if(nMoan == lastMoan){
    nMoan= (lastMoan+1)%N;
   }

   if(nMeat == lastMeat){
    nMeat= (lastMeat+1)%N;
   }

   lastH = h;
   h = meat[nMeat].height* w / meat[nMeat].width;

   moan[lastMoan].stop();
   moan[nMoan].loop();
   
   dim =(w+h)/4;
   //dim = sqrt(w*w + h*h)/2; //diagonal

   fadein = 30;

  }
}

/*
function mouseReleased(){


  if( mouseX > width-64-16 && mouseY < 64 ){
    soundOn = !soundOn;

    console.log(soundOn);
  }
  
  var lastMoan = nMoan;
  var lastMeat = nMeat;
  
  if( d < dim){

   bkg = color(random(360), 50, 90);
    
   nMoan = floor(random(100)%N);
   nMeat = floor(random(100)%N);
   
   // in case they are the same
   if(nMoan == lastMoan){
    nMoan= (lastMoan+1)%N;
   }

   if(nMeat == lastMeat){
    nMeat= (lastMeat+1)%N;
   }

   h = meat[nMeat].height* w / meat[nMeat].width;

   moan[lastMoan].stop();
   moan[nMoan].loop();
   
   dim =(w+h)/4;
   //dim = sqrt(w*w + h*h)/2; //diagonal

  }

  // new Image
  background(bkg);
  image(meat[nMeat], width/2, height/2, w, h);
  text(names[nMeat], width/2, 0.9*height);


}
*/


