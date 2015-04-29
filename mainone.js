var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");


var startFrameMillis = Date.now();
var endFrameMillis = Date.now();


function getDeltaTime() //only call function once per frame

{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();
	
	var deltaTime = (startFrameMillis - endFrameMillis)*0.001;
	if (deltaTime > 1) //validate that delta is within range
	{
		deltaTime = 1;
		
	}
	return deltaTime;
}

//-------------------- Don't modify anything above here

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;

//-------------------- Don't modify anything above here
var player = new Player();
var keyboard = new Keyboard();

// some variables to calculate the Frames Per Second (FPS - this tells use
// how fast our game is running, and allows us to make the game run at a 
// constant speed)
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

// load an image to draw
var player = document.createElement("img");
player.src = "hero.png";


function run()
{
context.fillStyle = "#ccc";
context.fillRect(0, 0, canvas.width, canvas.height);

context.drawImage(player, SCREEN_WIDTH/2 - player.width/2, SCREEN_HEIGHT/2 - player.height/2);

var deltaTime = getDeltaTime();


// update the frame counter
fpsTime += deltaTime;
fpsCount++;
if(fpsTime >= 1)
	
{
fpsTime -= 1;
fps = fpsCount;
fpsCount = 0;
}

// draw the FPS
context.fillStyle = "#f00";
context.font="14px Arial";
context.fillText("FPS: " + fps, 5, 20, 100);
}



//-------------------- Don't modify anything below here


// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);
















