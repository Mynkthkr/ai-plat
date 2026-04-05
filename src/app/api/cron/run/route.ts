import { NextResponse } from 'next/server';
import { runFullPipeline } from '@/lib/pipeline';

export async function POST(req: Request) {
  try {
    // Basic Security: Check for Cron Secret
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'dev-secret';

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized. Invalid Cron Secret.' }, { status: 401 });
    }

    // Run the pipeline
    console.log('[API/CRON] Triggered pipeline execution...');
    const results = await runFullPipeline();

    return NextResponse.json({
      success: true,
      message: 'Pipeline executed successfully',
      data: results
    }, { status: 200 });

  } catch (error) {
    console.error('[API/CRON] Pipeline Execution Error:', error);
    return NextResponse.json({ error: 'Pipeline execution failed.' }, { status: 500 });
  }
}
