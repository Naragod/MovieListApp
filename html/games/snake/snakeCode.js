
//Public Variables Containing the Id of Each Snake Block
//as Well as the Value of Each of Their Positions
var blockIds = new Array;
var prevL = new Array;

//Global interval variable that needs to be cleared everytime a new game is started.
var interval = -1;
//

var canvas = $("#animation")
var cHeight = canvas.height();
var cWidth = canvas.width();


//Random Number Generator
var getRn = function(range){
	//Returns a random number from 0 to range - 1
	return Math.floor(Math.random() * range);
};

//Makes block at postion x, y and takes an optional ID
var makeBlock = function(x, y, oID, type){
	var space = $("#animation");
	var id;

	if(typeof type == "undefined"){
		type = "snake";
	};

	//Check to see if an optional ID has been given
	if(typeof oID == "undefined"){
		//If oID has not been given, get a new id
		id = getRn(100000);

		//Ensure Each Id is Unique
		while(id == $('#' + id).attr("id")){
			id = getRn(100000);
		};
	}
	else{
		id = oID;
	};

	var divBlock = "<div class='" + type + " current' id='" + id + "' style='left:" + x + "px;top:" + y + "px;'></div>";
	space.append(divBlock);

	return id;
};

//Randomly draw a pellet on the canvas
var drawPellet = function(){
	//Canvas and Block Width Respectively;
	var cW = 500
	var sW = 20;
	var boxes = cW/sW;

	//Get all the blocks representing the snake
	var snake = $(".snake");

	//Centers the Pellet in the middle of each box of the grid
	var x = (getRn(boxes) * 20); //+ 5; When pellet is of width 10px
	var y = (getRn(boxes) * 20); //+ 5; When pellet is of height 10px

	var blocks = [];
	for(var i = 0; i < prevL.length; i++){
		blocks.push(prevL[i][0]);
	};

	//Ensures Pellet is not Draw on top of Snake
	while(blocks.indexOf(x) > -1){
		x = (getRn(boxes) * 20);
	};

	makeBlock(x, y, undefined, "pellet");
};

//Moves block with identifier id to x, y
var move = function(x, y, id){
	var block = $("#" + id)
	block.css("left", x);
	block.css("top", y)
};

var moveSnake = function(blockIds, positions){
	//Moves each block to the next block's location
	for(var i = 1; i <= blockIds.length; i++){
		move(positions[i - 1][0], positions[i - 1][1], blockIds[i]);
		positions[i - 1] = getPos(blockIds[i - 1]);
	};
};

var getPos = function(id){
	var block = $("#" + id);
	x = block.position().left;
	y = block.position().top;

	return ([x, y]);
};

var moveBlock = function(id, dir){
	var block = $("#" + id);
	var x = block.position().left;
	var y = block.position().top;

	
	var speed = 20;

	//****************
	//Cheching Direction Must Come Before Edge Check

	//Left Direction
	if(dir == 37){
		x -= speed;
	}
	//Up Direction
	else if(dir == 38){
		y -= speed;
	}
	//Right Direction
	else if(dir == 39){
		x += speed
	}
	//Down Direction
	else if(dir == 40){
		//tailX -= (width * i);
		y += speed
	};

	//Checks Edges of the Canvas for Collision
	if((x < 0) || 
		(x > cWidth - speed) ||
		(y < 0) ||
		(y > cHeight - speed)){
		alert("Collision");

		return "Collision";

		//Move Snake to the Beginning
		//move(240, 240, id);
	};

	//Check Self Snake Collision
	var headB = prevL.slice(0, 1)[0];
	for(var i = 1; i < prevL.length; i++){
		if(headB[0] == prevL[i][0] && headB[1] == prevL[i][1]){
			alert("Collision");
			return "Collision";
		};
	};
	
	//Move block
	move(x, y, id);

	//Check Pellet Collision
	var pellet = $(".pellet").attr("id");

	if(colDetection(id, pellet)){
		//Increase player score
		pScore += 1;
		$("#score").text("Score: " + pScore);

		//Setting high score.
		if(pScore > highScore){
			highScore = pScore;
		};
		
		$("#hscore").text("High Score: " + highScore);

		//Removes the Eaten Pellet
		$("#" + pellet).remove();
		//Creates New Pellet
		drawPellet();

		//This moveBlock Function is Called After Public Variables Have Been Assigned
		//There Should be No Problem With prevL

		//Create New Snake Block Preceding the Current Last Block
		var last = prevL.slice(-1)[0];
		var sLast = prevL.slice(-2, -1)[0];

		//New Block Coordinates
		var nX = 0;
		var nY = 0;

		if(last[0] <= sLast[0]){
			nX = last[0] - 20;
		}
		else{
			nX = last[0] + 20;
		};
		if(last[1] <= sLast[1]){
			nY = last[1] - 20;
		}
		else{
			nY = last[1] + 20;
		};

		//Make New Block at the End of the Snake
		var nID = makeBlock(nX, nY);
		//Add Block Coordinates to Array
		prevL.push(getPos(nID));
		blockIds.push(nID);
	};
};

