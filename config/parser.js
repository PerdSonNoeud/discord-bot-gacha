const fs = require ('node:fs');

// Function that gets the file given in argument, returns {} if nothing is found.
function parseFile(filepath) {
	try {
		const file = fs.readFileSync(filepath, 'utf8');
		return JSON.parse(file);
	}
	catch {
		console.log(`File not found at ${filepath}`);
		return {};
	}
}

// Function that gets info from banners from "./assets/portals/banners.json"
function parseBanners(filepath) {
	return parseFile(filepath);
}

// Function that import the stats of the user given in argument.
function importStats(userID) {
	const filepath = `./assets/users/stats/${userID}.json`;
	return parseFile(filepath);
}

// Function that import the inventory of the user given in argument.
function importInv(userID) {
	const filepath = `./assets/users/inventory/${userID}.json`;
	return parseFile(filepath);
}

module.exports = { importInv, importStats, parseBanners };
