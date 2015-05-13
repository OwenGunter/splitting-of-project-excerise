
var Vector2 = function()
{
	this.x = 0;
	this.y = 0;
}

// arg == argument
Vector2.prototype.Set = function(arg_x, arg_y)
{
	this.x = arg_x;
	this.y = arg_y;
}

// addition
Vector2.prototype.add = function(Vector2, arg_other)
{
	this.x = this.x + x;
	this.y = this.y + y;
}

// subtraction
Vector2.prototype.sub = function(Vector2, arg_other)
{
	this.x = this.x - x;
	this.y = this.y - y;
}

// collision checker (obviously)
Vector2.prototype.CheckCollision = function(vector2, arg_other)
{
	if(Player.x + Player.width < this.x ||
		Player.y + Player.height < this.y ||
		Player.x > this.x + this.width ||
		Player.y > this.y + this.height)
	{
		return false;
	}
	return true;
}

// Magnitude
Vector2.prototype.Magnitude = function()
{
	return Math.sqrt((x*x) + (y*y));

}

// normalise the vector
Vector2.prototype.Normalized = function()
{
	this.ret = new vector2()
	ret.x = this.x / this.Magnitude();
	ret.y = this.y / this.Magnitude();
	return ret;
}

vec2 = new Vector2();
vec2.Set(5,4)