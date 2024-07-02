'use strict';

const http = require("http");
const fs = require("fs");
const path = require("path");
const port = 3500;

const mimeTypes = {
	".html": "text/html",
	".js": "text/javascript",
	".css": "text/css",
	".json": "application/json",
	".png": "image/png",
	".jpg": "image/jpg",
	".webp": "image/webp",
	".gif": "image/gif",
	".svg": "image/svg+xml",
	".wav": "audio/wav",
	".mp4": "video/mp4",
	".woff": "application/font-woff",
	".ttf": "application/font-ttf",
	".eot": "application/vnd.ms-fontobject",
	".otf": "application/font-otf",
	".wasm": "application/wasm"
};

const staticFile = (response, filePath, extension) => {
	response.setHeader("Content-Type", mimeTypes[extension]);

	fs.readFile(filePath, (err, data) => {
		if (err){
			response.statusCode = 404;
			response.end();
		}

		response.end(data);
	});
};

const writeDigitToFile = async (path, digit, ceils) => {
	await fs.writeFile(path, `${digit},${ceils.toString()}\n`, { flag: "a" }, err => {
		console.log(err);
	});
};

http.createServer((request, response) => {
	const url = request.url;

	console.log(url);

	switch (url) {
		case "/":
			staticFile(response, "../public/index.html", ".html");
			break;

		case "/script.js":
			staticFile(response, "../public/script.js", ".js");
			break;

		case "/src/perceptron.mjs":
			staticFile(response, "./perceptron.mjs", ".js");
			break;

		case "/src/module.mjs":
			staticFile(response, "./module.mjs", ".js");
			break;

		case "/dataset/weights.json":
			staticFile(response, "../dataset/weights.json", ".json");
			break;

		case "/dataset/user_train.csv":
			const chunks = [];

			request.on("data", chunk => {
				chunks.push(chunk);
			});

			request.on("error", err => {
				console.log(err);
			});

			request.on("end", async () => {
				const body = Buffer.concat(chunks);
				const data = JSON.parse(body.toString());

				console.log(+data.digit);

				await writeDigitToFile("../dataset/user_train.csv", data.digit, data.ceils);
			});

			response.end();

			break;

		default:
			const extname = path.extname(url).toString().toLocaleLowerCase();

			console.log("undefined page");

			if (mimeTypes.hasOwnProperty(extname)){
				staticFile(response, url, extname);
			}

			else {
				response.statusCode = 404;
				response.end();
			}
	}
}).listen(port);
