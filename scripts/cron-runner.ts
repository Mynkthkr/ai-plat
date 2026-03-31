/**
 * Standalone Cron Runner
 * 
 * This script can be run independently via node-cron for
 * self-hosted deployments where you don't have Vercel Cron/AWS EventBridge.
 * 
 * Usage:
 *   npx ts-node scripts/cron-runner.ts
 * 
 * Schedule: Runs every 6 hours by default
 */

import cron from 'node-cron';

const CRON_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const CRON_SECRET = process.env.CRON_SECRET || 'dev-secret';

async function triggerPipeline() {
  console.log(`[${new Date().toISOString()}] Triggering pipeline...`);

  try {
    const response = await fetch(`${CRON_URL}/api/cron/run`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CRON_SECRET}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (response.ok) {
      console.log(`[${new Date().toISOString()}] Pipeline completed:`, result);
    } else {
      console.error(`[${new Date().toISOString()}] Pipeline failed:`, result);
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Pipeline error:`, error);
  }
}

// Run every 6 hours: at minute 0 of hours 0, 6, 12, 18
const schedule = process.env.CRON_SCHEDULE || '0 */6 * * *';

console.log('');
console.log('═══════════════════════════════════════════');
console.log('  🕐 AI Pulse Cron Runner');
console.log(`  Schedule: ${schedule}`);
console.log(`  Target: ${CRON_URL}`);
console.log('═══════════════════════════════════════════');
console.log('');

// Schedule the cron job
cron.schedule(schedule, triggerPipeline, {
  timezone: 'UTC',
});

// Also run immediately on startup
triggerPipeline();

console.log('Cron job scheduled. Waiting for next execution...');
