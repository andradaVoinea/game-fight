//function to detect collision
function boxCollision({ box1, box2 }) {
  return (
    box1.attackBox.position.x + box1.attackBox.width >= box2.position.x &&
    box1.attackBox.position.x <= box2.position.x + box2.width &&
    box1.attackBox.position.y + box1.attackBox.height >= box2.position.y &&
    box1.attackBox.position.y <= box2.position.y + box2.height
  );
}
//function for setting the winner
function setWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.querySelector("#displayText").style.display = "flex";
  if (player.health === enemy.health) {
    document.querySelector("#displayText").innerHTML = "Tie";
  } else if (player.health > enemy.health) {
    document.querySelector("#displayText").innerHTML = "Player Wins";
  } else if (player.health < enemy.health) {
    document.querySelector("#displayText").innerHTML = "Enemy Wins";
  }
}
//function for decreasing time
let timer = 60;
let timerId; //to stop the timer if either players win
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000); //for each time we call setTimeout() this is going to
    //return a number that's going to increase over time
    //can be used to cancel our loop to make sure we're no longer calling decreased timer
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }
  if (timer === 0) {
    // if (player.health === enemy.health) {
    //   document.querySelector("#displayText").innerHTML = "Tie";
    // } else if (player.health > enemy.health) {
    //   document.querySelector("#displayText").innerHTML = "Player Wins";
    // } else if (player.health < enemy.health) {
    //   document.querySelector("#displayText").innerHTML = "Enemy Wins";
    // }
    setWinner({ player, enemy, timerId });
  }
}
