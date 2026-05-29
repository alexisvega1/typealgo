#!/usr/bin/env node
/** Download MonkeyType click sound packs into public/sounds (GPL-3.0 — see ATTRIBUTION.md). */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(ROOT, "..", "public", "sounds");
const BASE =
  "https://raw.githubusercontent.com/monkeytypegame/monkeytype/master/frontend/static/sounds";

const PACKS = {
  click1: 3,
  click2: 3,
  click3: 3,
  click4: 6,
  click5: 6,
  click15: 5,
  click17: 10,
  click18: 10,
  click19: 10,
  click20: 10,
  click21: 10,
  click22: 10,
  click23: 10,
  click24: 10,
  click25: 10,
};

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  let count = 0;
  for (const [folder, n] of Object.entries(PACKS)) {
    const dir = path.join(OUT, folder);
    await mkdir(dir, { recursive: true });
    for (let i = 1; i <= n; i++) {
      const url = `${BASE}/${folder}/${i}.wav`;
      const dest = path.join(dir, `${i}.wav`);
      process.stdout.write(`fetch ${folder}/${i}.wav\n`);
      const data = await download(url);
      await writeFile(dest, data);
      count++;
    }
  }
  console.log(`Done — ${count} files in ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
