# catalog

to-recomp/catalog

`catalog.json`: the list of games and platforms shown in the launcher, fetched at startup so new games appear without a launcher release. Edited by pull request. Only games that have a recomp repository are listed.

## Format 1

Defined by the JSON Schema `schema/catalog-1.json`. Launchers fetch `catalog.json` from `main`, keep the last valid copy, and must **ignore fields they don't know**, so fields can be added without a new format number.

```json
{
  "format": 1,
  "generated": "2026-11-22T12:00:00Z",
  "games": [
    {
      "id": "tos",
      "name": "Tales of Symphonia",
      "japan_release_year": 2003,
      "repository": "To-Recomp/tos-recomp",
      "manifest": "https://raw.githubusercontent.com/To-Recomp/tos-recomp/main/recomplauncher.json",
      "platforms": [
        { "platform": "GameCube", "region": "France (PAL)", "status": "unsupported", "tested": false }
      ]
    }
  ]
}
```

| Field | Rule |
| --- | --- |
| `format` | `1` |
| `generated` | RFC 3339 timestamp; set it to the date of your change |
| `games[].id` | stable, lowercase letters, digits and single dashes (`tos`); never reused |
| `games[].name` | non-empty, shown in the sidebar |
| `games[].japan_release_year` | integer, 1990 to 2100; the launcher sorts the sidebar by it |
| `games[].repository` | `owner/name` of the recomp repository; only games with one are listed |
| `games[].manifest` | optional `https` URL of the game's `recomplauncher.json` |
| `games[].platforms[]` | at least one; each `platform` and `region` pair appears once per game |
| `platforms[].status` | `stable`, `beta`, `alpha`, `unsupported` or `coming-soon` (announced, no playable build yet) |
| `platforms[].tested` | boolean: someone ran it on real hardware or a reference setup |

Images are not part of the catalog: the launcher shows initials.

## Contributing an entry

Games and platforms can be listed in any order: nothing depends on the order of the file, the launcher sorts. Just fill in the values in `catalog.json`, then run `npm ci && npm test` (Node 26). The same checks run on every pull request. A pull request is rejected when the file doesn't match the schema, repeats a game `id`, or repeats a platform and region of one game.

Status: format 1 with the first entry, *Tales of Symphonia*.

Not affiliated with or endorsed by Bandai Namco Entertainment, Sony Interactive Entertainment, Nintendo or any game publisher or developer. This project contains no game files; you bring your own copy of the game.

License: GPL v3 (`LICENSE`). Contributions: `CONTRIBUTING.md`.
