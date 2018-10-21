var svg = document.getElementById('svg');
var a1 = document.getElementById('area1');
var a2 = document.getElementById('area2');
var bar = document.getElementById('bar');
var square = document.getElementById('square');
var game = document.getElementById('game');
var start = document.getElementById('start');
var startbtn = document.getElementById('startbtn');
var gameover = document.getElementById('gameover');
var scoreEl = document.getElementById('score');
var reset = document.getElementById('reset');
var timeEl = document.getElementById('time');
var scoreNotification = document.getElementById('scoreNotification');
var scoreTracker = document.getElementById('scoreTracker');
var timeLeft = 45;
var angle = 0;
var turn = 1;
var score = 0;
var ro = Math.round;
var ra = Math.random;
var x = window.innerWidth;
var y = window.innerHeight;
var notificationTimeout = null;

game.style.display = 'none';
gameover.style.display = 'none';
startbtn.onclick = function() { startGame(); };
reset.onclick = function() {
  timeLeft = 45;
  rc1 = [7, 117, 213];
  rc2 = [254, 174, 35];
  previousA1Color = rc1;
  currentA1Color = rc1;
  futureA1Color = randomRGB();
  previousA2Color = rc2;  
  currentA2Color = rc2;
  futureA2Color = randomRGB();
  angle = 0;
  turn = 1;
  score = 0;
  game.style.display = 'none';
  gameover.style.display = 'none';
  start.style.display = 'block';
}

// Sets the width and height of the svg to that of the window
svg.setAttribute('width', x.toString());
svg.setAttribute('height', y.toString());

var rc1 = [7, 117, 213];
var rc2 = [254, 174, 35];
var previousA1Color = rc1;
var currentA1Color = rc1;
var futureA1Color = randomRGB();
var previousA2Color = rc2;  
var currentA2Color = rc2;
var futureA2Color = randomRGB();

function startGame() {
  // Setting initial properties
  game.style.display = 'block';
  start.style.display = 'none';
  timeEl.innerHTML = timeLeft.toString();
  scoreTracker.innerHTML = 'Score: ' + score.toString();
  rotateBar(0);
  square.addEventListener('click', squareClicked);
  square.setAttribute('x', ra() * (x - 110) + 30);
  square.setAttribute('y', ra() * (y - 110) + 30);
  setRGB(rc1, a1);
  setRGB(rc2, a2);
  setRGB(gsrgb(rc1),square);

  var intervalGame = setInterval(function(){
    angle = (angle + 1.5) % 360;
    rotateBar(angle);
    changeColor();
  }, (1000/60));

  var intervalColor = setInterval(function(){
    previousA1Color = futureA1Color;
    futureA1Color = randomRGB();
    previousA2Color = futureA2Color;
    futureA2Color = randomRGB();
  }, 5000);

  var intervalTime = setInterval(function(){
    timeLeft--;
    timeEl.innerHTML = timeLeft.toString();
  }, 1000);

  setTimeout(function() {
    gameover.style.display = 'block';
    scoreEl.innerHTML = score.toString() + ' points';
    game.style.display = 'none';
    clearInterval(intervalGame);
    clearInterval(intervalColor);
    clearInterval(intervalTime);
  }, 45000);

}

// function: converts points to string
function cpts(a,b,c,d) {
  return a.toString() + ' ' + b.toString() + ' ' + c.toString() + ' ' + d.toString();
}

