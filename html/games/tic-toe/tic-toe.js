//Public Variables
//Boxes is the number of boxes per side
var boxes = 3;

var canvas = $("#canvas");
var cWidth = canvas.width();
var positions = [];
var xoPositions = [];
var state = [];



//Quadrants needs to be filled. It is essentially a dictionary containing
//All possible values corresponding to each intersection
//Needs to be filled dynamically for when the board is larger than 3x3;
var quadrants = [];
quadrants.push([0, 1, 3, 4]);
quadrants.push([1, 2, 4, 5]);
quadrants.push([3, 4, 6, 7]);
quadrants.push([4, 5, 7, 8]);

var XOloc = function(){
	for(var y = 0; y < boxes; y++){
		var row = [];
		for(var x = 0; x < boxes; x++){
			xoPositions.push([(x * 166) + 83, (y * 166) + 83]);
			row.push("");
		};
		state.push(row)
	};
};

//Draws board according to how many n by n boxes are specified
var drawBoard = function(n){
	var line;
	var pos = Math.floor(cWidth/n);

	for(var i = 1; i < n; i++){
		hLine = "<hr style='top:" + (pos * i) + "px;width:" + cWidth + "px;'/>"
		vLine = "<hr style='left:" + (pos * i) + "px;' width='1' size='500'/>"
		canvas.append(hLine);
		canvas.append(vLine);
	};

};

var fillPos = function(n){
	var pos = Math.floor(cWidth/(n+1));

	for(var y = 1; y < n + 1; y++){
		for(var x = 1; x < n + 1; x++){
			positions.push([(pos * x), (pos * y)]);
		};
	};
};

//Finds the closest intersection to mouse click
var findIntersection = function(x, y){
	var posX;
	var posY;
	//Arbitrarally high number
	var holderX = 10000;
	var holderY = 10000;
	var loc = -1;

	for(var i = 0; i < positions.length; i++){
		posX = positions[i][0];
		posY = positions[i][1];
		if((Math.abs(x - posX) <= holderX) && (Math.abs(y - posY) <= holderY)){
			holderX = Math.abs(x - posX);
			holderY = Math.abs(y - posY);
			loc = i;
		};
	};

	return loc;
	
};

var findBox = function(x, y){
	var loc = findIntersection(x, y);
	var posX = positions[loc][0];
	var	posY = positions[loc][1];
	var dirX = "l";
	var dirY = "d";

	var qwe = {"tl": 0, "tr": 1, "dl": 2, "dr": 3}
	var box;

	if(posY > y){
		dirY = "t";
	};
	if(posX < x){
		dirX = "r";
	};

	var res = qwe[dirY + dirX];

	box = quadrants[loc][res];
	return box;
};

var drawMark = function(player, box){
	var pos = xoPositions[box];
	var posX = pos[0];
	var posY = pos[1];
	var block = "<div class='" + player + "' style='left:" + posX + "px;top:" + posY + "px;'>" + player + "</div>"

	//These operations find the correct place to store the state
	var column = box % boxes;
	var row = Math.floor(box / boxes);

	if(state[row][column] == ""){
		state[row][column] = player;
		canvas.append(block);
	};
};

var check = function(player, box){
	var col = box % boxes;
	var row = Math.floor(box / boxes);

	//Check Row
	for(var i = 0; i < boxes; i++){
		//console.log(state[row][i]);
		if(state[row][i] != player){
			break;
		};
		if(i == boxes - 1){
			alert(player + " Won");
		};
	};

	//Check Column
	for(var i = 0; i < boxes; i ++){
		if(state[i][col] != player){
			break;
		};
		if(i == boxes - 1){
			alert(player + " Won");
		};
	};

	//Check Diagonal
	for(var i = 0; i < boxes; i++){
		if(state[i][i] != player){
			break;
		};
		if(i == boxes - 1){
			alert(player + " Won");
		};
	};

	//Check Backwards Diagonal
	for(var i = boxes; i > 0; i--){
		if(state[boxes - i][i - 1] != player){
			break;
		};
		if(i == 1){
			alert(player + " Won");
		};
	};
	

};

$(document).ready(function(){
	//Set Board, Player and All Other Neccesary Variables
	var player = "X";
	drawBoard(boxes);
	fillPos(boxes - 1);
	//Sets the state Variable as Well
	XOloc();

	canvas.click(function(e){
		var x = $(this).offset().left;
		var y = $(this).offset().top;
		var posX = e.pageX - x;
		var posY = e.pageY - y;	

		//Check what box was clicked
		var box = findBox(posX, posY);

		//Draw correct letter and sets the state of the box
		drawMark(player, box);

		//Check Victory Condition
		check(player, box);

		//Switch players after every mouse click
		if(player == "X"){
			player = "O";
		}
		else{
			player = "X";
		}
	});
});