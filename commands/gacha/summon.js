const { EmbedBuilder, MessageFlags,
	SlashCommandBuilder } = require('discord.js');
const { characterToString } = require('../../characters/character.js');
const { parseBanners, playerExists } = require('../../config/parser.js');
const { getRandomChoice, pagination, setupEmbed } = require('../../config/utility.js');
const { getPlayer } = require('../../players/player.js');

function oneSummon(player, banner) {
	const randomRarity = player.getRandomRarity();
	// 3 stars rarity so it is an item
	if (randomRarity === 3) {
		// TODO: Need to add different items later
		return { id: 0, name: 'item', rarity: 3, desc: '' };
	}
	const possible = banner.characters.filter(c => c.rarity === randomRarity);
	return getRandomChoice(possible);
}

function tenSummon(player, banner) {
	const result = { maxRarity: 0, characters: [] };

	for (let i = 0; i < 10; i++) {
		const one = oneSummon(player, banner);
		if (one.rarity > result.maxRarity) {
			result.maxRarity = one.rarity;
		}
		result.characters.push(one);
	}

	return result;
}

function oneToEmbed(player, banner, character, user, client) {
	const emb = new EmbedBuilder()
		.setTitle(`Invocation sur \`${banner.name}\` :`)
		.setDescription(characterToString(character.name, character.rarity))
		.setThumbnail(banner.url);
	setupEmbed(user, client, emb);

	return emb;
}

function tenToEmbed(player, banner, summon, user, client) {
	const pages = [];
	const characters = summon.characters;
	for (let i = 0; i < characters.length; i++) {
		pages.push(oneToEmbed(player, banner, characters[i], user, client));
	}
	return pages;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('summon')
		.setDescription('Invoque dans la bannière de son choix.')
		.addSubcommand(sub => sub
			.setName('one')
			.setDescription('Invoque une fois dans la bannière de son choix.')
			.addStringOption(opt => opt
				.setName('id')
				.setDescription('Identifiant de la bannière (voir la commande "banner")')
				.setRequired(true),
			),
		)
		.addSubcommand(sub => sub
			.setName('ten')
			.setDescription('Invoque dix fois dans la bannière de son choix.')
			.addStringOption(opt => opt
				.setName('id')
				.setDescription('Identifiant de la bannière (voir la commande "banner")')
				.setRequired(true),
			),
		),

	async execute(interaction) {
		const user = interaction.user;
		// Check if the user has an account.
		if (!playerExists(user.id)) {
			console.error(`${user.displayName} has no account.`);
			const content = 'Vous n\'avez pas encore de compte.';
			await interaction.reply({
				content: content, flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const player = getPlayer(user);

		const banner_id = interaction.options.getString('id');
		if (!banner_id) {
			// Shouldn't happen because it is required but just in case
			console.error('Banner id wasn\'t given');
			const content = `Identifiant de bannière \`${banner_id}\` est requis.`;
			await interaction.reply({
				content: content, flags: MessageFlags.Ephemeral,
			});
			return;
		}
	  const banner = parseBanners().find(b => b.code === banner_id);
		if (!banner) {
			console.error(`Banner with id '${banner_id}' is unknown.`);
			const content = `Identifiant de bannière \`${banner_id}\` inconnu.`;
			await interaction.reply({
				content: content, flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const sub = interaction.options.getSubcommand();
		if (sub === 'one') {
			const character = oneSummon(player, banner);
			await interaction.reply({
				embeds: [oneToEmbed(player, banner, character, user, interaction.client)],
			});
			console.log(`${player} summoned one character.`);
			return;
		}
		else {
			const characters = tenSummon(player, banner);
			pagination(
				interaction,
				tenToEmbed(player, banner, characters, user, interaction.client),
			);
			console.log(`${player} summoned ten characters.`);
			return;
		}
	},
};
