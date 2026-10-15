#!/usr/bin/env node
/**
 * Command-line client for the Average API.
 * Usage: node client/cli.js <number> [<number> ...]
 * Set API_URL to override the default http://localhost:3000.
 */
const BASE_URL = process.env.API_URL || 'http://localhost:3000';

/**
 * Sends one number to POST /average.
 *
 * @param {number} number - The number to submit.
 * @returns {Promise<{average: number, count: number}>} Server response.
 */
async function submit(number) {
  const res = await fetch(`${BASE_URL}/average`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ number }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node client/cli.js <number> [<number> ...]');
    process.exit(1);
  }
  for (const arg of args) {
    const result = await submit(Number(arg));
    console.log(`sent ${arg} -> average: ${result.average} (count: ${result.count})`);
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
