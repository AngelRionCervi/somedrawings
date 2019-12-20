const lineCount = 30;
const lineHeight = 4;
const frameSpeed = 10;
const steps = 500;
const fillColor = "#201C13"
const bgColor = "#D7CCAC"
const scale = 2;
const dotRadius = scale;
const treeWidth = document.body.offsetHeight/100*(scale*1.5);
const treeHeight = document.body.offsetHeight/100*(scale*1.5);

const xRandom = true;

let prevPos = 'strHor';

let x = 0;
let y = 0;
let yInc = 0;
let canvas;
let lineGap = 0;


document.addEventListener('DOMContentLoaded', () => {
	init();
});


randomPos = (filter1 = null, filter2 = null) => {

	let fullPos = [];

	if (xRandom) {
		fullPos = ['right', 'down', 'left'];
	} else {
		fullPos = ['right', 'up', 'down'];
	}

	let pos = fullPos.filter(el => el !== filter1).filter(el => el !== filter2);
	let newpos = pos[Math.floor(Math.random() * pos.length)];

	return newpos
}



function init() {
	document.querySelector('.canvas-container').style.background = bgColor;
	canvas = document.getElementById('elcanvas');
	canvas.style.background = bgColor;

	canvas.width = document.body.offsetHeight;
	canvas.height = document.body.offsetHeight;

	if (xRandom) {
		lineGap = Number((canvas.width / (lineCount + 1)).toFixed(0));
	} else {
		lineGap = Number((canvas.height / (lineCount + 1)).toFixed(0));
	}
	
	getRandomStart(lineCount, lineGap);
}


function getRandomStart(lineCount, lineGap) {

	let coords = [];

	for (let n = lineCount/2-lineCount/3; n < lineCount-lineCount/3; n += 1) {
		coords.push(lineGap * (n + 1));
	}

	let randomPos = coords[Math.floor(Math.random() * coords.length)];

	if (xRandom) {
		x = randomPos;
	} else {
		y = randomPos;
	}
	makePath()
}


function makePath() {

	let path = [];

	for (let n = 0; n < steps - 1; n++) {

		let newPos = randomPos();

		let prevPos = path[path.length - 1]

		if ((newPos === "up" && prevPos === "down")
			|| (newPos === "down" && prevPos === "up")
			|| (newPos === "right" && prevPos === "left")
			|| (newPos === "left" && prevPos === "right")
		) {

			newPos = randomPos(newPos);
		}

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
						if (path[u-1] === "down" || path[u-1] === "left" || path[u-1] === "right" || path[u-1] === undefined) {
							path[u] = randomPos(path[u]);
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

	let ctx = canvas.getContext("2d");
	ctx.fillStyle = fillColor;

	let tree = new Image();
	tree.src = "pine.svg";

	tree.onload = () => {

		if (xRandom) {
			for (let u = 0; u < x; u += lineGap) {
				for(let n = 0; n < canvas.height; n += lineGap) {
					let xInc = 0;
					if (n % 2 === 0) {
						xInc = lineGap/2;
					} 
					ctx.beginPath();
					ctx.arc(u + lineGap / 2 + dotRadius / 2 + xInc, n + treeHeight*1.5 - dotRadius, dotRadius, 0, 2 * Math.PI);
					ctx.fill();
				}
			}
		}

		path.forEach((v, i, a) => {
			ctx.fillStyle = fillColor;

			if (v !== "down" && v !== "up" && v !== "left") {
				for (let u = y; u < canvas.height; u += lineGap) {

					let xInc = 0;
					if (u % 2 === 0) {
						xInc = lineGap/2;
					} 

					ctx.beginPath();
					ctx.arc(x + lineGap / 2 + dotRadius / 2 + xInc, u + treeHeight*1.5 - dotRadius, dotRadius, 0, 2 * Math.PI);
					ctx.fill();
				}
				for (let u = 0; u < y; u += lineGap) {

					let xInc = 0;
					if (u % 2 === 0) {
						xInc = lineGap/2;
					} 
					
					ctx.drawImage(tree, x + (lineGap / 2 - treeWidth / 2) + xInc, u + treeHeight/2, treeWidth, treeHeight);
					
				}
			}

			if (v === "left") {
				let xInc = 0;
				if (y % 2 === 0) {
					xInc = lineGap/2;
				} 
				ctx.fillStyle = bgColor;
				ctx.beginPath();
				ctx.fillRect(x - lineGap - dotRadius / 2 + xInc, y + treeHeight - 1, lineGap, lineGap/2);
				ctx.drawImage(tree, x + (lineGap / 2 - treeWidth / 2) - lineGap + xInc, y + treeHeight/2, treeWidth, treeHeight);
			}

			if (v === "right") {
				x += lineGap;
			}
			
			if (v === "down") {
				y += lineGap;
			}
			if (v === "up") {
				y -= lineGap;
			}

		})
	}

	canvas.style.display = "block";
}

