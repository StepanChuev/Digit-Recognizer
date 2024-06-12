'use strict';

import Perceptron from './perceptron.mjs';
import fs from 'node:fs/promises';

const main = async () => {
	const trainFilePath = "../dataset/mnist_train_translated.csv";
	const testFilePath = "../dataset/mnist_test_translated.csv";
	const weightsFilePath = "../dataset/weights.json";
	const trainFile = await fs.open(trainFilePath);
	let trainingData = [];

	for await (let line of trainFile.readLines()){
		let data = line.split(",");

		trainingData.push([+data[0], []]);

		for (let i = 1; i < data.length; i++){
			trainingData[trainingData.length - 1][1].push(+data[i]);
		}
	}

	trainFile.close();

	console.log("File has been read");

	const perceptron = new Perceptron(trainingData, 0.2, 50);

	perceptron.initWeights();

	perceptron.train();

	console.log("Perceptron has been trained");

	trainingData = [];
	const testFile = await fs.open(testFilePath);

	for await (let line of testFile.readLines()){
		let data = line.split(",");

		trainingData.push([+data[0], []]);

		for (let i = 1; i < data.length; i++){
			trainingData[trainingData.length - 1][1].push(+data[i]);
		}
	}

	testFile.close();

	let amountRight = 0;
	let result = 0;

	for (let i = 0; i < trainingData.length; i++){
		result = perceptron.getResult(trainingData[i][1]);
		amountRight += (result === trainingData[i][0]);
	}

	console.log(`Accuracy ${100 * amountRight / trainingData.length}% (${amountRight}/${trainingData.length})`);


	await fs.writeFile(weightsFilePath, "{\n\"hiddenWeights\":" + JSON.stringify(perceptron.hiddenWeights) + ",\n", err => console.log(err));
	await fs.writeFile(weightsFilePath, "\"outputWeights\":" + JSON.stringify(perceptron.outputWeights) + "\n}", { flag: "a" }, err => console.log(err));
};

main();
