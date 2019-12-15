const lineCount = 20;
const lineHeight = 2;
const frameSpeed = 10;
const steps = 100;

let prevPos = 'strHor';

let x = 0;
let y = 0;
let yInc = 0;
let canvas;
let lineGap = 0;

let chances = new Array(100).fill(0)

for (let n = 0; n<chances.length; n++) {
	if(n > 90) {
		chances[n] = 1
	} 
}


document.addEventListener('DOMContentLoaded', () => {
	init();
});


backChance = () => {	

	return chances[Math.floor(Math.random() * chances.length)];
}


randomPos = (filter1 = null, filter2 = null) => {
	let pos = ['right', 'up', 'down'].filter(el => el !== filter1).filter(el => el !== filter2);
	let newpos = pos[Math.floor(Math.random() * pos.length)];

	return newpos
}



function init() {
	canvas = document.getElementById('elcanvas');

	canvas.width = document.body.offsetWidth;
	canvas.height = document.body.offsetHeight;

	lineGap = Number((canvas.height/(lineCount+1)).toFixed(0));
	getRandomY(canvas, lineCount, lineGap);
}


function getRandomY(canvas, lineCount, lineGap) {

	let yCoords = [];


	for (let n = 0; n<lineCount; n += 1) {
		yCoords .push(lineGap*(n+1));
	}

	let randomY = yCoords[Math.floor(Math.random() * yCoords.length)];

	y = randomY;
	makePath()
}


function makePath() {

	let path = ['strHor'];


	for (let n = 0; n<steps-1; n++) {

		let newPos = randomPos();

		prevPos = path[path.length-1]
		

		if((newPos === "up" && prevPos === "down") 
			|| (newPos === "down" && prevPos === "up") 
			|| (newPos === "right" && prevPos === "left") 
			|| (newPos === "left" && prevPos === "right") 
			|| (newPos === "right" && prevPos === "strHor")
		) {
			
			newPos = randomPos(newPos)

		} 
/*
		if((prevPos === "up" || prevPos === "down" || prevPos === "left") && backChance() === 1) {
			newPos = "left";
		}*/

		
/*
		if (localY < lineGap || localX < 0 || localX > canvas.width) {
			
			newPos = randomPos("up", "down")
			localY += lineGap;
		}

		if ( localY > canvas.height) {
			newPos = randomPos("down")
			localY -= lineGap;
		}

		if ( localX < 0) {
			newPos = randomPos("left")
			localX += lineGap;
		}
*/
		
		path.push(newPos);


	}


	for (let i = 0; i<path.length; i++) {

		let startIndex = 0;
		let nbrToDel = 0;
		let counting = false;

		for (let n = 0; n < path.length; n++) {
			if(path[i+n] === path[i] && path[i+n+1] === path[i]) {
				if(counting === false) {
					startIndex = i;
					counting = true;
				}
				nbrToDel++;
			} else {
				if(nbrToDel !== 0) {
					for (let u = startIndex; u<nbrToDel+startIndex; u++) {
						if (path[u-1] === "right" || path[u-1] === "left" || path[u-1] === undefined || path[u-1] === "strHor") {
							path[u] = "strHor";
						} else {
							path[u] = "strVer";
						}
					}
				}
				i += nbrToDel;
				counting = false;
				break;
			}
		}
	}	

		
	console.log(path)

	draw(path);
}


function draw(path) {

	//console.log(path)

	let ctx = canvas.getContext("2d");
	ctx.fillStyle = "black";

	let lastIndex = 0;

	let lastDir = ''

	path.forEach((v, i, a) => {

		if (v === "strHor") {
			ctx.fillRect(x, y, lineGap, lineHeight);
			x += lineGap;
			lastDir = ''
		} else if (v === "strVer") {
			if (a[i-1] === "up" || lastDir === "up") {
				lastDir = "up";
				y -= lineGap;
				ctx.fillRect(x, y, lineHeight, lineGap);
			} else if(a[i-1] === "down" || lastDir === "down") {
				lastDir = "down";
				ctx.fillRect(x, y, lineHeight, lineGap);
				y += lineGap;
				
			}
			
		} else {
			
			let arc = createArc(ctx, v, a[i-1], lastDir);
			lastDir = ''
		}

	})
}

function createArc(ctx, pos, pPos, lastDir) {

	let endAngleMult = 0;
	let radius = lineGap/2;
	let xInc = 0;
	let yInc = 0;

	if (pPos === "strHor" || pPos === "right") {
		if (pos === "down") {
			endAngleMult = 1
			yInc += lineGap/2;
			drawArc();
			xInc += lineGap/2;
		} 
		if (pos === "up") {
			endAngleMult = 2
			yInc -= lineGap/2;
			drawArc();
			xInc += lineGap/2;
		}
	}

	if (pPos === "strVer") {
		if (pos === "right") {
			if(lastDir === "up") {
				endAngleMult = 4
				xInc += lineGap/2;
				drawArc();
				yInc -= lineGap/2;
			} else {
				endAngleMult = 3
				xInc += lineGap/2;
				drawArc();
				yInc += lineGap/2;
			}
		} 
	}

	if (pPos === "down") {
		if (pos === "right") {
			endAngleMult = 3
			xInc += lineGap/2;
			drawArc();
			yInc += lineGap/2;	
		} 
	}

	if (pPos === "up") {
		if (pos === "right") {
			endAngleMult = 4
			xInc += lineGap/2;
			drawArc();
			yInc -= lineGap/2;
		} 
	}


	function drawArc() {
		ctx.beginPath();

		let startingAngle = (Math.PI + (Math.PI * (endAngleMult + 1)) /2);
		let endingAngle = (Math.PI + (Math.PI * endAngleMult) /2);
		let counterclockwise = true;

		ctx.arc(x+xInc, y+yInc, radius, startingAngle, endingAngle, counterclockwise);


		ctx.lineWidth = lineHeight;
		ctx.strokeStyle = "#000000";

		ctx.stroke();
		ctx.closePath();

	}

	x += xInc;
	y += yInc;

}