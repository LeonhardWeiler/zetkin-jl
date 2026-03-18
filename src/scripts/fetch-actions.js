import fs from 'fs';
import fetch from 'node-fetch';

const ORG_IDS = [
  1276, 1277, 1286, 1292, 1296, 1295, 1293, 1294, 1297,
  1288, 1289, 1291, 1290, 1280, 1285, 1279, 1278, 1282, 1284, 1283, 1281
];

async function main() {
  const allActions = [];

  for (const id of ORG_IDS) {
    console.log(`Fetching org ${id}...`);
    const res = await fetch(`https://app.zetkin.org/api/orgs/${id}/actions?filter=start_time>=2026-03-18T00:00:00Z`);
    const json = await res.json();
    if (json.data) allActions.push(...json.data);
  }

  // Sort by start_time
  allActions.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

  // Write to public/actions.json
  fs.writeFileSync('public/actions.json', JSON.stringify(allActions, null, 2));
  console.log('Saved actions.json');
}

main();
