const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;

const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope,fruit,ground;
var fruit_con,fruit_con_2;


var bg_img,food,rabbit,button,bunny;
var blink,eat,sad

//Declare variable for blower & mutebutton
var blower,mutebutton;

var fr,rope2;

//Declare variables for loading sound sad,cut,eating,airblowing,background
var sadSound,cuttingSound,eatingSound,airblowingSound,backgroundSound

function preload()
{
  bg_img = loadImage('background.png');
  food = loadImage('melon.png');
  rabbit = loadImage('Rabbit-01.png');

  //load all sounds
  sadSound= loadSound("sad.wav");
  cuttingSound=loadSound("rope_cut.mp3");
  eatingSound=loadSound("eating_sound.mp3");
  airblowingSound=loadSound("air.wav");
  backgroundSound=loadSound("sound1.mp3")
  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  eat = loadAnimation("eat_0.png" , "eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");
  
  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping= false;
  eat.looping = false; 
}

function setup() 
{
  createCanvas(500,700);
 
  frameRate(80);
  //Add background sound & setvolume to it
  backgroundSound.play();
  backgroundSound.setVolume(0.5);
  engine = Engine.create();
  world = engine.world;
  
  button = createImg('cut_btn.png');
  button.position(220,30);
  button.size(50,50);
  button.mouseClicked(drop);

  //Write code to add ballong image and call function airblow
  blower=createImg('balloon.png');
  blower.position(10,250);
  blower.size(70,70);
  blower.mouseClicked(airblow)

  //write code to add mute image and call function mute
  mutebutton=createImg('mute.png');
  mutebutton.position(450,20);
  mutebutton.size(50,50);
  mutebutton.mouseClicked(mute);
  
  rope = new Rope(7,{x:245,y:30});
  ground = new Ground(200,690,600,20);

  blink.frameDelay = 20;
  eat.frameDelay = 20;

  bunny = createSprite(390,620,100,100);
  bunny.scale = 0.2;

  bunny.addAnimation('blinking',blink);
  bunny.addAnimation('eating',eat);
  bunny.addAnimation('crying',sad);
  bunny.changeAnimation('blinking');
  
  fruit = Bodies.circle(300,300,20);
  Matter.Composite.add(rope.body,fruit);

  fruit_con = new Link(rope,fruit);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
  
}

function draw() 
{
  background(51);
  image(bg_img,0,0,490,690);

  push();
  imageMode(CENTER);
  if(fruit!=null)
  {
    image(food,fruit.position.x,fruit.position.y,70,70);
  }
  pop();

  rope.show();
  Engine.update(engine);
  ground.show();

  drawSprites();

  if(collide(fruit,bunny)==true)
  {
    bunny.changeAnimation('eating');
    //Add eating sound
    eatingSound.play();
  }

  //Write code to check the collision of fruit between the bunny and the ground
  if(fruit!=null&&fruit.position.y>=650)
  {
    bunny.changeAnimation('crying');
    backgroundSound.stop();
    sadSound.play();
    fruit=null;
  }
   
}

function drop()
{
  //Add cut sound
  
  rope.break();
  fruit_con.detach();
  fruit_con = null; 
}

function keyPressed()
{
  if(keyCode==LEFT_ARROW)
  {
    airblow();
  }
}

function collide(body,sprite)
{
  if(body!=null)
  {
    var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
    if(d<=80)
    {
      World.remove(engine.world,fruit);
      fruit = null;
      return true; 
    }
    else{
      return false;
    }
  }
}

//Declare function airblow
function airblow()
{
  Matter.Body.applyForce(fruit,{x:0,y:0},{x:0.01,y:0});
  airblowingSound.play();
}

//Declare function mute
function mute(){
  if(backgroundSound.isPlaying()){
    backgroundSound.stop();
  }
  else{
    backgroundSound.play();
  }
}

