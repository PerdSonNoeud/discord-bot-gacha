const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Affiche les stats et ton inventaire.'),
  async execute(interaction) {
    await interaction.reply('test');
  },
};