function rotateBar(angle) {
  var a = [];
  if((0 <= angle) && (angle <= 90)) {
    var d = angle / 90;
    a[0] = [x, y];
    a[1] = [0, y];
    a[2] = [0, d * y];
    a[3] = [x, (1 - d) * y];
    a[4] = [x, 0];
    a[5] = [0, 0];
  } else if ((90 < angle) && (angle <= 180)) {
    var d = (angle - 90) / 90;
    a[0] = [x, 0];
    a[1] = [x, y];
    a[2] = [d * x, y];
    a[3] = [(1 - d) * x, 0];
    a[4] = [0, 0];
    a[5] = [0, y];
  } else if ((180 < angle) && (angle <= 270)) {
    var d = (angle - 180) / 90;
    a[0] = [0, 0];
    a[1] = [x, 0];
    a[2] = [x, (1 - d) * y];
    a[3] = [0, d * y];
    a[4] = [0, y];
    a[5] = [x, y];
  } else {
    var d = (angle - 270) / 90;
    a[0] = [0, y];
    a[1] = [0, 0];
    a[2] = [(1 - d) * x, 0];
    a[3] = [d * x, y];
    a[4] = [x, y];
    a[5] = [x, 0];
  }
  setPoints(a);
  setBarPoints(a[2], a[3]);
}

function setPoints(arr) {
  a1.setAttribute('points', cpts(arr[0], arr[1], arr[2], arr[3]));
  a2.setAttribute('points', cpts(arr[4], arr[5], arr[2], arr[3]));
}

function setBarPoints(a, b) {
  bar.setAttribute('x1', a[0]);
  bar.setAttribute('y1', a[1]);
  bar.setAttribute('x2', b[0]);
  bar.setAttribute('y2', b[1]);
}

function squareClicked() {
  scoreNotification.style.opacity = 1;
  clearTimeout(notificationTimeout);
  notificationTimeout = setTimeout(function(){scoreNotification.style.opacity = 0;},500);
  score++;
  scoreTracker.innerHTML = 'Score: ' + score.toString();
  square.setAttribute('x', ra() * (x - 110) + 30);
  square.setAttribute('y', ra() * (y - 110) + 30);
  // svg elements are shuffled, that way the square shifts sides
  if(turn === 1) {
    svg.removeChild(a1);
    svg.removeChild(square);
    svg.appendChild(square);
    svg.appendChild(a1)
    svg.removeChild(bar);
    svg.appendChild(bar);
    setRGB(gsrgb(currentA2Color),square);
    turn = 2;
  } else {
    svg.removeChild(a2);
    svg.removeChild(square);
    svg.appendChild(square);
    svg.appendChild(a2)
    svg.removeChild(bar);
    svg.appendChild(bar);
    setRGB(gsrgb(currentA1Color),square);
    turn = 1;
  }
}

function randomRGB() {
  return [ro((ra() * 230) + 20), ro((ra() * 230) + 20), ro((ra() * 230) + 20)];
}

function setRGB(arr, el) {
  el.style.fill = 'rgb(' + arr.toString() + ')';
}

function gsrgb(arr){
  var rgb = [];
  if(arr[0] > 220) {
    rgb[0] = 255;
  } else {
    rgb[0] = arr[0] + 25;
  }
  rgb[1] = arr[1] - 20;
  if(arr[2] > 220) {
    rgb[2] = 255;
  } else {
    rgb[2] = arr[2] + 25;
  }
  return rgb;
}

function changeColor() {
  var a1r = previousA1Color[0], a1g = previousA1Color[1], a1b = previousA1Color[2];
  var fa1r = futureA1Color[0], fa1g = futureA1Color[1], fa1b = futureA1Color[2];
  var da1r = (fa1r - a1r)/300, da1g = (fa1g - a1g)/300, da1b = (fa1b - a1b)/300;
  currentA1Color[0] += da1r;
  currentA1Color[1] += da1g;
  currentA1Color[2] += da1b;
  setRGB(currentA1Color, a1);

  var a2r = previousA2Color[0], a2g = previousA2Color[1], a2b = previousA2Color[2];
  var fa2r = futureA2Color[0], fa2g = futureA2Color[1], fa2b = futureA2Color[2];
  var da2r = (fa2r - a2r)/300, da2g = (fa2g - a2g)/300, da2b = (fa2b - a2b)/300;
  currentA2Color[0] += da2r;
  currentA2Color[1] += da2g;
  currentA2Color[2] += da2b;
  setRGB(currentA2Color, a2);
}