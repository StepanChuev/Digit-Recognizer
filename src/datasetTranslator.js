'use strict';

const fs = require('node:fs/promises');

const originalFilePath = "../dataset/mnist_test.csv";
const translatedFilePath = "../dataset/mnist_test_translated.csv";

const main = async () => {
	const origFile = await fs.open(originalFilePath);

	await fs.writeFile(translatedFilePath, "", err => console.log(err));

	let isFirst = true;

	for await (let line of origFile.readLines()){
		if (isFirst){
			isFirst = false;
			continue;
		}

		let data = line.split(",");

		for (let i = 1; i < data.length; i++){
			data[i] = (+data[i]) / 255;
		}

		line = data.join(",");

		await fs.appendFile(translatedFilePath, line + "\n", (err) => console.log(err));
	}

	origFile.close();
};

main();