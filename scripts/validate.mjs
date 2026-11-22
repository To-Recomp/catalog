// Validates a catalog file against schema/catalog-1.json plus the rules a schema can't express.
//   node scripts/validate.mjs catalog.json

import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const schema = JSON.parse(readFileSync(new URL("../schema/catalog-1.json", import.meta.url), "utf8"));
const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);
const checkSchema = ajv.compile(schema);

/** @returns {string[]} one message per problem; empty when the catalog is valid */
export function validate(catalog) {
  if (!checkSchema(catalog)) {
    return checkSchema.errors.map((e) => `${e.instancePath || "/"} ${e.message}`);
  }
  const errors = [];
  const ids = new Set();
  catalog.games.forEach((game, g) => {
    if (ids.has(game.id)) errors.push(`/games/${g}/id duplicate game id "${game.id}"`);
    ids.add(game.id);
    const targets = new Set();
    game.platforms.forEach((p, i) => {
      const key = `${p.platform}\u0000${p.region}`;
      if (targets.has(key)) {
        errors.push(`/games/${g}/platforms/${i} duplicate platform and region "${p.platform}" / "${p.region}"`);
      }
      targets.add(key);
    });
  });
  return errors;
}

function main(path) {
  let catalog;
  try {
    catalog = JSON.parse(readFileSync(path, "utf8"));
  } catch (e) {
    console.error(`${path}: ${e.message}`);
    process.exit(1);
  }
  const errors = validate(catalog);
  for (const error of errors) console.error(`${path}: ${error}`);
  if (errors.length) process.exit(1);
  console.log(`${path}: valid (${catalog.games.length} game${catalog.games.length === 1 ? "" : "s"})`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (!process.argv[2]) {
    console.error("usage: node scripts/validate.mjs <catalog.json>");
    process.exit(2);
  }
  main(process.argv[2]);
}
