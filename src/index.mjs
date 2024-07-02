'use strict';

import Perceptron from './perceptron.mjs';
import { randomInt, readConfig } from './module.mjs';
import fs from 'node:fs/promises';

const readTrainData = async (trainFilesPath) => {
	const trainData = [];

	for (let i = 0; i < trainFilesPath.length; i++){
		let file = await fs.open(trainFilesPath[i]);

		for await (let line of file.readLines()){
			let index = randomInt(0, trainData.length - 1);
			let data = line.split(",");

			trainData.splice(index, 0, [+data[0], []]);

			for (let j = 1; j < data.length; j++){
				trainData[index][1].push(+data[j]);
			}
		}

		file.close();
	}

	return trainData;
};

const readTestData = async (testFilesPath) => {
	const testData = [];

	for (let i = 0; i < testFilesPath.length; i++){
		let file = await fs.open(testFilesPath[i]);

		for await (let line of file.readLines()){
			let data = line.split(",");

			testData.push([+data[0], []]);

			for (let j = 1; j < data.length; j++){
				testData[testData.length - 1][1].push(+data[j]);
			}
		}

		file.close();
	}

	return testData;
};

const writeWeightsToFile = async (filePath, perceptron) => {
	await fs.writeFile(filePath, "{\n\"hiddenWeights\":" + JSON.stringify(perceptron.hiddenWeights) + ",\n", err => console.log(err));
	await fs.writeFile(filePath, "\"outputWeights\":" + JSON.stringify(perceptron.outputWeights) + "\n}", { flag: "a" }, err => console.log(err));
};

const main = async () => {
	const configFilePath = "./config.json";
	const config = await readConfig(configFilePath);
	const trainData = await readTrainData(config["train_files"]);
	const testData = await readTestData(config["test_files"]);

	console.log("Files has been read");

	const perceptron = new Perceptron(trainData, 0.2, 50);

	perceptron.initWeights();
	perceptron.train();
	console.log("Perceptron has been trained");

	let amountRight = 0;
	let result = 0;

	for (let i = 0; i < testData.length; i++){
		result = perceptron.getResult(testData[i][1]);
		amountRight += (result === testData[i][0]);
	}

	console.log(`Accuracy ${100 * amountRight / testData.length}% (${amountRight}/${testData.length})`);

	await writeWeightsToFile(config["weights_file"], perceptron);
	console.log("Weights has been wrote");
};

main();
