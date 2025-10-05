const { MessageFlags, EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { rarityToString } = require('../../characters/character.js');
const { getPlayer, Player } = require('../../players/player.js');
const { playerExists } = require('../../config/parser.js');
const { getIcon, pagination, setupEmbed } = require('../../config/utility.js');


function firstPage(player, user, client) {
	const total = player.getTotal();
	const percents = ['0.00', '0.00', '0.00'];
	const unique = player.getUnique();

	if (total[0] != 0) {
		percents[0] = String((total[1] / total[0] * 100).toFixed(2)).padStart(5, '0');
		percents[1] = String((total[2] / total[0] * 100).toFixed(2)).padStart(5, '0');
		percents[2] = String((total[3] / total[0] * 100).toFixed(2)).padStart(5, '0');
	}

	let width = Math.max(...total.slice(1, 4).map(n => String(n).length));
	const totalText = (
		`Nombre d'invocations: **${total[0]}**
    ${rarityToString(5)}: **\`${String(total[1]).padStart(width, '0')}\`** \`(${percents[0]}%)\`
    ${rarityToString(4)}: **\`${String(total[2]).padStart(width, '0')}\`** \`(${percents[1]}%)\`
    ${rarityToString(3)}: **\`${String(total[3]).padStart(width, '0')}\`** \`(${percents[2]}%)\``
	);

	width = Math.max(...unique.map(n => String(n).length));
	const uniqueText = (`
    ${rarityToString(5)}: **\`${String(unique[0]).padStart(width, '0')}\`**
    ${rarityToString(4)}: **\`${String(unique[1]).padStart(width, '0')}\`**
    ${rarityToString(3)}: **\`${String(unique[2]).padStart(width, '0')}\`**
    (Objets non implémentés)`
	);

	const bagText = (
		`${getIcon('coins')} - **${player.bag.coins}** pièce${(player.bag.coins > 0) ? 's' : ''}
    ${getIcon('gems')} - **${player.bag.gems}** gemme${(player.bag.gems > 0) ? 's' : ''}
    ${getIcon('tickets')} - **${player.bag.tickets}** ticket${(player.bag.tickets > 0) ? 's' : ''}`
	);

	const embed = new EmbedBuilder()
		.setTitle('Statistiques')
		.addFields(
			{ name: 'Invocations :', value: totalText },
			{ name: 'Personnages uniques :', value: uniqueText },
			{ name: 'Inventaire :', value: bagText },
		);
	setupEmbed(user, client, embed);
	return embed;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Affiche le profile d\'un utilisateur.')
		.addSubcommand(sub => sub
			.setName('create')
			.setDescription('Créer un compte.'),
		)
		.addSubcommand(sub => sub
			.setName('stats')
			.setDescription('Affiche les statistiques d\'un utilisateur.')
			.addUserOption(opt => opt
				.setName('target')
				.setDescription('Profile à afficher (laisser vide pour afficher le votre).'),
			),
		),

	async execute(interaction) {
		const sub = interaction.options.getSubcommand();
		let user;
		if (sub === 'create') {
			user = interaction.user;
			if (playerExists(user.id)) {
				console.log(`${user.displayName} already has an account.`);
				await interaction.reply({
					content: 'Vous avez déjà un compte.',
					flags: MessageFlags.Ephemeral,
				});
				return;
			}
			const player = Player(user);
			player.createUser();
			Player.player.push(player);
		  await interaction.reply('Compte créé avec succès.');
		}
		else if (sub === 'stats') {
			user = interaction.options.getUser('target');
			// If no user were given, set as the one who used the command
			if (!user) user = interaction.user;

			// Checks if the user we're searching for has an account
			if (!playerExists(user.id)) {
				console.log(`${user.displayName} has no account.`);
				let content = 'Vous n\'avez pas encore de compte';
				if (interaction.options.getUser('target')) {
					content = (
						'L\'utilisateur que vous cherchez ' +
            'n\'a pas encore de compte.'
					);
				}
				await interaction.reply({
					content: content,
					flags: MessageFlags.Ephemeral,
				});
				return;
			}

			const pages = [];

			const player = getPlayer(user);
			pages.push(firstPage(player, user, interaction.client));

			for (let i = 0; i < pages.length; i++) {
				pages[i].setThumbnail(`${interaction.guild.iconURL()}?size=4096`);
			}

			// TODO: Create the pages for the inventory once added.
			pagination(interaction, pages);
		}
	},
};
