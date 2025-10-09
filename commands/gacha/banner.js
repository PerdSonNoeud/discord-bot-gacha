const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { bannerCount, bannerExists, getBannerCode, getBannerImage,
	getBannerName, listBannerCharacters } = require('../../banners/banner.js');
const { parseBanners } = require('../../config/parser.js');
const { getIcon, pagination, setupEmbed } = require('../../config/utility.js');

function bannerEmbed(banner_id, user, client) {
	const banners = parseBanners('./assets/banners/banners.json');
	const prices = (
		`\`- Invocation simple : 10 gemmes ${getIcon('gems')}\`\n` +
    `\`- Invocation multiple : 100 gemmes ${getIcon('gems')}/` +
    `${getIcon('tickets')} 1 ticket\``
	);
	const characters = {
		name: 'Personnages disponibles :',
		value: 'Aucun personnage disponible pour le moment.',
	};
	if (bannerExists(banners, banner_id)) {
		characters.value = listBannerCharacters(client, banners, banner_id);
	}
	const embed = new EmbedBuilder()
		.setTitle(
			`Bannière \`${getBannerName(banners, banner_id)}\` (${banner_id}/${bannerCount})`,
		)
		.setDescription(`__Code de la bannière :__ \`${getBannerCode(banners, banner_id)}\``)
		.addFields({ name: 'Prix des invocations :', value: prices }, characters)
		.setImage(getBannerImage(banners, banner_id));
	setupEmbed(user, client, embed);

	return embed;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('banner')
		.setDescription('Affiche les bannières disponibles.')
		.addNumberOption(option =>
			option
				.setName('banner_id')
				.setDescription('Numéro de la bannière à afficher')
				.setRequired(false)
				.setMinValue(1)
				.setMaxValue(bannerCount + 1),
		),
	async execute(interaction) {
		const pages = [];
		const current = interaction.options.getNumber('banner_id') ?? 1;
		for (let i = 1; i <= bannerCount; i++) {
			pages.push(bannerEmbed(i, interaction.user, interaction.client));
		}

		pagination(interaction, pages, current - 1);
	},
};
