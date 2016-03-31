
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
	this.consoleMap = function(){
		this.matrix.forEach(function(row){
			console.log(row)
		})
	}
	
}
