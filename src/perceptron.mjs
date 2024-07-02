'use strict';

import { randomInt } from './module.mjs';

class Perceptron {
	#amountHiddenNeurons; #amountOutputNeurons;

	constructor(trainingData, lr, epoch){
		this.#amountHiddenNeurons = 28;
		this.#amountOutputNeurons = 10;

		this.trainingData = trainingData;
		this.hiddenWeights = new Array(this.#amountHiddenNeurons);
		this.outputWeights = new Array(this.#amountOutputNeurons);
		this.hiddenNeurons = new Array(this.#amountHiddenNeurons);
		this.outputNeurons = new Array(this.#amountOutputNeurons);
		this.lr = lr;
		this.epoch = epoch;
	}

	activate(neuron){
		return 1 / (1 + Math.exp(-neuron));
	}

	initWeights(){
		for (let i = 0; i < this.hiddenWeights.length; i++){
			this.hiddenWeights[i] = new Array(this.trainingData[0][1].length);

			for (let j = 0; j < this.hiddenWeights[i].length; j++){
				this.hiddenWeights[i][j] = randomInt(-9999999, 9999999) / 1e7;
			}
		}

		for (let i = 0; i < this.outputWeights.length; i++){
			this.outputWeights[i] = new Array(this.#amountHiddenNeurons);

			for (let j = 0; j < this.outputWeights[i].length; j++){
				this.outputWeights[i][j] = randomInt(-9999999, 9999999) / 1e7;
			}
		}
	}

	rightProp(layer, weights, bias = 0){
		let result = 0;

		for (let i = 0; i < layer.length; i++){
			result += layer[i] * weights[i];
		}

		return result + bias;
	}

	getResult(data){
		let result = 0, maxValue = 0;

		this.calculateLayer(data, this.hiddenNeurons, this.hiddenWeights);

		for (let i = 0; i < this.outputNeurons.length; i++){
			this.outputNeurons[i] = this.activate(this.rightProp(this.hiddenNeurons, this.outputWeights[i]));

			if (this.outputNeurons[i] > maxValue){
				maxValue = this.outputNeurons[i];
				result = i;
			}
		}

		return result;
	}

	calculateLayer(input, layer, weights){
		for (let i = 0; i < layer.length; i++){
			layer[i] = this.activate(this.rightProp(input, weights[i]));
		}
	}

	changeWeights(input, output, weights, errors){
		for (let i = 0; i < weights.length; i++){
			for (let j = 0; j < weights[i].length; j++){
				weights[i][j] += this.lr * errors[i] * input[j] * output[i] * (1 - output[i]);
			}
		}
	}

	train(){
		const errorsHidden = new Array(this.#amountHiddenNeurons);
		const errorsOutput = new Array(this.#amountOutputNeurons);

		for (let i = 0; i < this.epoch; i++){
			for (let j = 0; j < this.trainingData.length; j++){
				errorsHidden.fill(0);
				errorsOutput.fill(0);

				this.calculateLayer(this.trainingData[j][1], this.hiddenNeurons, this.hiddenWeights);
				this.calculateLayer(this.hiddenNeurons, this.outputNeurons, this.outputWeights);

				for (let k = 0; k < this.outputNeurons.length; k++){
					errorsOutput[k] = (this.trainingData[j][0] === k) - this.outputNeurons[k];
					
					for (let l = 0; l < errorsHidden.length; l++){
						errorsHidden[l] += errorsOutput[k] * this.outputWeights[k][l];
					}
				}

				this.changeWeights(this.hiddenNeurons, this.outputNeurons, this.outputWeights, errorsOutput);
				this.changeWeights(this.trainingData[j][1], this.hiddenNeurons, this.hiddenWeights, errorsHidden);
			}
		}
	}
}

export default Perceptron;
