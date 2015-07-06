
var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

// This function will return the time in seconds since the function 
// was last called
// You should only call this function once per frame
function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

		// Find the delta time (dt) - the change in time since the last drawFrame
		// We need to modify the delta time to something we can use.
		// We want 1 to represent 1 second, so if the delta is in milliseconds
		// we divide it by 1000 (or multiply by 0.001). This will make our 
		// animations appear at the right speed, though we may need to use
		// some large values to get objects movement and rotation correct
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
		// validate that the delta is within range
	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}

//-------------------- Don't modify anything above here

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;

// some variables to calculate the Frames Per Second (FPS - this tells use
// how fast our game is running, and allows us to make the game run at a 
// constant speed)
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

var STATE_SPLASH = 0;
var STATE_GAME = 1;
var STATE_GAMEOVER = 2;

var gameState = STATE_SPLASH;


var MAP = {tw:40, th:15}; 
// specifies size of the level. (tiles wide  x  tiles high)

var TILE = 35;

var TILESET_TILE = TILE*2;
// The width/height of a tile in the tileset. Because the images are twice as big as 
// the grid in our map we need to be careful (but it allows us a bit more flexibility when designing the level)

var TILESET_PADDING = 2; 
//How many pixels are between the image border and the tile images in the tilemap

var TILESET_SPACING = 2; 
//how many pixels are between tile images in the tilemap

var TILESET_COUNT_X = 14; 
//How many columns of tile images are in the tileset

var TILESET_COUNT_Y = 14; 
//How many rows of tile images are in the tileset

// arbitrary choice for 1m
var METER = TILE;
 // very exaggerated gravity (6x)
var GRAVITY = METER * 9.8 * 6;
 // max horizontal speed (10 tiles per second)
var MAXDX = METER * 10;
 // max vertical speed (15 tiles per second)
var MAXDY = METER * 15;
 // horizontal acceleration - take 1/2 second to reach maxdx
var ACCEL = MAXDX * 2;
 // horizontal friction - take 1/6 second to stop from maxdx
var FRICTION = MAXDX * 6;
 // (a large) instantaneous jump impulse
var JUMP = METER * 1500;

var player = new Player();
var keyboard = new Keyboard();
var enemy = new Enemy();
//var position = new Vector2();
var bullet = new Bullet();


// HUD
var lives = 3;
var score = 0;

var heartImage = document.createElement("img");
heartImage.src = "heartImage.png" 

//var cooldownTimer = 0;
// load an image to draw
//var chuckNorris = document.createElement("img");
//chuckNorris.src = "hero.png";
var enemies = [];
var bullets = [];


var ENEMY_MAXDX = METER * 5;
var ENEMY_ACCEL = ENEMY_MAXDX * 2;


var tileset = document.createElement("img");
tileset.src = "tileset.png";

function cellAtPixelCoord(layer, x, y)
{
	if( x < 0 || x > SCREEN_WIDTH || y < 0 )
		return 1;
	// let the player drop off bottom of scrren this means death to chuck
	if (y > SCREEN_HEIGHT)
		return 0;
	return cellAtTileCoord(layer, p2t(x), p2t(y));
};

function cellAtTileCoord(layer, tx, ty)
{
	if( tx < 0 || tx >= MAP.tw || ty < 0 )
		return 1;
	// lets the player drop off the bottom of the screen also means death to chuck
	if(ty >= MAP.th)
		return 0;
	return cells[layer][ty][tx];
};



function tileToPixel (tile)
{
	return tile * TILE;
};

function pixelToTile (pixel)
{
	return Math.floor(pixel/TILE);
};

function bound(value, min, max)
{
	if(value < min)
		return min;
	if(value > max)
		return max;
	return value;
}

var LAYER_COUNT = 2;
var LAYER_PLATFORMS = 0;
var LAYER_OBJECT_ENEMIES = 1;

var worldOffsetX =0;

function drawMap()
{
 var startX = -1;
 var maxTiles = Math.floor(SCREEN_WIDTH / TILE) + 2;
 var tileX = pixelToTile(player.position.x);
 var offsetX = TILE + Math.floor(player.position.x%TILE);

 startX = tileX - Math.floor(maxTiles / 2);

 if(startX < -1)
 {
 startX = 0;
 offsetX = 0;
 }
 if(startX > MAP.tw - maxTiles)
 {
 startX = MAP.tw - maxTiles + 1;
 offsetX = TILE;
 }
 worldOffsetX = startX * TILE + offsetX;

 for( var layerIdx=0; layerIdx < LAYER_COUNT; layerIdx++ )
 {
 for( var y = 0; y < level2.layers[layerIdx].height; y++ )
 {
 var idx = y * level2.layers[layerIdx].width + startX;
 for( var x = startX; x < startX + maxTiles; x++ )
 {
 if( level2.layers[layerIdx].data[idx] != 0 )
 {
 // the tiles in the Tiled map are base 1 (meaning a value of 0 means no tile),
 // so subtract one from the tileset id to get the correct tile
 var tileIndex = level2.layers[layerIdx].data[idx] - 1;
 var sx = TILESET_PADDING + (tileIndex % TILESET_COUNT_X) *
(TILESET_TILE + TILESET_SPACING);
 var sy = TILESET_PADDING + (Math.floor(tileIndex / TILESET_COUNT_Y)) *
(TILESET_TILE + TILESET_SPACING);
 context.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE,
(x-startX)*TILE - offsetX, (y-1)*TILE, TILESET_TILE, TILESET_TILE);
 }
 idx++;
 }
 }
 }
}

var cells = []; // array that holds a simplified collission data