var setSnake = function(length, x, y){
	var blockId = makeBlock(x, y);
	var blockIds = [blockId];

	//Gets location of the head block before it is moved
	var prevL = [];
	prevL.push(getPos(blockId));

	//Draws the snake for the first time
	for(var i = 1; i < length; i++){
		var id = makeBlock(x - (i * 20), y);
		//Stores block ID and block Position
		blockIds.push(id);
		prevL.push(getPos(id));
	};

	//Sets the background color of the head
	$("#" + blockId).css('background-color', "#e6bbad");

	return ([blockIds, prevL, blockId]);
};

//*******************************************************************
//Collisions

var colDetection = function(head, pellet){
	var A = $("#" + head);
	var Ax = A.position().left;
	var Ay = A.position().top;

	var B = $("#" + pellet);
	var Bx = B.position().left;
	var By = B.position().top;


	//Check for Collision
	if(Ax < Bx + 20 &&
		Ax + 20 > Bx &&
		Ay < By + 20 &&
		Ay + 20 > By){
		return true;
	};
	
	return false;
};

//Clear Canvas and Variables
var clearAll = function(){
	var blockIds = new Array;
	var prevL = new Array;
	$(".pellet").remove();
	$(".snake").remove();
	$("#score").text("Score: " + 0);

	if(interval > -1){
		clearInterval(interval);
		interval = -1
	};
};

var newGame = function(){
	//Clear canvas
	clearAll();

	//Initial Snake Settings.
	///////////////////////////////////////////////////////////////
	var x = 260;
	var y = 240;
	var snakeSpeed = 300;

	var temp = setSnake(3, x, y);

	////////////////////////////////////////////////////////////////

	//How many pellets to eat before an increase in diffulty?
	var cap = 4;

	//Neccesary for repeated snake drawing
	var handle = false;
	var interval = [0];

	//Unassigned value.
	var currentKey = "";



	blockIds = temp[0];
	prevL = temp[1];
	var blockId = temp[2];

	drawPellet();

	$("html").keydown(function(e){
		var key = e.which;

		if(40 >= key  && key >= 37){
			if(handle && (currentKey != key)){
				//Clears the intervals that continiously draws the snake.
				clearInterval(interval);
				//Resets the interval to -1, a number that will never be assigned by the setInterval function.
				interval = -1;
				
				//Resets the handle
				handle = false;
			};

			if(!(currentKey == key)){
				//Continually draws the snake until the direction is changed.
				interval = setInterval(function(){
					//Ensures block cannot move back into a space occupided by the adjacent PREVIOUS block
					if(!((prevL[1][0] < prevL[0][0] && key == 37) ||	//Head is Right
						(prevL[1][0] > prevL[0][0] && key == 39) ||		//Head is Left
						(prevL[1][1] < prevL[0][1] && key == 38) ||		//Head is Up
						(prevL[1][1] > prevL[0][1] && key == 40))){		//Head is Down

						//Moves head block
						var rest = moveBlock(blockId, key);
						
					}
					//In case player presses the opposite direction, the game will not be paused.
					else{
						if(key >= 39){
							key -= 2;
						}
						else{
							key += 2;
						};

						moveBlock(blockId, key);
					};

					//Draws Snake
					moveSnake(blockIds, prevL);


					//If there is a collision, start new game
					if(rest == "Collision"){
						//Stop snake from moving. --> Must clear interval.
						clearInterval(interval);
						interval = -1;

						//Play Again
						return false;
					};

					//Decrease the interval in which the snake moves
					//and therefore increase the speed of snake and difficulty.
					if(pScore != 0 && ((pScore % cap) == 0)){
						//How often the speed increases, ie: every 4 pelletss.
						cap += 4;

						//How much the speed increases.
						snakeSpeed -= 30;
					};

				//Speed of Snake
				}, snakeSpeed);
			};

			handle = true;
			currentKey = key;
		};	
	});
};

//Score

$(document).ready(function(){

	//var highScore = 0, this does breaks the game.
	//Interesting behaviour. Removing the keyword var will make highScore a global variable,
	//as opposed to a local variable. I will then be unable to reference highScore outside
	//of the document.ready function.
	highScore = 0;
	pScore = 0;
	newGame();

});

