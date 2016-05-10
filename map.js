var utils = require('./utils.js')

var exports = module.exports = function(){
	this.el = "#map"
	this.cell_size = 20
	this.matrix = []
	this.monsters = []
	this.rows = 0
	this.cols = 0
	this.init = function(map_width, map_height){
		this.rows = map_height/this.cell_size;
		this.cols = map_width/this.cell_size;
		for(var i=0; i<this.rows;i++){
			var row = []
			for(var ii=0; ii<this.cols;ii++){
				var val = 0
				if(Math.random()*10%2>1) val = 1
				var el = {
					id : utils.guid(),
					val : val
				}
				row.push(el)
			}
			this.matrix.push(row)
		}
	}
	this.addNewBotOnMap = function(val,position){
		this.matrix[position.y][position.x].val = 2
		return this.matrix
	}
	// ONLY USED TO UPDATE MAP FOR POTENTIAL NEW PLAYER
	this.moveBot = function(from,to){
		this.matrix[from.y][from.x].val = 0
		this.matrix[to.y][to.x].val = 2
	}
	this.getFreePlaceOnMap = function(){
	    var x = 0
	    var y = 0
	    while(this.matrix[y][x].val != 0){
	      x = Math.round(Math.random()*this.cols)
	      if(x == this.cols) x--
	      y = Math.round(Math.random()*this.rows)
	      if(y==this.rows) y--
	    }
	    
	    return {
	      x : x,
	      y : y
	    }
	}
}
