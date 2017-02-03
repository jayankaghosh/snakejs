var snakeJSMazes = {
	"BORDER" : function(canvas, blocksize){
		blocksize *= 3;
		var maze = [];
		for(var i = blocksize; i < canvas.width-blocksize; i++){
			for(var j = blocksize; j < canvas.height-blocksize; j++){
				if(i==blocksize || j==blocksize || i==canvas.width-blocksize-1 || j==canvas.height-blocksize-1){
					var point = {
						dx: i,
						dy: j,
						width: blocksize/2,
						height: blocksize/2
					};
					maze.push(point);
				}
			}
		}
		return maze;
	},
	"STRIPED-BORDER" : function(canvas, blocksize){
		blocksize *= 3;
		var maze = [];
		for(var i = blocksize; i < canvas.width-blocksize; i++){
			for(var j = blocksize; j < canvas.height-blocksize; j++){
				if(i==blocksize || j==blocksize || i==canvas.width-blocksize-1 || j==canvas.height-blocksize-1){
					if(i>blocksize && i%blocksize==0){
						i+= blocksize*1.4;
					}
					else if(j>blocksize && j%blocksize==0){
						j+= blocksize*1.4;
					}
					else{
						var point = {
							dx: i,
							dy: j,
							width: blocksize/2,
							height: blocksize/2
						};
						maze.push(point);
					}
				
				}
			}
		}
		return maze;
	},
	"LSHAPE" : function(canvas, blocksize){
		blocksize*=3;
		var maze = [];
		var dummy_square = false,
			lowerCorner = false;
		for(var i = blocksize; i < canvas.width; i+=blocksize){
			for(var j = blocksize; j < canvas.height; j+=blocksize){
				if(i > (canvas.width/3) && i < (canvas.width-(canvas.width/3))){
					if(j > (canvas.height/4) && j < (canvas.height-(canvas.height/4))){
						if(!dummy_square){
							dummy_square = {
								x1 : i,
								y1 : j,
								x2 : (canvas.width-(canvas.width/3))-blocksize,
								y2 : (canvas.height-(canvas.height/4))-blocksize
							}
						}
						if(j >= dummy_square.y1 && j <= dummy_square.y2){
							lowerCorner = false;
						}
						else{
							lowerCorner = true;
						}
						if(i == dummy_square.x1 || lowerCorner){
							var point = {
								dx: i,
								dy: j,
								width: blocksize,
								height: blocksize
							}
							maze.push(point);
						}
					}
				}
			}
		}
		return maze;
	},
	"CSHAPE" : function(canvas, blocksize){
		blocksize*=3;
		var maze = [];
		var dummy_square = false,
			lowerCorner = false;
		for(var i = blocksize; i < canvas.width; i+=blocksize){
			for(var j = blocksize; j < canvas.height; j+=blocksize){
				if(i > (canvas.width/3) && i < (canvas.width-(canvas.width/3))){
					if(j > (canvas.height/4) && j < (canvas.height-(canvas.height/4))){
						if(!dummy_square){
							dummy_square = {
								x1 : i,
								y1 : j,
								x2 : (canvas.width-(canvas.width/3))-blocksize,
								y2 : (canvas.height-(canvas.height/4))-blocksize
							}
						}
						if(j >= dummy_square.y1 && j <= dummy_square.y2){
							lowerCorner = false;
						}
						else{
							lowerCorner = true;
						}
						if(i == dummy_square.x1 || lowerCorner || j == dummy_square.y1){
							var point = {
								dx: i,
								dy: j,
								width: blocksize,
								height: blocksize
							}
							maze.push(point);
						}
					}
				}
			}
		}
		return maze;
	},
	"CENTER" : function(canvas, blocksize){
		blocksize*=3;
		var maze = [];
		var dummy_square = false,
			lowerCorner = false;
		for(var i = blocksize; i < canvas.width; i+=blocksize){
			for(var j = blocksize; j < canvas.height; j+=blocksize){
				if(i > (canvas.width/3) && i < (canvas.width-(canvas.width/3))){
					if(j > (canvas.height/4) && j < (canvas.height-(canvas.height/4))){
						if(!dummy_square){
							dummy_square = {
								x1 : i,
								y1 : j,
								x2 : (canvas.width-(canvas.width/3))-blocksize,
								y2 : (canvas.height-(canvas.height/4))-blocksize
							}
						}
						if(i> dummy_square.x1 && j> dummy_square.y1 && i < dummy_square.x2 && j < dummy_square.y2){
							var point = {
								dx: i,
								dy: j,
								width: blocksize,
								height: blocksize
							}
							maze.push(point);
						}
					}
				}
			}
		}
		return maze;
	}

}