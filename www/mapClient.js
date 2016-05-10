var Map = function(){
	this.el = "#map"
	this.cell_size = 20
	this.matrix = []
	this.monsters = []
	this.init = function(json){
		this.map_width = json.map_width
		this.map_height = json.map_height
		this.matrix = json.matrix
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
				.attr("id",col.id)
		        // .attr("class",col.id)
		        box.css({ 
		        	display:"none",
		        	top : i*_this.cell_size,
		        	left : ii*_this.cell_size,
		        	width : _this.cell_size+"px",
		        	height : _this.cell_size+"px",
		        })
		        // .html(col)
		        // if((col.val == 0)||(col.val == 2)){
		        if(col.val != 1){
		        	box.addClass("box empty")
		        }else if(col.val == 1){
		        	box.addClass("box full")
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
