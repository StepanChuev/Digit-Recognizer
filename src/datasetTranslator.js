'use strict';

import { readConfig } from './module.mjs';
import fs from 'node:fs/promises';

const config = await readConfig("./config.json");
const translateFilePath = config["translate_file"];
const translatedFilePath = config["translated_file"];

const main = async () => {
	const origFile = await fs.open(translateFilePath);

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
