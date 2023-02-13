var c = document.getElementById("c");
var _ = c.getContext("2d");
var h1 = document.querySelector("h1");
var RAD = Math.PI / 180;
var speed = 3;
var setCanvasSize = function () {
  c.width = window.innerWidth;
  c.height = window.innerHeight;
};
var randHeart = function () {
  return ["❤", "♥"][Math.floor(Math.random() * 2)];
};
class Sprite {
  constructor(x, y, rot) {
    this.x = x || Math.random() * c.width;
    this.y = y || Math.random() * c.height;
    this.rot = rot || 0;
    this.c = "rgba(238,85,85,1)";
    this.text = randHeart();
  }
}
var items = [new Sprite()];
var shape = function (x, y, text, c) {
  _.font = "5em Arial";
  _.fillStyle = c;
  _.fillText(text, x, y);
};
var clear = function () {
  _.clearRect(0, 0, c.width, c.height);
};
var listen = function () {
  window.onresize = function () {
    setCanvasSize();
  };
  window.onmousedown = function (e) {
    items.push(new Sprite(e.x, e.y));
  };
  var alpha = 0.1;
  h1.onclick = function (e) {
    document.querySelector("p").style.display = "none";
    h1.style.color = "rgba(238,85,85," + alpha + ")";
    document.body.style.backgroundColor = "rgba(238,85,85," + alpha + ")";
    if (alpha <= 0.3) {
      alpha += 0.02;
    } else {
      h1.style.color = "rgb(247,164,164)";
    }
    return false;
  };
};
var setup = function () {
  setCanvasSize();
  listen();
};
setup();
var render = function () {
  clear();
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    shape(item.x, item.y, item.text, item.c);
    item.x += Math.cos(Math.round(Math.random() * item.rot) / RAD) * speed;
    item.y += Math.sin(Math.round(Math.random() * item.rot) / RAD) * speed;
    item.rot += speed;
    if (item.y >= c.height || item.y <= 0) item.y = -item.y;
    if (item.x >= c.width || item.x <= 0) item.x = -item.x;
  }
};
window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();
(function animloop() {
  requestAnimFrame(animloop);
  render();
})();
