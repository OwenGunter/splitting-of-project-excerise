var vector2 = function()
{
	this.x = 0;
	this.y = 0;
}

// arg == argument
vector2.prototype.Set = function(arg_x, arg_y)
{
	this.x = arg_x;
	this.y = arg_y;
}

// addition
vector2.prototype.add = function(vector2, arg_other)
{
	this.x = this.x + x;
	this.y = this.y + y;
}

// subtraction
vector2.prototype.sub = function(vector2, arg_other)
{
	this.x = this.x - x;
	this.y = this.y - y;
}

// collision checker (obviously)
vector2.prototype.CheckCollision = function(vector2, arg_other)
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
vector2.prototype.Magnitude = function()
{
	return Math.sqrt((x*x) + (y*y));

}

// normalise the vector
vector2.prototype.Normalized = function()
{
	this.ret = new vector2()
	ret.x = this.x / this.Magnitude();
	ret.y = this.y / this.Magnitude();
	return ret;
}

vec2 = new vector2();
vec2.Set(5,4)