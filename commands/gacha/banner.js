const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const banners = require('../../banners/banner.js');
const { setupEmbed } = require('../../config/utility.js');

function bannerEmbed(banner_id, total_banners, user, client) {
  const text = "`- Invocation simple : 10 gemmes 💎`\n`- Invocation multiple : 100 gemmes 💎/🎟️ 1 ticket`"
  const embed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle(`Bannière \`${banner_id}\` (${banner_id + 1}/${total_banners})`)
    .setDescription(`__ID de la bannière :__`)
    .addFields(
      { name: 'Prix des invocations :', value: text },
  );
  setupEmbed(user, client, embed);

  return embed;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('banner')
    .setDescription('Affiche les bannières disponibles.'),
  async execute(interaction) {
    const embed = bannerEmbed(0, 10, interaction.user, interaction.client);
    await interaction.reply({ embeds: [embed] });
  },
};
