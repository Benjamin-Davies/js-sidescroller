var player = document.getElementById('player'), jumping = false, score = 0, playing = true;

/**
 * Play jump animation
 */
function jump() {
  if (!jumping && playing) {
    player.style.animationPlayState = 'running';
    jumping = true;
    // reset when done
    setTimeout(function () {
      player.style.animationPlayState = 'paused';
      jumping = false;
    }, 1000);
  }
}

// Input for jump
document.addEventListener('keydown', function (e) {
  if (e.key == ' ') {
    jump();
  }
});
document.addEventListener('touchstart', jump);

/**
 * Add one to the score and update all score elements
 */
function updateScore() {
  score++;
  var scoreElements = document.getElementsByClassName('score');
  for (var i = 0; i < scoreElements.length; i++) {
    var element = scoreElements[i];
    element.innerHTML = score;
  }
}

/**
 * Spawn an obstacle and wait to spawn the next
 */
function spawnObstacle() {
  if (!playing) return;
  var obstacle = document.createElement('div');
  obstacle.className = 'obstacle';
  obstacle.creationTime = performance.now();
  document.getElementsByTagName('body')[0].appendChild(obstacle);
  setTimeout(function () {
    document.getElementsByTagName('body')[0].removeChild(obstacle);
    if (playing)
      updateScore();
  }, 2000);

  setTimeout(spawnObstacle, Math.random() * 500 + 1000)
}

/**
 * Gets the x co-ordinate of an obstacle
 * @param {Obstacle} obstacle The obstacle to inspect
 */
function getObstacleX(obstacle) {
  var t = performance.now() - obstacle.creationTime;
  return 90 - t / 20;
}

/**
 * Check for a collision with the obstacle
 */
function checkForCollision(obstacle) {
  return getObstacleX(obstacle) < 10;
}

/**
 * Checks for a collision with any obstacle
 */
function checkForCollisions() {
  if (jumping)
    return false;
  var obstacles = document.getElementsByClassName('obstacle');
  for (var i = 0; i < obstacles.length; i++) {
    var obstacle = obstacles[i];
    if (checkForCollision(obstacle))
      return true;
  }
  return false;
}

/**
 * Drop the curtains
 */
function dropCurtains() {
  document.getElementsByClassName('curtain')[0].style.animationPlayState = 'running';
}

/**
 * Update as often as we can
 */
function update() {
  requestAnimationFrame(update);
  if (!jumping)
      player.style.bottom = '10vh';
  if (checkForCollisions() && playing) {
    dropCurtains();
    playing = false;
  }
}

update();

spawnObstacle();
