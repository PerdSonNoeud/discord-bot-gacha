const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// Return true if a obj is empty
function isEmpty(obj) {
	return Object.keys(obj).length === 0;
}

// Random integer between min and max (inclusive)
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Template of embed
function setupEmbed(user, client, embed) {
	embed.setColor(0xff0000)
		.setAuthor({ name: user.displayName, iconURL: user.displayAvatarURL() })
		.setFooter({ text: 'Gacha bot | 2025', iconURL: client.user.displayAvatarURL() });
}

// Function to setup pagination
async function pagination(interaction, pages, current) {
	// Buttons
	const prev = new ButtonBuilder()
		.setCustomId('prev')
		.setEmoji('◀️')
		.setDisabled(true)
		.setStyle(ButtonStyle.Primary);

	const next = new ButtonBuilder()
		.setCustomId('next')
		.setEmoji('▶️')
		.setStyle(ButtonStyle.Primary);

	const border = new ButtonBuilder()
		.setCustomId('border')
		.setEmoji('⏭️')
		.setStyle(ButtonStyle.Primary);

	const row = new ActionRowBuilder().addComponents(prev, next, border);

	const message = await interaction.reply({
		embeds: [pages[current]],
		components: [row],
	});

	const collector = message.createMessageComponentCollector({ time: 600000 });

	collector.on('collect', async i => {
		if (i.user.id !== interaction.user.id) {
			return i.reply({ content: 'These buttons aren\'t for you!', ephemeral: true });
		}

		if (i.customId === 'prev') {
			// Button prev pressed, we go back to the previous page
			current = current - 1;
		}
		else if (i.customId === 'next') {
			// Button next pressed, we go on to the next page
			current = current + 1;
		}
		else if (i.customId === 'border') {
			// Button border, if we are on the second half we go to the first page
			// Otherwise we go to the last page
			if (current >= Math.floor(pages.length / 2)) {
				current = 0;
			}
			else {
				current = pages.length - 1;
			}
		}

		prev.setDisabled(current === 0);
		next.setDisabled(current === pages.length - 1);

		if (current >= Math.floor(pages.length / 2)) {
			border.setEmoji('⏮️');
		}
		else {
			border.setEmoji('⏭️');
		}

		await i.update({ embeds: [pages[current]], components: [row] });
	});

	collector.on('end', () => {
		// Disable buttons after time runs out
		const disabledRow = new ActionRowBuilder().addComponents(
			row.components.map(button => ButtonBuilder.from(button).setDisabled(true)),
		);
		message.edit({ components: [disabledRow] });
	});
}

module.exports = { getRandomInt, isEmpty, pagination, setupEmbed };
