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
 
var LAYER_COUNT = 2;
var MAP = {tw: 20, th: 15};
var TILE = 35;
var TILESET_TILE = TILE * 2;
var TILESET_PADDING = 2;
var TILESET_SPACING = 2;
var TILESET_COUNT_X = 14;
var TILESET_COUNT_Y = 14;
 
// load the image to use for the level tiles
var tileset = document.createElement("img");
tileset.src = "tileset.png";
 
function drawMap()
{
 for(var layerIdx=0; layerIdx<LAYER_COUNT; layerIdx++)
 {
 var idx = 0;
 for( var y = 0; y < level1.layers[layerIdx].height; y++ )
 {
 for( var x = 0; x < level1.layers[layerIdx].width; x++ )
 {
 if( level1.layers[layerIdx].data[idx] != 0 )
 {
 // the tiles in the Tiled map are base 1 (meaning a value of 0 means no tile), so subtract one from the tileset id to get the
 // correct tile
 var tileIndex = level1.layers[layerIdx].data[idx] - 1;
 var sx = TILESET_PADDING + (tileIndex % TILESET_COUNT_X) * (TILESET_TILE + TILESET_SPACING);
 var sy = TILESET_PADDING + (Math.floor(tileIndex / TILESET_COUNT_Y)) * (TILESET_TILE + TILESET_SPACING);
 context.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE, x*TILE, (y-1)*TILE, TILESET_TILE, TILESET_TILE);
 }
 idx++;
 }
 }
 }
}
       
function run()
{
        drawMap()
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





