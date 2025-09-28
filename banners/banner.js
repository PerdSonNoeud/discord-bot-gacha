const { parseBanners } = require('../config/parser.js');
const { characterToString, getCharacterIcon } = require('../characters/character.js');

const banners = parseBanners('./assets/portals/banners.json');
const bannerCount = banners.length;

function bannerExists(banner_id) {
	const banner = banners.find(b => b.id === banner_id);
	if (banner) return true;
	return false;
}

function getBannerName(banner_id) {
	const banner = banners.find(b => b.id === banner_id);
	if (banner) return banner.name;
	console.log(`Banner with id: ${banner_id} is not found.`);
	return '';
}

function getBannerCode(banner_id) {
	const banner = banners.find(b => b.id === banner_id);
	if (banner) return banner.code;
	console.log(`Banner with id: ${banner_id} is not found.`);
	return '';
}

// Get info from a banner's characters
function getBannerCharacters(banner_id) {
	const banner = banners.find(b => b.id === banner_id);
	if (banner) return banner.characters;
	console.log(`Banner with id: ${banner_id} is not found.`);
	return [];
}

function getBannerImage(banner_id) {
	const banner = banners.find(b => b.id === banner_id);
	if (banner) return banner.url;
	return '';
}

function listBannerCharacters(client, banner_id) {
	const characters = getBannerCharacters(banner_id);
	let result = '';
	for (let i = 1 + (banner_id - 1) * 10; i <= 10 * banner_id; i++) {
		const current = characters.find(c => c.id === i);
		if (current) result += `${getCharacterIcon(client, i)} ${characterToString(current.name, current.rarity)}\n`;
	}

	return result;
}

module.exports = {
	bannerCount, bannerExists, getBannerCharacters, getBannerImage,
	getBannerCode, getBannerName, listBannerCharacters,
};
