var snakeJS = function(canvas){
			this.canvas = canvas;
			this.context = this.canvas.getContext("2d");
		}
		snakeJS.prototype = {
			_game_speed : 50,
			_block_size : 20,
			_game_colors : {
				primary : "#FFFFFF",
				secondary: "#0000FF"
			},
			start : function(gamespeed, blocksize, highscore){
				this._game_speed = gamespeed;
				this._block_size = blocksize;
				this.highscore = highscore;
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
				var initSnakePos = {
					dx : this.randomInt(this._block_size, game.width-this._block_size),
					dy : this.randomInt(this._block_size, game.height-this._block_size),
					width : this._block_size,
					height : this._block_size,
					color: this._game_colors.primary
				}
				this.snake[this.snake.length] = initSnakePos;
				this.makeNewFood();
			},
			_init : function(){
				this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
				this.context.font="bold "+this._block_size*2+"px Courier";
				this.context.textAlign = "center";
				this.context.fillStyle = this._game_colors.primary;
				this.context.fillText("SNAKE-JS	by j0y",this.canvas.width/2,this.canvas.height/4);
				this.context.font=this._block_size*2+"px Arial";
				this.context.fillText("Press spacebar to play",this.canvas.width/2,this.canvas.height/2);
				if(typeof(this.highscore) == "object"){
					this.context.fillText("Highscore- "+this.highscore.name+", "+this.highscore.score,this.canvas.width/2,this.canvas.height/1.5);
				}
				this.context.textAlign = "left";
				this.snake = [];
				this.foodPoint = {};
				this.moving = false;
				this.score = 0;
				var ctx = this;
				window.addEventListener("keydown", function(e){
					if(e.keyCode == 32){
						ctx.addSnakeListener();
						ctx.gameLoop();
					}
				});
			},
			addSnakeListener : function(){
				var _event_codes = {
					37 : "LEFT",
					38 : "UP",
					39 : "RIGHT",
					40 : "DOWN"
				};
				var ctx = this;
				window.addEventListener("keydown", function(e){
					var direction = _event_codes[e.keyCode];
					if(direction){
						ctx.setSnakeDirection(direction);
					}
				});
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
				this.draw(this.foodPoint);
				this.drawSnake();
				window.requestAnimationFrame(function(){
					setTimeout(ctx.gameLoop.bind(ctx), ctx._game_speed);
				});
			},
			drawScore : function(){
				this.context.fillStyle = this._game_colors.primary;
				this.context.font=this._block_size*2+"px Georgia";
				this.context.fillText("SCORE: "+this.score,this._block_size*3,this._block_size*3);
			},
			updateSnakePosition : function(){

				//each point of tail takes it's next point's position
				var current_head = this.snake[this.snake.length-1];
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
				point.color = this._game_colors.primary;
				this.snake.push(point);
				this.score++;
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
				if(this.score > this.highscore.score){
					this.highscore = {
						name: name,
						score: this.score
					}
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
				this.foodPoint = new_food;
				return true;
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
				if(!data.dx || !data.dy || !data.width || !data.height || !data.color){
					return false;
				}
				return true;
			},
			randomInt : function(min, max) {
				var _random_int = Math.floor(Math.random() * (max - min + 1)) + min;
			    return Math.round((_random_int/this._block_size)*this._block_size);
			},
			food : function(){
				var padding = 2*this._block_size;
				var data = {
					dx : this.randomInt(padding, this.canvas.width-padding),
					dy : this.randomInt(padding, this.canvas.height-padding),
					width : this._block_size,
					height : this._block_size,
					color: this._game_colors.secondary
				}
				return data;
			}

		}