class Sprite {
  //responsible for rendering out images
  constructor({ position, imageSource, scale = 1, framesMax = 1 }) {
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
  }
  draw() {
    context.drawImage(
      this.image,
      this.currentFrame * (this.image.width / this.framesMax),
      //substracting the -1 from the default framesMax, because the background was flickering
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x,
      this.position.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    ); //need to use a canvas function within the draw method
    //first argument is an HTML image element
    //second argument we add an x coordinate, thisrd is an y coordinate
  }
  update() {
    this.draw(); //referencing/calling the draw method
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
}
class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = "red",
    offset,
    imageSource,
    scale = 1,
    framesMax = 1,
  }) {
    super({
      position,
      image,
      scale,
      framesMax,
      currentFrame,
      elapsedFrames,
      holdFrames,
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
  }

  update() {
    this.draw(); //referencing/calling the draw method
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x; //we want this box to
    //always follow the players around
    this.attackBox.position.y = this.position.y;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y; //for the position on the y axis, we're adding on our y velocity
    //for each frame in the loop
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 93) {
      //we make refference to the bottom of the fighter rectangle
      this.velocity.y = 0; //stop our player to move downwards and get off the canvas
    } else {
      this.velocity.y += gravity; //if the players are above canvas height, they don't go off screen
      //as long as our player is above canvas bottom, we're going to pull him down - useful for jumps
      //by altering our player's y velocity
    }
  }
  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100); //activate it for a certain period of time
  }
}
