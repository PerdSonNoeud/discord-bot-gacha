const { getRandomInt, isEmpty } = require('../config/utility.js');
const { importStats, saveStats } = require('../config/parser.js');


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
		const data = importStats('template');
		if (isEmpty(data)) {
			console.log('Error: Stats imported are empty.');
			return;
		}
		saveStats(data, this.discord_id);
		console.log(`Save file created successfully for ${this}`);
	}

	importUser() {
		const data = importStats(this.discord_id);
		// Checks if the data were imported successfully
		if (isEmpty(data)) {
			console.log('Error: Stats imported are empty.');
			return;
		}
		this.pity = data.pity;
		this.bag = data.bag;

		console.log(`Save file imported successfully for ${this}`);
	}

	updateUser() {
		const data = {
			'pity': this.pity,
			'bag': this.bag,
			'board': [
				[null, null, null],
				[null, null, null],
				[null, null, null],
			],
		};
		saveStats(data, this.discord_id);

		console.log(`Save file saved successfully for ${this}`);
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
