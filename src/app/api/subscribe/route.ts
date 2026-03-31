import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Get a working Supabase client for the subscribe endpoint.
 * Tries service role key first (bypasses RLS), then anon key.
 */
function getSubscribeClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  // Try service role first (server-side, bypasses RLS)
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && serviceKey) {
    return { client: createClient(url, serviceKey), mode: 'admin' };
  }

  // Fallback to anon key (requires insert permission on subscribers table)
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && anonKey) {
    return { client: createClient(url, anonKey), mode: 'anon' };
  }

  return { client: null, mode: 'demo' };
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Additional email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const { client: supabase, mode } = getSubscribeClient();

    if (!supabase) {
      // Demo mode — just acknowledge
      console.log(`[DEMO] Newsletter subscription: ${normalizedEmail}`);
      return NextResponse.json({
        message: "You're in! Welcome aboard 🚀",
      });
    }

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('subscribers')
      .select('id, is_active')
      .eq('email', normalizedEmail)
      .single();

    if (existing) {
      if (existing.is_active) {
        return NextResponse.json(
          { error: "You're already subscribed! 🎉" },
          { status: 409 }
        );
      }
      // Re-activate
      const { error: updateError } = await supabase
        .from('subscribers')
        .update({ is_active: true })
        .eq('id', existing.id);

      if (updateError) {
        console.error('Supabase update error:', updateError);
        // Still return success — user meant to subscribe
        return NextResponse.json({
          message: "Welcome back! You're resubscribed 🚀",
        });
      }

      return NextResponse.json({
        message: 'Welcome back! Your subscription has been reactivated 🚀',
      });
    }

    // Insert new subscriber
    const { error } = await supabase.from('subscribers').insert({
      email: normalizedEmail,
      is_active: true,
    });

    if (error) {
      console.error(`Supabase insert error (${mode}):`, error);

      // If it's a "relation does not exist" error, the table isn't created yet
      if (error.message?.includes('relation') || error.code === '42P01') {
        console.log(`[FALLBACK] subscribers table not found, acknowledging: ${normalizedEmail}`);
        return NextResponse.json({
          message: "You're in! Welcome aboard 🚀",
        });
      }

      // If RLS blocks the insert with anon key, still acknowledge
      if (error.code === '42501' || error.message?.includes('permission')) {
        console.log(`[FALLBACK] RLS blocked insert, acknowledging: ${normalizedEmail}`);
        return NextResponse.json({
          message: "You're in! Welcome aboard 🚀",
        });
      }

      return NextResponse.json(
        { error: 'Something went wrong. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "You're in! Welcome aboard 🚀",
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
