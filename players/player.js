const { getRandomInt, getWeightedChoice, isEmpty } = require('../config/utility.js');
const { importInv, importStats, saveInv,
	saveStats } = require('../config/parser.js');


function getPlayer(user) {
	// Assuming the user already has an account
	let player = Player.players.find(i => i.discord_id === user.id);
	if (!player) {
		// User not loaded
		player = new Player(user);
		player.importUser();
		Player.players.push(player);
	}
	return player;
}


class Player {
	static PITY_5 = 50;
	static PITY_4 = 10;
	static players = [];

	constructor(user) {
		// Discord info
		this.discord_id = user.id;
		this.discord_name = user.displayName;
		this.discord_avatar = user.avatar;

		// Inventory
		this.inventory = {};

		// Daily
		this.lastClaim = null;

		// Rarity pity [5 stars, 4 stars]
		this.pity = [0, 0];
		// Currencies
		this.bag = {
			'coins': 0,
			'gems': 0,
			'tickets': 1,
		};
	}

	// ///////////////
	//             //
	//  Save file  //
	//             //
	// ///////////////

	createUser() {
		// Import Stats
		const data_stats = importStats('template');
		if (isEmpty(data_stats)) {
			console.error('Error: Stats imported are empty.');
			return;
		}
		saveStats(data_stats, this.discord_id);
		// Import Inventory
		const data_inv = importInv('template');
		if (isEmpty(data_inv)) {
			console.error('Error: Inventory imported is empty');
		}
		saveInv(data_inv, this.discord_id);

		this.importUser();
		console.error(`Save file created successfully for ${this}`);
	}

	importUser() {
		const data_stats = importStats(this.discord_id);
		// Checks if the data were imported successfully
		if (isEmpty(data_stats)) {
			console.error('Error: Stats imported are empty.');
			return;
		}
		const data_inv = importInv(this.discord_id);
		// Checks if the data were imported successfully
		if (isEmpty(data_inv)) {
			console.error('Error: Inventory imported is empty.');
			return;
		}
		this.pity = data_stats.pity;
		this.bag = data_stats.bag;
		this.inventory = data_inv;

		console.log(`Save file imported successfully for ${this}`);
	}

	updateUser() {
		const data_stats = {
			'pity': this.pity,
			'bag': this.bag,
			'board': [
				[null, null, null],
				[null, null, null],
				[null, null, null],
			],
		};
		saveStats(data_stats, this.discord_id);
		saveInv(this.inventory, this.discord_id);

		console.log(`Save file saved successfully for ${this}`);
	}

	// ///////////////
	//             //
	//  Inventory  //
	//             //
	// ///////////////

	getTotal() {
		const result = [0, 0, 0, this.inventory['0']];
		for (const c_id in this.inventory) {
			const id = Math.floor(Number(c_id));
			result[0] += this.inventory[c_id];
			if ([1, 2, 3].includes(id % 10)) {
				result[1] += this.inventory[c_id];
			}
		}
		result[2] = result[0] - (result[1] + result[3]);
		return result;
	}

	getUnique() {
		// TODO: Do something for the 3 stars (items)
		const result = [0, 0, 1];
		for (const c_id in this.inventory) {
			const id = Math.floor(Number(c_id));
			if ([1, 2, 3].includes(id % 10)) {
				result[0]++;
			}
			else if (![1, 2, 3].includes(id % 10)) {
				result[1]++;
			}
		}
		return result;
	}

	// //////////////////
	//                //
	//  Daily Reward  //
	//                //
	// //////////////////

	canClaimReward() {
		if (!this.lastClaim) {
			this.lastClaim = Date.now();
			return true;
		}

		const now = Date.now();
		const hoursPassed = (now - this.lastClaim) / (1000 * 60 * 60);

		return hoursPassed >= 24;
	}

	claimDailyReward() {
		// Give daily reward
		this.bag.coins += getRandomInt(500, 1000);
		this.bag.gems += getRandomInt(50, 100);
		this.bag.tickets++;

	  // Save timestamp of last claim
		this.lastClaim = Date.now();

		this.updateUser();
	}

	// //////////////////
	//                //
	//  Gacha stuffs  //
	//                //
	// //////////////////

	getRandomRarity() {
		this.pity[0]++;
		if (this.pity[0] >= Player.PITY_5) {
			this.pity[0] = 0;
			return 5;
		}
		this.pity[1]++;
		if (this.pity[1] >= Player.PITY_4) {
			this.pity[1] = 0;
			return 4;
		}
		return getWeightedChoice({ 3: 70, 4: 25, 5: 5 });
	}

	// ///////////////
	//             //
	//  Utilities  //
	//             //
	// ///////////////

	toString() {
		return `${this.discord_name} (${this.discord_id})`;
	}
}

module.exports = { getPlayer, Player };
