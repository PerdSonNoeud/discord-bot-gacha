const { getRandomInt, isEmpty } = require('../config/utility.js');
const { importStats } = require('../config/parser.js');

class Player {
	static PITY_5 = 50;
	static PITY_4 = 10;

	constructor(user) {
		// Discord info
		this.discord_id = user.id;
		this.discord_name = user.displayName;
		this.discord_avatar = user.avatar;

		// Daily
		this.lastClaim = null;

		// Currencies
		this.coins = 0;
		this.gems = 0;
		this.tickets = 0;

		// Rarity pity [5 stars, 4 stars]
		this.pity = [0, 0];
	}

	// ///////////////
	//             //
	//  Save file  //
	//             //
	// ///////////////

	// TODO: Complete the functions

	createUser() {
		console.log('Save file created successfully for user : ${this.discord_id}');
	}

	importUser() {
		const data = importStats(this.discord_id);
		// Checks if the data were imported successfully
		if (isEmpty(data)) {
			console.log('Error: Stats imported are empty.');
			return;
		}

		this.pity[0] = data.pity[0];
		this.pity[1] = data.pity[1];

		this.coins = data.bag.coins;
		this.gems = data.bag.gems;
		this.tickets = data.bag.tickets;

		console.log('Save file imported successfully for user : ${this.discord_id}');
	}

	updateUser() {
		console.log('Save file updated successfully for user : ${this.discord_id}');
	}

	// //////////////////
	//                //
	//  Daily Reward  //
	//                //
	// //////////////////

	canClaimReward() {
		if (!this.lastClaim) return true;

		const now = Date.now();
		const hoursPassed = (now - this.lastClaim) / (1000 * 60 * 60);

		return hoursPassed >= 24;
	}

	claimDailyReward() {
		// If the daily reward was already claimed, return false
		if (!this.canClaimReward()) {
			console.log('${this.toString()} already claimed his daily reward.');
			return false;
		}

		// Give daily reward
		this.coins += getRandomInt(500, 1000);
		this.gems += getRandomInt(50, 100);
		this.tickets++;

		return true;
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

	toSstring() {
		return '${this.discord_name} (${this.discord_id})';
	}
}

module.exports = Player;
