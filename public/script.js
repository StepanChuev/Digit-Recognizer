'use strict';

import Perceptron from "../src/perceptron.mjs";

const paintGrid = (context, fieldSize, ceilSize) => {
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

const paintSquare = (context, offsetX, offsetY, ceilSize, sizePen = 1) => {
	let i = Math.floor(offsetY / ceilSize);
	let j = Math.floor(offsetX / ceilSize);

	context.beginPath();
	context.rect(j * ceilSize, i * ceilSize, ceilSize * sizePen, ceilSize * sizePen);
	context.fill();
};

const changeCeils = (context, offsetX, offsetY, ceilSize, ceils, sizePen = 1) => {
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

const recognizeDigit = (perceptron, ceils) => {
	const data = ceils.flat();

	return perceptron.getResult(data);
};

const createMatrix = (width, height, value) => {
	const mtr = [];

	for (let i = 0; i < width; i++){
		mtr.push([]);

		for (let j = 0; j < height; j++){
			mtr[i].push(value);
		}
	}

	return mtr;
};


const main = async () => {
	const canvas = document.querySelector('.canvas');
	const context = canvas.getContext("2d");
	const ceilSize = 20;
	const fieldSize = 28;

	canvas.width = fieldSize * ceilSize;
	canvas.height = fieldSize * ceilSize;
	context.fillStyle = "#000";
	context.strokeStyle = "#808080";

	const weightsResponse = await fetch("../dataset/weights.json");
	const weights = await weightsResponse.json();
	const perceptron = new Perceptron([], 0, 0);
	perceptron.hiddenWeights = weights.hiddenWeights;
	perceptron.outputWeights = weights.outputWeights;

	const recognizeBtn = document.querySelector('.recognize');
	const clearBtn = document.querySelector('.clear');

	let ceils = createMatrix(fieldSize, fieldSize, 0);
	let sizePen = 2;
	let isMousedown = false;

	paintGrid(context, fieldSize, ceilSize);

	canvas.addEventListener("mousedown", (event) => {
		paintSquare(context, event.offsetX, event.offsetY, ceilSize, sizePen);
		changeCeils(context, event.offsetX, event.offsetY, ceilSize, ceils, sizePen);

		isMousedown = true;
	});

	window.addEventListener("mouseup", () => isMousedown = false);

	canvas.addEventListener("mousemove", (event) => {
		if (!isMousedown){
			return;
		}

		paintSquare(context, event.offsetX, event.offsetY, ceilSize, sizePen);
		changeCeils(context, event.offsetX, event.offsetY, ceilSize, ceils, sizePen);
	});

	recognizeBtn.addEventListener("click", () => {
		console.log(recognizeDigit(perceptron, ceils));
		console.log(perceptron);
	});

	clearBtn.addEventListener("click", () => {
		context.clearRect(0, 0, canvas.width, canvas.height);
		paintGrid(context, fieldSize, ceilSize);
		ceils = createMatrix(fieldSize, fieldSize, 0);
		perceptron.hiddenNeurons = new Array(perceptron.hiddenNeurons.length).fill(0);
		perceptron.outputNeurons = new Array(perceptron.outputNeurons.length).fill(0);
	});
};


main();
