const { EmbedBuilder, MessageFlags, SlashCommandBuilder } = require('discord.js');
const { playerExists } = require('../../config/parser.js');
const { getIcon, setupEmbed } = require('../../config/utility.js');
const { getPlayer } = require('../../players/player.js');

function dailyReward(player, user, client) {
	const prev_coins = player.bag.coins;
	const prev_gems = player.bag.gems;

	player.claimDailyReward();

	const coins = player.bag.coins - prev_coins;
	const gems = player.bag.gems - prev_gems;
	const text = (
		'Récompense journalière obtenue ! ' +
    'À demain pour de nouvelles récompenses !\n' +
    `- + ${getIcon('gems')} ${gems} gemmes.\n` +
    `- + ${getIcon('coins')} ${coins} golds.\n` +
    `- + ${getIcon('tickets')} 1 ticket.`
	);

	const emb = new EmbedBuilder()
		.setTitle('Récompense journalière')
		.addFields({ name:'', value:text });
	setupEmbed(user, client, emb);

	return emb;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('daily')
		.setDescription('Récupérer les récompenses journalière.'),

	async execute(interaction) {
		const user = interaction.user;
		// Check if the user has an account.
		if (!playerExists(user.id)) {
			console.log(`${user.displayName} has no account.`);
			const content = 'Vous n\'avez pas encore de compte';
			await interaction.reply({
				content: content,
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const player = getPlayer(interaction.user);
		// Check if daily reward was already claimed.
		if (!player.canClaimReward()) {
			console.log(`${user.displayName} has already claimed the daily reward.`);
			const content = 'Récompense journalière déjà récupérée.';
			await interaction.reply({
				content: content,
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const emb = dailyReward(player, user, interaction.client);
		await interaction.reply({ embeds: [emb] });
		console.log(`${user.displayName} claimed daily reward.`);
	},
};
