var Bot = function(){
	this.el = "#map"
	this.id = 0
	this.x = 0
	this.y = 0
	this.orientation = "s"
	this.size = 0
	this.color = "red"
	this.create = function(json){
		this.color = json.color
		this.id = json.id
		this.x = json.x
		this.y = json.y
		this.orientation = json.orientation
		this.size = json.size
		return this;
	}
	this.update = function(json){
		var _this = this
		this.id = json.id
		this.x = json.x
		this.y = json.y
		this.orientation = json.orientation
		this.size = json.size
		$('#'+this.id).animate({
			left: this.x*this.size,
			top: this.y*this.size
		}, 1000, function() {
			// Animation complete.
		});
		$('#'+this.id).html(this.orientation)
	}
	this.remove = function(){
		console.log(this.id)
		$('#'+this.id).remove()
		delete this
	}
	this.render = function(){
		var box = $('<span>')
        .attr("id",this.id)
        box.css({ 
        	top : this.y*this.size,
        	left : this.x*this.size,
        	width : this.size+"px",
        	height : this.size+"px",
        	background : this.color
        }).addClass("box monster")
        .html(this.orientation)
        $(this.el).append(box)
		return this
	}
}

var User = function(){

	this.listener = new window.keypress.Listener();

	this.listenKeyboard = function(){
		// ------------------
      	this.listener.simple_combo("q", function() {
		    this.socket.emit("want-update-position","left")
		});
		this.listener.simple_combo("d", function() {
		    this.socket.emit("want-update-position","right")
		});
		this.listener.simple_combo("z", function() {
		    this.socket.emit("want-update-position","up")
		});
		this.listener.simple_combo("s", function() {
		    this.socket.emit("want-update-position","down")
		});
		// ------------------
		return this
	}	
}

User.prototype = new Bot;

