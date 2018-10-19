var svg = document.getElementById('svg');
var a1 = document.getElementById('area1');
var a2 = document.getElementById('area2');
var bar = document.getElementById('bar');
var angle = 0;

// takes the height and width of the window/tab displaying the website
var x = window.innerWidth;
var y = window.innerHeight;

// Sets the width and height of the svg to that of the window
svg.setAttribute('width', x.toString());
svg.setAttribute('height', y.toString());

// Setting initial properties
rotateBar(0);

setInterval(function(){
  angle = (angle + 1.5) % 360;
  rotateBar(angle);
}, (1000/60));

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