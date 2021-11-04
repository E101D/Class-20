var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud_img;
var obs1, obs2, obs3, obs4, obs5, obs6;
var gameState = "start";
var cactibunch, cloudbunch;
var score, highscore;
var gameOver, reset, gameOver_img, reset_img;
var usernamebutton, aibutton, aioff;
var diesound, checkpoint, jumpsound;
var autoroboton = "off";
var input;
var touches = []

function preload(){
  trex_running = loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_collided = loadImage("trex_collided.png");
  cloud_img = loadImage("cloud.png");
  groundImage = loadImage("ground2.png");
  obs1 = loadImage("obstacle1.png");
  obs2 = loadImage("obstacle2.png");
  obs3 = loadImage("obstacle3.png");
  obs4 = loadImage("obstacle4.png");
  obs5 = loadImage("obstacle5.png");
  obs6 = loadImage("obstacle6.png");
  gameOver_img = loadImage("gameOver.png");
  reset_img = loadImage("restart.png");

  diesound = loadSound("die.mp3");
  checkpoint = loadSound("checkpoint.mp3");
  jumpsound = loadSound("jump.mp3");
}

function setup() {

  createCanvas(windowWidth,windowHeight);
  
  score = 0;
  highscore = 0
  cactibunch = new Group();
  cloudbunch = new Group();

  //create a trex sprite
  trex = createSprite(50,height - 70,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  
  //create a ground sprite
  ground = createSprite(width / 2,height - 50,width,20);
  ground.addImage("ground",groundImage);
  
  //creating invisible ground
  invisibleGround = createSprite(width / 2,height - 40,width,10);
  invisibleGround.visible = false;
  
  gameOver = createSprite(width / 2,height / 2,40,40);
  gameOver.addImage(gameOver_img);
  gameOver.scale = (1.75);

  usernamebutton = createButton("Username");
  usernamebutton.position(50,25);

  aibutton = createButton("Turn on Robot");
  aibutton.position(50,100);

  aioff = createButton("Turn off Robot");
  aioff.position(50,125);

  reset = createSprite(width / 2,height / 2 - 50,40,40);
  reset.addImage(reset_img);
  reset.scale = (0.5);


  //generate random numbers
  var rand =  Math.round(random(1,100))
  console.log(rand)

  trex.debug = true;
  trex.setCollider("rectangle", 0, 25, 60, 60);
}

function draw() {
  //set background color
  background("grey");

  if(gameState === "start"){
    gameOver.visible = false;
    reset.visible = false;
  }
  
  if(touches.length > 0 || keyDown("enter") && gameState === "start"){
    gameState = "play";
    touches = [];
  }

  //if(mousePressedOver(usernamebutton)){
    //input = createInput("")
    //input.position(100,300)
  //}
  if(gameState === "play"){
   handleMousePressed();
   usernamePressed();
   handleMousePressed2();
   
    if(touches.length > 0 || keyDown("space")&& trex.y >= height - 80) {
      trex.velocityY = -12;
      jumpsound.play();
      touches = [];
    }
    trex.velocityY = trex.velocityY + 0.8
    ground.velocityX = -4 - (Math.round(score / 300)) * 3;
    if (ground.x < width / 2 - 100){
      ground.x = ground.width / 2;
    }
 if(score > 500 && score < 1000){
       background("blue");
    }
    else if(score > 1000){
      background("red");
    }

    gameOver.visible = false;
    reset.visible = false;

    //Spawn Clouds, Cacti
    spawnClouds();
    spawnCactus();
    if(frameCount%2 === 0){
      score = score + 5;
    }
    if(highscore <= score){
      highscore = score;
    }
    
    //Button to make AI move the trex
    if(trex.isTouching(cactibunch) && autoroboton === "on"){
      trex.velocityY = -13;
    }
    if(trex.isTouching(cactibunch) && autoroboton === "off"){
      diesound.play();
      gameState = "end";
    }


    if(score% 500 === 0 && score > 0){
      checkpoint.play();
    }
  
  }
  else if(gameState === "end"){
    ground.velocityX = 0;
    cloudbunch.setVelocityXEach(0);
    cactibunch.setVelocityXEach(0);

    cloudbunch.setLifetimeEach(-1);
    cactibunch.setLifetimeEach(-1);

    gameOver.visible = true;
    reset.visible = true;    
    
    trex.velocityY = 0;

    trex.addAnimation("endstate trex", trex_collided);
    trex.changeAnimation("endstate trex");
    if(touches.length > 0 || mousePressedOver(reset)){
      score = 0;
      gameState = "play";
      cactibunch.destroyEach();
      cloudbunch.destroyEach();

      trex.changeAnimation("running");

      touches = [];
    }
  }
  
  
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  textSize(15);
  fill("white");
  text("Score "+ score,width - 150,50);
  textSize(15);
  fill("white");
  text("High Score "+ highscore,width - 150,75);

  drawSprites();
}

//function to spawn the clouds
function spawnClouds(){
if(frameCount%60 === 0){
 cloud = createSprite(width + 20,Math.round(random(30,height - 300)),40,10);
cloud.velocityX=-3;
cloudbunch.add(cloud);
cloud.addImage("cloud", cloud_img);
cloud.depth = trex.depth;
trex.depth = trex.depth + 1;
console.log("trex"+trex.depth);
console.log("cloud"+cloud.depth);
cloud.lifetime = 250;
}
}
function spawnCactus(){
  if(frameCount%100 === 0){
    cactus = createSprite(width + 20,height - 60,40,10);
    cactibunch.add(cactus);
    cactus.velocityX = -5 - Math.round(score / 100);
    var randomNumber = Math.round(random(1,6));
    console.log(randomNumber);
    switch (randomNumber) {
      case 1:
        cactus.addImage(obs1);
        cactus.scale = 0.7;
        break;
      case 2:
        cactus.addImage(obs2);
        cactus.scale = 0.6;
        break;
      case 3:
        cactus.addImage(obs3);
        cactus.scale = 0.55;
        break;
      case 4:
        cactus.addImage(obs4);
        cactus.scale = 0.5;
        break;
      case 5:
        cactus.addImage(obs5);
        cactus.scale = 0.4;
        break;
      case 6:
        cactus.addImage(obs6);
        cactus.scale = 0.4;
        break;
      default:
        break;
    }
    cactus.lifetime = 300;
  }
}
function handleMousePressed(){
  aibutton.mousePressed(()=>{
    autoroboton = "on";
    trex.setCollider("rectangle", 0, 0, 400, 60);
  })
}
function usernamePressed(){
  usernamebutton.mousePressed(()=>{
    input = createInput("");
    input.position(100,300);
  })  
}
function handleMousePressed2(){
  aioff.mousePressed(()=>{
    autoroboton = "off";
    trex.setCollider("rectangle", 0, 0, 60, 60);
  })
}
