/**
 * Pipeline Runner Script
 *
 * Executed by GitHub Actions cron job.
 * Usage: npx tsx scripts/run-pipeline.ts
 */

import { runFullPipeline } from '../src/lib/pipeline';

async function main() {
  try {
    const result = await runFullPipeline();
    console.log('Pipeline result:', JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('Pipeline failed:', error);
    process.exit(1);
  }
}

main();
