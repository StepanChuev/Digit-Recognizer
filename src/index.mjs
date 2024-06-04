'use strict';

import Perceptron from './perceptron.mjs';
import fs from 'node:fs/promises';

const filePath = "../dataset/mnist_test_translated.csv";

const main = async () => {
	const trainingData = [];
	const file = await fs.open(filePath);

	for await (let line of file.readLines()){
		let data = line.split(",");

		trainingData.push([+data[0], []]);

		for (let i = 1; i < data.length; i++){
			trainingData[trainingData.length - 1][1].push(+data[i]);
		}
	}

	file.close();

	console.log("File has been read");

	const perceptron = new Perceptron(trainingData, 0.1, 50);

	perceptron.initWeights();

	perceptron.train();

	console.log("Perceptron has been trained");

	let amountRight = 0;
	let result = 0;

	for (let i = 0; i < trainingData.length; i++){
		result = perceptron.getResult(trainingData[i][1]);
		amountRight += (result === trainingData[i][0]);
	}

	console.log(`Accuracy ${100 * amountRight / trainingData.length}% (${amountRight}/${trainingData.length})`);
};

main();