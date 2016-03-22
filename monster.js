var exports = module.exports = function(){
	this.x = 0
	this.y = 0
	this.id = 0
	this.el = ""
	this.monster_size = 20
	this.map = []
	this.orientation = "s"
	this.init = function(json){
		this.monster_size = json.cell_size
		this.id = json.id
		this.map = json.map
		return this
	}
	this.move = function(){
		setInterval(function(){

		},1000)
	}
	this.render = function(){
		this.el = $('<span>')
		this.el.html(this.orientation)
		console.log(this.el)
        this.el.css({ 
        	display:"none",
        	width : this.monster_size+"px",
        	height : this.monster_size+"px",
        })
        this.el.addClass("box monster")
		return this.el
	}
}
