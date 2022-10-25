//*Project setup
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

context.fillRect(0, 0, canvas.width, canvas.height);
//fillRect method makes a rectangular shape and takes 4 arguments: x position, y, canvas width and height

//*create player and enemy using OOP because I want the players to interract with eachother
//and have their own individual properties that act independently from eachother
const gravity = 0.7; //acceleration on our y velocity; as long as the object is up in the air
//we're going to keep adding a value onto this velocity untill it hits the ground
//if we increase the velocity, the faster it's going to get , the longer it falls
//gravity - to make objects drop to the bottom of screen and stop once they hit it

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSource: "./images/background.png",
});
const player = new Fighter({
  position: {
    //create a new object for the Sprite class, we give an object as argument for position
    x: 50,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSource: "./images/Samurai/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: { x: 215, y: 145 },
  sprites: {
    idle: { imageSource: "./images/Samurai/Idle.png", framesMax: 8 },
    run: { imageSource: "./images/Samurai/Run.png", framesMax: 8 },
    jump: { imageSource: "./images/Samurai/Jump.png", framesMax: 2 },
    fall: { imageSource: "./images/Samurai/Fall.png", framesMax: 2 },
    attack1: { imageSource: "./images/Samurai/Attack1.png", framesMax: 6 },
    takeHit: {
      imageSource: "./images/Samurai/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: { imageSource: "./images/Samurai/Death.png", framesMax: 6 },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },
});
const enemy = new Fighter({
  position: {
    //create a new object for the Sprite class, we give an object as argument for position
    x: 900,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
  imageSource: "./images/Bushi/Idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: { x: 215, y: 160 },
  sprites: {
    idle: { imageSource: "./images/Bushi/Idle.png", framesMax: 4 },
    run: { imageSource: "./images/Bushi/Run.png", framesMax: 8 },
    jump: { imageSource: "./images/Bushi/Jump.png", framesMax: 2 },
    fall: { imageSource: "./images/Bushi/Fall.png", framesMax: 2 },
    attack1: { imageSource: "./images/Bushi/Attack1.png", framesMax: 4 },
    takeHit: { imageSource: "./images/Bushi/Take hit.png", framesMax: 3 },
    death: { imageSource: "./images/Bushi/Death.png", framesMax: 7 },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 170,
    height: 50,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};

decreaseTimer();
//create animation loop to make objects move
function animate() {
  window.requestAnimationFrame(animate); //says what function I want to loop repeatedly
  //animate is a callback function now, animate will be called over and over again untill we tell it to stop
  //begin animating the objects frame by frame
  context.fillStyle = "black"; //we set the fillstyle of the bakgound to black, so that we differentiate with the red style of the fighters
  context.fillRect(0, 0, canvas.width, canvas.height);
  //clear canvas for each frame we're looping over, so that we have the impression of movement, no painting brush
  background.update();
  player.update();
  enemy.update();
  player.velocity.x = 0; //default value for our player's x velocity, so after keys are lifted,
  // the player would stop
  enemy.velocity.x = 0;

  //& player movement

  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5; //movement of 5 pixels per frame
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }
  //for each key of animation we're going to listen for weather one of our keys is pressed down
  //had a problem before, when I had a and d pressed, but lifted just one of them, the player would stop
  //because at the eventListener I used 1 and 0 to stop or continue moving, so I changed it to
  //true or false
  //& jumping
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  //& enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  //& jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  //& detect for collision & enemy gets hit
  if (
    boxCollision({
      box1: player,
      box2: enemy,
    }) &&
    player.isAttacking &&
    player.currentFrame === 4
    //player.attackBox.position.y (top of our fighter) + player.attackBox.height = bottom of our fighter
  ) {
    enemy.takeHit();
    player.isAttacking = false; // to substract the accurate amount of health form our enemy. it only pressed spacebar once

    document.querySelector("#enemyStatus").style.width = enemy.health + "%";
  }

  //& if player misses
  if (player.isAttacking && player.currentFrame === 4) {
    player.isAttacking = false;
  }

  //& where the player gets hit
  if (
    boxCollision({
      box1: enemy,
      box2: player,
    }) &&
    enemy.isAttacking &&
    player.currentFrame === 2 //when the frame with the sword is activated
  ) {
    player.takeHit();
    enemy.isAttacking = false;
    document.querySelector("#playerStatus").style.width = player.health + "%";
  }

  //& if enemy misses
  if (enemy.isAttacking && enemy.currentFrame === 2) {
    enemy.isAttacking = false;
  }

  //& end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    setWinner({ player, enemy, timerId });
  }
}
animate();
//*move characters with event listeners
window.addEventListener("keydown", (event) => {
  //   console.log(event.key); // to look for the key property we're interested into
  if (!player.dead) {
    switch (event.key) {
      case "d":
        keys.d.pressed = true; //moving one pixel for every frame we loop over within our animation loop
        player.lastKey = "d"; //monitor which key we pressed last
        break;
      case "a":
        keys.a.pressed = true; //moving backward one pixel for every frame we loop overthe x axis
        player.lastKey = "a";
        break;
      case "w": //adding jump effect
        player.velocity.y = -20;
        break;
      case " ": //in case we hit spacebar
        player.attack(); //call the attack method in class Fighter
        break;
    }
  }
  if (!enemy.dead) {
    switch (event.key) {
      //setting enemy keys
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight"; //so that we don't alter the property of the main fighter
        //we made lastKey a property of the class object Fighter
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        enemy.velocity.y = -20;
        break;
      case "ArrowDown":
        enemy.attack();
        break;
    }
  }
});
window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false; //stop moving on the x axis when you lift finger form key
      break;
    case "a":
      keys.a.pressed = false; //stop moving when we lift of the a key
      break;
    case "w":
      keys.w.pressed = false;
      break;

    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;
  }
});

//* attacks for both players
//draw a rectagular shape which is going to represent the movement of fight(punch/sword swing)
//monitor for collision between this rectangle shape and our players
//if the rectangle toughrs the enemy, we're going to consider it a hit and substract health from player
//* health bar

//* game timer and game over
