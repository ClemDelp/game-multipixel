var Monster = require('./monster.js')

// function svgRec(x,y,w,h){
// 	return [
// 	'<svg width="'+map_width+'" height="'+h+'" version="1.1" xmlns="http://www.w3.org/2000/svg">',
// 		'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" stroke="blue"/>',
// 	'</svg>'
// 	].join('')
// }
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
				if(Math.random()*10%2>1){
		        	row.push(1)
		        }else{
		        	row.push(0)
		        }	
			}
			this.matrix.push(row)
		}
	}
	this.addMonsters = function(nbr){
		for(var i=0; i<nbr;i++){
			var x = 0
			var y = 0
			while(this.matrix[y][x] != 0){
				x = Math.round(Math.random()*this.cols)
				if(x == this.cols) x--
				y = Math.round(Math.random()*this.rows)
				if(y==this.rows) y--
			}
			this.monsters.push(new Monster().init({
				cell_size : this.cell_size,
				id : i+"_monster",
				map : this,
				x : x,
				y : y
			}))
			// this.matrix[y][x] = 2
		}
	}
	this.consoleMap = function(){
		this.matrix.forEach(function(row){
			console.log(row)
		})
	}
	this.render = function(){
		var boxes = []
		var _this = this
		$.each(this.matrix,function(i,row){
			$.each(row,function(ii,col){
				var box = $('<span>')
		        .attr("id",i*ii)
		        box.css({ 
		        	display:"none",
		        	top : i*_this.cell_size,
		        	left : ii*_this.cell_size,
		        	width : _this.cell_size+"px",
		        	height : _this.cell_size+"px",
		        })
		        if(col == 0){
		        	box.addClass("box empty")
		        }else if(col == 1){
		        	box.addClass("box full")
		        }else if(col == 2){
		        	box.addClass("box monster")
		        }
		        $(_this.el).append(box)
				boxes.push(box)
			})
		})
		$.each(boxes, function(index, box) {
			setTimeout(function(){ box.show('slow'); }, index*10);
		})
		return this.el
	}
}
