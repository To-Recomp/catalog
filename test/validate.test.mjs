import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { validate } from "../scripts/validate.mjs";

const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
const fixtures = (dir) => readdirSync(new URL(`./${dir}/`, import.meta.url)).map((f) => [f, `./${dir}/${f}`]);

// What each invalid fixture must be rejected for, so a fixture can't fail for the wrong reason.
const expected = {
  "wrong-format-version.json": "/format",
  "missing-generated.json": "generated",
  "generated-not-a-timestamp.json": "/generated",
  "missing-games.json": "games",
  "game-missing-id.json": "id",
  "game-id-not-lowercase-slug.json": "/games/0/id",
  "duplicate-game-id.json": "duplicate game id",
  "game-missing-name.json": "name",
  "release-year-not-an-integer.json": "/games/0/japan_release_year",
  "release-year-out-of-range.json": "/games/0/japan_release_year",
  "repository-not-owner-slash-name.json": "/games/0/repository",
  "manifest-not-https.json": "/games/0/manifest",
  "game-without-platforms.json": "/games/0/platforms",
  "unknown-status.json": "/games/0/platforms/0/status",
  "tested-not-a-boolean.json": "/games/0/platforms/0/tested",
  "platform-missing-region.json": "region",
  "duplicate-platform-and-region.json": "duplicate platform and region",
};

for (const [name, path] of fixtures("valid")) {
  test(`valid: ${name}`, () => assert.deepEqual(validate(read(path)), []));
}

for (const [name, path] of fixtures("invalid")) {
  test(`invalid: ${name}`, () => {
    const errors = validate(read(path));
    assert.ok(errors.length > 0, "should be rejected");
    assert.ok(expected[name], `no expectation for ${name}`);
    assert.ok(errors.some((e) => e.includes(expected[name])), `${expected[name]} not in ${JSON.stringify(errors)}`);
  });
}

test("every expectation has a fixture", () => {
  assert.deepEqual(Object.keys(expected).sort(), fixtures("invalid").map(([n]) => n).sort());
});
