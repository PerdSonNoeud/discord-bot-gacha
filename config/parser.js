const fs = require ('node:fs');

const stats = './assets/users/stats/';
const inv = './assets/users/inventories/';

function fileExists(filepath) {
	return fs.existsSync(filepath);
}

function playerExists(userID) {
	return fileExists(`./assets/users/stats/${userID}.json`);
}

// Function that gets the file given in argument, returns {} if nothing is found.
function parseFile(filepath) {
	try {
		const file = fs.readFileSync(filepath, 'utf8');
		return JSON.parse(file);
	}
	catch {
		console.error(`File not found at ${filepath}`);
		return {};
	}
}

// Function that gets info from banners from "./assets/portals/banners.json"
function parseBanners(filepath) {
	return parseFile(filepath);
}

// Function that imports the stats of the user given in argument.
function importStats(userID) {
	const filepath = `${stats}${userID}.json`;
	return parseFile(filepath);
}

// Function that imports the inventory of the user given in argument.
function importInv(userID) {
	const filepath = `${inv}${userID}.json`;
	return parseFile(filepath);
}

// Function that saves the stats of the user given in argument.
function saveStats(data, userID) {
	console.log(data);
	const jsonData = JSON.stringify(data, null, 2);
	fs.writeFile(`${stats}${userID}.json`, jsonData, (err) => {
		if (err) {
			console.error('Error while writing files: ', err);
			return;
		}
		console.log('File written successfully.');
	});
}

// Function that saves the inventory of the user given in argument.
function saveInv(data, userID) {
	const jsonData = JSON.stringify(data, null, 2);
	fs.writeFile(`${inv}${userID}.json`, jsonData, (err) => {
		if (err) {
			console.error('Error while writing files: ', err);
			return;
		}
		console.log('File written successfully.');
	});
}

module.exports = { importInv, importStats, parseBanners, playerExists, saveInv, saveStats };
