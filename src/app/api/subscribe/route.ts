import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

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

    // Check if Supabase is configured
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      // Demo mode — just acknowledge
      console.log(`[DEMO] Newsletter subscription: ${normalizedEmail}`);
      return NextResponse.json({
        message: "You're in! Welcome aboard 🚀 (demo mode — connect Supabase to persist)",
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
          { error: 'You\'re already subscribed! 🎉' },
          { status: 409 }
        );
      }
      // Re-activate
      await supabase
        .from('subscribers')
        .update({ is_active: true })
        .eq('id', existing.id);

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
      console.error('Supabase insert error:', error);
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