var musicBackground;
var sfxFire;

function initialize()
{
	for(var layerIdx = 0; layerIdx < LAYER_COUNT; layerIdx++) // initializes the collision map
	{
		cells[layerIdx] = [];
		var idx = 0;
		for(var y = 0; y < level2.layers[layerIdx].height; y++)
		{
			cells[layerIdx][y] = [];
			for(var x = 0; x < level2.layers[layerIdx].width; x++)
			{
				if(level2.layers[layerIdx].data[idx] != 0)
					// for each tile we find in the layer data, we need to create 4 collisions
 					// (because our collision squares are 35x35 but the tile in the
					// level are 70x70)
				{
					cells[layerIdx][y][x] = 1;
					cells[layerIdx][y-1][x] = 1;
					cells[layerIdx][y-1][x+1] = 1;
					cells[layerIdx][y][x+1] = 1;
				}
				else if(cells[layerIdx][y][x] != 1)
					{
						cells[layerIdx][y][x] = 0;
					}
			idx++;
			}
		}
	}		// add enemies
idx = 0;
for(var y = 0; y < level2.layers[LAYER_OBJECT_ENEMIES].height; y++) {
for(var x = 0; x < level2.layers[LAYER_OBJECT_ENEMIES].width; x++) {
if(level2.layers[LAYER_OBJECT_ENEMIES].data[idx] != 0) {
var px = tileToPixel(x);
var py = tileToPixel(y);
var e = new Enemy(px, py);
enemies.push(e);
}
idx++;
}
} 
	
			musicBackground = new Howl(
{
urls: ["background.ogg"],
loop: true,
buffer: true,
volume: 0.5
} );
musicBackground.play();
sfxFire = new Howl(
{
urls: ["fireEffect.ogg"],
buffer: true,
volume: 1,
onend: function() {
isSfxPlaying = false;
}
} );
		}
		function intersects (x1, y1, w1, h1, x2, y2, w2, h2)
{
	if(y2 + h2 < y1 ||
		x2 + w2 < x1 ||
		x2 > x1 + w1 ||
		y2 > y1 + h1)
	{
		return false;
	}
	return true;
}
		
		
		var splashTimer = 3
function runSplash(deltaTime)
{
	var StartGame = document.createElement("img");
	StartGame.src = "StartGame.png";
	context.drawImage(StartGame, 0, 0);

		
	context.fillStyle = "black";
	context.font= "40px Arial";
	
	
	
	splashTimer -= deltaTime
	if(splashTimer <= 0)
	{
		gameState = STATE_GAME;
		return;
	}
}
		
		
function runGame(deltaTime)	
{
	player.update(deltaTime);
	
	for(var i=0; i<enemies.length; i++)
	{
		enemies[i].update(deltaTime);
	}
		drawMap();
	player.draw();
	
	var hit = false;
	for(var i=0; i<bullets.length; i++)
	{
		bullets[i].update(deltaTime);
		if(bullets[i].position.x - worldOffsetX < 0 ||
			bullets[i].position.x - worldOffsetX > SCREEN_WIDTH)
		{
			hit = true;
		}
for(var j=0; j<enemies.length; j++)
		{
			if(intersects(enemies[j].position.x, enemies[j].position.y, TILE, TILE,
				bullets[i].position.x, bullets[i].position.y, TILE, TILE)== true)
			{
				//kill both bullet and enemy
				enemies.splice(j, 1);
				enemies.life -=1;
				hit = true;
				//increment score
				score += 1;
				break;
			}
		}
	

if(hit == true)
		{
			bullets.splice(i, 1);
			break;
		}
	}
	
	for(var j=0; j<enemies.length; j++)
		{
			if(player.isDead == false)
			{
				if(intersects(enemies[j].position.x, enemies[j].position.y, TILE, TILE,
					player.position.x, player.position.y, player.width/2, player.height/2)== true)
				{
				//player.isDead == true;
				lives -= 1;
				player.position.Set(9*35, 0*35);
				break;
				}
			}
		}

	
	for(var i=0; i<enemies.length; i++)
	{
		enemies[i].draw(deltaTime);
	}
	
	for(var i=0; i<bullets.length; i++)
	{
		bullets[i].draw(deltaTime);
	}

	var respawnTimer = 1;
	for(var i=0; i<lives; i++)
	
{
 context.drawImage(heartImage, 20 + ((heartImage.width+2)*i), 10);
}


	if(player.isDead == false)
	{
		if(player.position.y > SCREEN_HEIGHT)
		{
				player.isDead == true;
				lives -= 1;
				player.position.Set(9*35, 0*35);
		}
		if(lives == 0)
		{
			gameState = STATE_GAMEOVER;
			return;
		}
	}	
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
	
		
// score
context.fillStyle = "yellow";
context.font="32px Arial";
var scoreText = "Score: " + score;
context.fillText(scoreText, SCREEN_WIDTH - 170, 35);

}

var endTimer = 5

function runGameOver()
{
	var title = document.createElement("img");
	title.src = "GameOver.png"
context.drawImage(title, (canvas.width/2) - 150, (canvas.height/2) - 200);
	
	context.fillStyle = "red";
	context.font= "50px Arial";
	
}
function run()
{
	context.fillStyle = "#ccc";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	var deltaTime = getDeltaTime();
	
	switch(gameState)
	{
		case STATE_SPLASH:
		runSplash(deltaTime);
		break;
		case STATE_GAME:
		runGame(deltaTime);
		break;
		case STATE_GAMEOVER:
		runGameOver(deltaTime);
		break;
	}
}
	initialize();


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