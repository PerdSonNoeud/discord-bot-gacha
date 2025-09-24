const { parse } = require("csv-parse/sync");
const fs = require ('node:fs');

// Function that gets info from banners from "./assets/portals/banners.json"
function parseBanners(filepath) {
  try {
    const file = fs.readFileSync(filepath, "utf8");
    return JSON.parse(file);
  } catch {
    console.log(`File characters.json not found in ${filepath}`);
  }
}


module.exports = { parseBanners };
