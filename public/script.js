'use strict';

const paintGrid = () => {
	for (let i = 0; i < fieldSize; i++){
		context.beginPath();
		context.moveTo(ceilSize * i, 0);
		context.lineTo(ceilSize * i, fieldSize * ceilSize);
		context.stroke();

		context.beginPath();
		context.moveTo(0, ceilSize * i);
		context.lineTo(fieldSize * ceilSize, ceilSize * i);
		context.stroke();
	}
};

const paintSquare = (offsetX, offsetY) => {
	let i = Math.floor(offsetY / ceilSize);
	let j = Math.floor(offsetX / ceilSize);

	context.beginPath();
	context.rect(j * ceilSize, i * ceilSize, ceilSize * sizePen, ceilSize * sizePen);
	context.fill();
};

const changeCeils = (offsetX, offsetY) => {
	let begini = Math.floor(offsetY / ceilSize);
	let beginj = Math.floor(offsetX / ceilSize);
	let i = 0;
	let j = 0;

	while (i < sizePen && i + begini < ceils.length){
		j = 0;

		while (j < sizePen && j + beginj < ceils[i].length){
			ceils[i + begini][j + beginj] = 1;
			j++;
		}

		i++;
	}
};

const canvas = document.querySelector('.canvas');
const context = canvas.getContext("2d");
const ceilSize = 20;
const fieldSize = 28;

canvas.width = fieldSize * ceilSize;
canvas.height = fieldSize * ceilSize;
context.fillStyle = "#000";
context.strokeStyle = "#808080";

const ceils = [];
let sizePen = 2;
let isMousedown = false;

for (let i = 0; i < fieldSize; i++){
	ceils.push([]);

	for (let j = 0; j < fieldSize; j++){
		ceils[i].push(0);
	}
}

paintGrid();

canvas.addEventListener("mousedown", (event) => {
	paintSquare(event.offsetX, event.offsetY);
	changeCeils(event.offsetX, event.offsetY);

	isMousedown = true;
});

window.addEventListener("mouseup", () => isMousedown = false);

canvas.addEventListener("mousemove", (event) => {
	if (!isMousedown){
		return;
	}

	paintSquare(event.offsetX, event.offsetY);
	changeCeils(event.offsetX, event.offsetY);
});