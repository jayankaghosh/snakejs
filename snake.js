var snakeJS = function(canvas){
	this.canvas = canvas;
	this.context = this.canvas.getContext("2d");
}
snakeJS.prototype = {
	_game_speed : 50,
	_block_size : 20,
	_game_colors : {
		background : "#0A0A0A",
		primary : "#FFFFFF",
		secondary: "yellow"
	},
	_special_food_frequency : 0.25,
	start : function(gamespeed, blocksize, allowtouch){
		if(!allowtouch){
			this.isTouchDevice = function(){
				return false;
			}
		}
		this.canvas.style.backgroundColor = this._game_colors.background;
		this._game_speed_orig = gamespeed;
		this._block_size = blocksize;
		if(this.isTouchDevice){
			this._block_size*2;
		}
		this.highscore = this.getHighscore();
		this._init();
		this.directioncodes = {
			"LEFT" : {
					x : -this._block_size,
					y : 0
			},
			"UP" : {
					x : 0,
					y : -this._block_size
			},
			"RIGHT" : {
					x : this._block_size,
					y : 0
			},
			"DOWN" : {
					x : 0,
					y : this._block_size
			}
		};
		this.snakeDirection = this.directioncodes["RIGHT"];
	},
	_init : function(){
		this._game_speed = this._game_speed_orig;
		this._game_paused = true;
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.font="bold "+this._block_size*2+"px Courier";
		this.context.textAlign = "center";
		this.context.fillStyle = this._game_colors.primary;
		this.context.fillText("SNAKE-JS	by j0y",this.canvas.width/2,this.canvas.height/4);
		this.context.font=this._block_size*2+"px Arial";
		if(this.isTouchDevice()){
			var playInstructions = "Touch screen to play";
		}
		else{
			var playInstructions = "Press spacebar to play";
		}
		this.context.fillText(playInstructions,this.canvas.width/2,this.canvas.height/2);
		if(typeof(this.highscore) == "object" && this.highscore.score){
			this.context.fillText("Highscore- "+this.highscore.name+", "+this.highscore.score,this.canvas.width/2,this.canvas.height/1.5);
		}
		this.context.textAlign = "left";
		this.snake = [];
		this.foodPoint = {};
		this.moving = false;
		this.score = 0;
		var ctx = this;
		if(ctx.isTouchDevice()){
			window.removeEventListener("click", ctx._init_start_touch);
			window.addEventListener("click", ctx._init_start_touch.bind(ctx));
		}
		else{
			window.removeEventListener("keydown", ctx._init_start_keyboard);
			window.addEventListener("keydown", ctx._init_start_keyboard.bind(ctx));
		}
	},
	_init_start_keyboard : function(e){
		if(!this._game_paused){
			return;
		}
		var ctx = this;
		if(e.keyCode == 32){
			this.requestFullscreen();
			var initSnakePos = {
				dx : ctx.randomInt(ctx._block_size, game.width-ctx._block_size),
				dy : ctx.randomInt(ctx._block_size, game.height-ctx._block_size),
				width : ctx._block_size,
				height : ctx._block_size,
				color: ctx._game_colors.primary
			}
			ctx.snake[ctx.snake.length] = initSnakePos;
			ctx.makeNewFood();
			ctx.addSnakeListener();
			this._game_paused = false;
			ctx.gameLoop();
		}
	},
	_init_start_touch : function(){
		if(!this._game_paused){
			return;
		}
		//this.requestFullscreen();
		var ctx = this;
		var initSnakePos = {
			dx : ctx.randomInt(ctx._block_size, game.width-ctx._block_size),
			dy : ctx.randomInt(ctx._block_size, game.height-ctx._block_size),
			width : ctx._block_size,
			height : ctx._block_size,
			color: ctx._game_colors.primary
		}
		ctx.snake[ctx.snake.length] = initSnakePos;
		ctx.makeNewFood();
		ctx.addSnakeListener();
		this._game_paused = false;
		ctx.gameLoop();
	},
	addSnakeListener : function(){
		var ctx = this;
		if(this.isTouchDevice()){
    		swipe.removeSwipeListener(window);
			swipe.addSwipeListener(window, 100, 500, ctx._snakelistener_touch.bind(ctx));
		}
		else{
			window.removeEventListener("keydown", ctx._snakelistener_keyboard);
			window.addEventListener("keydown", ctx._snakelistener_keyboard.bind(ctx));
		}
	},
	_snakelistener_keyboard : function(e){
		if(this._game_paused){
			return;
		}
		var _event_codes = {
			37 : "LEFT",
			38 : "UP",
			39 : "RIGHT",
			40 : "DOWN"
		};
		var direction = _event_codes[e.keyCode];
		if(direction){
			this.setSnakeDirection(direction);
		}
	},
	_snakelistener_touch : function(direction){
		this.setSnakeDirection(direction);
	},
	setSnakeDirection : function(direction){
		if(this.moving){
			return false;
		}
		this.moving = true;
		if(direction == "LEFT" && this.snakeDirection != this.directioncodes["RIGHT"]){
			this.snakeDirection = this.directioncodes["LEFT"];
		}
		else if(direction == "UP" && this.snakeDirection != this.directioncodes["DOWN"]){
			this.snakeDirection = this.directioncodes["UP"];
		}
		else if(direction == "RIGHT" && this.snakeDirection != this.directioncodes["LEFT"]){
			this.snakeDirection = this.directioncodes["RIGHT"];
		}
		else if(direction == "DOWN" && this.snakeDirection != this.directioncodes["UP"]){
			this.snakeDirection = this.directioncodes["DOWN"];
		}
		var ctx = this;
		setTimeout(function(){
			ctx.moving = false;
		}, ctx._game_speed);
	},
	setSpeed : function(speed){
		this._game_speed = speed;
	},
	gameLoop : function(){
		var ctx = this;
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.drawScore();
		this.drawTimer();
		this.draw(this.foodPoint);
		this.drawSnake();
		window.requestAnimationFrame(function(){
			if(ctx._game_paused){
				return;
			}
			setTimeout(ctx.gameLoop.bind(ctx), ctx._game_speed);
		});
	},
	drawTimer : function(){
		if(this._timer > 0){
			this.context.textAlign = "left";
			this.context.fillStyle = this._game_colors.secondary;
			this.context.font=this._block_size*3+"px Arial";
			this.context.fillText(this._timer,this.canvas.width-this._block_size*4,this.canvas.height-this._block_size*4);
		}
	},
	drawScore : function(){
		this.context.fillStyle = this._game_colors.primary;
		this.context.font=this._block_size*2+"px Georgia";
		this.context.fillText("SCORE: "+this.score,this._block_size*3,this._block_size*3);
	},
	updateSnakePosition : function(){

		var current_head = this.snake[this.snake.length-1];
		if(typeof(current_head) == "undefined"){
			return false; //snake not present yet
		}

		//each point of tail takes it's next point's position
		this.snake.shift();
		
		this.snake.push(JSON.parse(JSON.stringify(current_head)));


		//head of snake takes next movable position
		var snakeHead = this.snake[this.snake.length-1];
		snakeHead.dx += this.snakeDirection.x;
		snakeHead.dy += this.snakeDirection.y;

		
		//collision detection
		if(snakeHead.dx <= this._block_size){
			snakeHead.dx = this.canvas.width-this._block_size;
		}
		else if(snakeHead.dx >= this.canvas.width-this._block_size){
			snakeHead.dx = this._block_size;
		}
		else if(snakeHead.dy <= this._block_size){
			snakeHead.dy = this.canvas.height-this._block_size;
		}
		else if(snakeHead.dy >= this.canvas.height-this._block_size){
			snakeHead.dy = this._block_size;
		}
		if(this.checkBoundingRectangles(this.snake[this.snake.length-1], this.foodPoint)){
			//food collision
			this.growSnake(this.foodPoint);
			this.makeNewFood();
		}

	},
	growSnake : function(point){
		var increment = 1;
		if(point.color == this._game_colors.secondary){
			increment = 10;
		}
		point.color = this._game_colors.primary;
		this.snake.push(point);
		this.incrementScore(increment);
	},
	incrementScore : function(increment){
		this.score += increment;
		if(this.score%4==0){
			this._game_speed-=5;
			if(this._game_speed < 5){
				this._game_speed = 5;
			}
		}
	},
	checkBoundingRectangles : function(obj1, obj2){

		var obj1_left_edge = obj1.dx;
		var obj2_left_edge = obj2.dx;
		var obj1_right_edge = obj1_left_edge+obj1.width;
		var obj2_right_edge = obj2_left_edge+obj2.width;
		var obj1_top_edge = obj1.dy;
		var obj2_top_edge = obj2.dy;
		var obj1_bottom_edge = obj1_top_edge+obj1.height;
		var obj2_bottom_edge = obj2_top_edge+obj2.height;

		var aLeftOfB = obj1_right_edge <= obj2_left_edge;
	    var aRightOfB = obj1_left_edge >= obj2_right_edge;
	    var aAboveB = obj1_bottom_edge <= obj2_top_edge;
	    var aBelowB = obj1_top_edge >= obj2_bottom_edge;

		if(!( aLeftOfB || aRightOfB || aAboveB || aBelowB )){
			return true;
		}
		return false;
	},
	gameOver : function(){
		var name = prompt("Game Over. Your score: "+this.score+"\n\nEnter Name");
		if(this.score > this.highscore.score || typeof(this.highscore.score) == "undefined"){
			this.highscore = {
				name: name,
				score: this.score
			}
			this.setHighscore();
		}
		this._init();
	},
	drawSnake : function(){
		this.updateSnakePosition();
		for(var i = 0; i < this.snake.length; i++){
			if(i < this.snake.length-4 && this.snake.length > 3){
				if(this.checkBoundingRectangles(this.snake[this.snake.length-1],this.snake[i])){
					this.gameOver();
				}
			}
			this.draw(this.snake[i]);
		}
	},
	makeNewFood : function(){
		var new_food = this.food();
		while(this.foodInsideSnake(new_food)){
			new_food = this.food();
		}
		this.foodPoint = new_food;
		return true;
	},
	foodInsideSnake : function(food){
		for(var i = 0; i < this.snake.length; i++){
			if(this.checkBoundingRectangles(this.snake[this.snake.length-1], food)){
				return true;
			}
		}
		return false;
	},
	draw : function(data){
		if(!this.isValidPoint(data)){
			console.log("Not a valid point");
			return false;
		}
		this.context.fillStyle = data.color;
		this.context.fillRect(data.dx, data.dy, data.width, data.height);
		this.context.stroke();
	},
	isValidPoint : function(data){
		if(typeof(data)!="object" || !data.dx || !data.dy || !data.width || !data.height || !data.color){
			return false;
		}
		return true;
	},
	randomInt : function(min, max) {
		var _random_int = Math.floor(Math.random() * (max - min + 1)) + min;
	    return Math.round((_random_int/this._block_size)*this._block_size);
	},
	food : function(){
		this._timer = 0;
		clearInterval(this.timerLoop);
		var padding = 2*this._block_size,
			food_color = this.randomInt(0,100*this._block_size)<=(this._special_food_frequency*100*this._block_size)?this._game_colors.secondary:this._game_colors.primary;
		var data = {
			dx : this.randomInt(padding, this.canvas.width-padding),
			dy : this.randomInt(padding, this.canvas.height-padding),
			width : this._block_size,
			height : this._block_size,
			color: food_color
		}
		if(data.color == this._game_colors.secondary){
			var ctx = this;
			this._timer = 5;
			this.timerLoop = setInterval(function(){
				if(ctx._timer < 2){
					ctx.makeNewFood();
					clearInterval(ctx.timerLoop);
					return;
				}
				ctx._timer--;
			}, 1000);
		}
		return data;
	},
	getHighscore : function(){
		var cname = "_snakejs_highscore";
	    var name = cname + "=";
	    var ca = document.cookie.split(';');
	    for(var i = 0; i <ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') {
	            c = c.substring(1);
	        }
	        if (c.indexOf(name) == 0) {
	            return JSON.parse(c.substring(name.length,c.length));
	        }
	    }
	    return {name: "NA"};
	},
	setHighscore : function(){
		var cname = "_snakejs_highscore",
			cvalue = JSON.stringify(this.highscore);
	    document.cookie = cname + "=" + cvalue + "; ";
	},
	isTouchDevice : function(){
		if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) { 
		    // Touch events are supported
		    return true;
		}
		return false;
	},
	requestFullscreen : function(){
		var docElm = this.canvas;
		var isInFullScreen = (document.fullScreenElement && document.fullScreenElement !==     null) ||    // alternative standard method  
            (document.mozFullScreen || document.webkitIsFullScreen);
	    if (!isInFullScreen) {

	        if (docElm.requestFullscreen) {
	            docElm.requestFullscreen();
	        }
	        else if (docElm.mozRequestFullScreen) {
	            docElm.mozRequestFullScreen();
	        }
	        else if (docElm.webkitRequestFullScreen) {
	            docElm.webkitRequestFullScreen();
	        }
	    }
	}
}
