class Sprite {
  //responsible for rendering out images
  constructor({
    position,
    imageSource,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image(); //native API object - creates an HTML image but within a JS property
    this.image.src = imageSource; //store the image within the property
    this.scale = scale;
    this.framesMax = framesMax; //maximum amount of frames that we have in our image;
    this.currentFrame = 0;
    this.elapsedFrames = 0; //how many frames have we currently elapsed over throughout our animation
    this.holdFrames = 5; //how many frames should we actually go through before we change currentFrames
    //the actual animation
    this.offset = offset;
  }
  draw() {
    context.drawImage(
      this.image,
      this.currentFrame * (this.image.width / this.framesMax),
      //substracting the -1 from the default framesMax, because the background was flickering
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    ); //need to use a canvas function within the draw method
    //first argument is an HTML image element
    //second argument we add an x coordinate, thisrd is an y coordinate
  }
  animateFrames() {
    this.elapsedFrames++;
    if (this.elapsedFrames % this.holdFrames === 0) {
      //take elapsedFrames, divide it by holdFrames
      //and if the remeinder is 0, then we want to call the following code
      if (this.currentFrame < this.framesMax - 1) {
        this.currentFrame++;
      } else {
        this.currentFrame = 0;
      }
    }
  }

  update() {
    this.draw(); //referencing/calling the draw method
    this.animateFrames();
  }
}
class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = "red",
    imageSource,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
  }) {
    super({
      position,
      imageSource,
      scale,
      framesMax,
      offset,
    });
    //wrap it as an object so that we pass only though one argument, the order doesn't matter anymore

    this.velocity = velocity; //velocity is going to determine in which direction should the objects
    //be moving when inside of an animation loop
    this.width = 50; //needed for claculating collision between end of boxes
    this.height = 150;
    this.lastKey; //counter for keeping track which last key was pressed
    //needed becasue if I was pressing a before d, d was not working, it was following just the
    //if branch
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 100,
      height: 50,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
    this.currentFrame = 0;
    this.elapsedFrames = 0;
    this.holdFrames = 5;
    this.sprites = sprites;
    //loop through each object within the object of sprites (idle, run) ->
    //create an image property dynamically that is going to be equal to a new image object
    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image(); //[sprite] - reference which object I want to grab - like run or idle (object key)
      sprites[sprite].image.src = sprites[sprite].imageSource;
    }
  }

  update() {
    this.draw(); //referencing/calling the draw method
    this.animateFrames();

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x; //we want this box to
    //always follow the players around
    this.attackBox.position.y = this.position.y;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y; //for the position on the y axis, we're adding on our y velocity
    //for each frame in the loop

    //& gravity function
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 93) {
      //we make refference to the bottom of the fighter rectangle
      this.velocity.y = 0; //stop our player to move downwards and get off the canvas
      // this.position.y = 330; //fix the position to be in exact location in which it can no longer move
    } else this.velocity.y += gravity; //if the players are above canvas height, they don't go off screen
    //as long as our player is above canvas bottom, we're going to pull him down - useful for jumps
    //by altering our player's y velocity
  }
  attack() {
    this.switchSprite("attack1");
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100); //activate it for a certain period of time
  }
  switchSprite(sprite) {
    if (
      this.image === this.sprites.attack1.image &&
      this.currentFrame < this.sprites.attack1.framesMax - 1
    )
      return;
    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.currentFrame = 0; //when you switch between sprites before they reach the max frames, so they know to restart from 0
        } //default value of image
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.currentFrame = 0;
        } //when you hit a key you switch between key values (idle to run)
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.currentFrame = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.currentFrame = 0;
        }
        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;
          this.currentFrame = 0;
        }
        break;
    }
  }
}
