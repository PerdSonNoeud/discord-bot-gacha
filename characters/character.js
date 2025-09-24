function rarityToString(rarity) {
  return ':star: '.repeat(rarity) + ':black_circle: '.repeat(5-rarity);
}

function characterToString(name, rarity) {
  return `${rarityToString(rarity)}${name}`;
}

function getCharacterIcon(client, c_id) {
  // TODO: Find a way to load app emojis without hard coding emoji id and name.
  const icon = client.application.emojis.cache.find(e => true);
  if (icon) return icon;
  return "❔";
}

module.exports = { characterToString, getCharacterIcon, rarityToString };
