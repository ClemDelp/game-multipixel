var exports = module.exports = function(){
	this.x = 0
	this.y = 0
	this.id = 0
	this.el = ""
	this.bot_size = 20
	this.map = []
	this.orientation = "down"
	this.bob_updated = {}
	this.map = []
	this.color = "green"
	this.deplacement = ["down","right","up","left"]
	this.type = "bot"
	this.init = function(json){
		this.bot_size = json.cell_size
		this.id = json.id
		this.map = json.map
		this.x = json.x
		this.y = json.y
		this.bob_updated = json.bob_updated
		return this
	}
	// ------------------------------------------------
	this.move = function(){
		var _this = this
		var order = this.deplacement.indexOf(this.orientation)
		setInterval(function(){
			var sens = _this.orientation
			var i = 0
			while(!_this[sens]()){
				order = Math.round(Math.random()*3)
				sens = _this.deplacement[order]
				i++
				if(i>4) break;
			}

		},1000)
		return this
	}
	// ------------------------------------------------
	this.down = function(){
		var x = this.x
		var y = this.y
		if((y+1<this.map.rows)&&(this.map.matrix[y+1][x] == 0)){
			// vers le sud
			this.orientation = "down"
			this.y++
			this.bob_updated.dispatch(this.getModel())
			return true
		}else{
			return false
		}
	}
	this.right = function(){
		var x = this.x
		var y = this.y
		if((x+1<this.map.cols)&&(this.map.matrix[y][x+1] == 0)){
			// vers l'est
			this.orientation = "right"
			this.x++
			this.bob_updated.dispatch(this.getModel())

			return true
		}else{
			return false
		}
	}
	this.up = function(){
		var x = this.x
		var y = this.y
		if((y-1>0)&&(this.map.matrix[y-1][x] == 0)){
			// vers le nord
			this.orientation = "up"
			this.y--
			this.bob_updated.dispatch(this.getModel())
			return true
		}else{
			return false
		}
	}
	this.left = function(){
		var x = this.x
		var y = this.y
		if((x-1>0)&&(this.map.matrix[y][x-1] == 0)){
			// vers l'ouest
			this.orientation = "left"
			this.x--
			this.bob_updated.dispatch(this.getModel())
			return true
		}else{
			return false
		}
	}
	// ------------------------------------------------
	this.getModel = function(){
		return {
			id : this.id,
			x : this.x,
			y : this.y,
			orientation : this.orientation,
			size : this.bot_size,
			color : this.color,
			type : this.type
		}
	}
}

