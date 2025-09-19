// Random integer between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Template of embed
function setupEmbed(user, client, embed) {
  embed.setColor(0xff0000)
    .setAuthor({name: user.displayName, iconURL: user.displayAvatarURL()})
    .setFooter({ text: 'Gacha bot | 2025', iconURL: client.user.displayAvatarURL()})
}

module.exports = { getRandomInt, setupEmbed };
