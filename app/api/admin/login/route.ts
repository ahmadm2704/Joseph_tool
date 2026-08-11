import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@coursepro.com';
    const fallbackPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

    if (email !== adminEmail) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data } = await supabase
          .from('admin_settings')
          .select('value')
          .eq('key', 'admin_password')
          .single();

        if (data?.value) {
          // Check if stored value is a bcrypt hash
          const isHash = data.value.startsWith('$2');
          let passwordMatch = false;

          if (isHash) {
            passwordMatch = await bcrypt.compare(password, data.value);
          } else {
            // Plain-text password stored (old format) — compare directly and migrate to hash
            passwordMatch = password === data.value;
            if (passwordMatch) {
              // Migrate to hashed format on successful login
              const hashed = await bcrypt.hash(password, 12);
              await supabase
                .from('admin_settings')
                .upsert({ key: 'admin_password', value: hashed }, { onConflict: 'key' });
            }
          }

          if (!passwordMatch) {
            return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
          }

          return NextResponse.json({ success: true });
        }
      } catch (e) {
        console.warn('[admin-login] Supabase check failed, falling back:', e);
      }
    }

    // Fallback: use env var password if no DB record exists
    if (password !== fallbackPassword) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin-login] Error:', err);
    return NextResponse.json({ error: 'Login failed.' }, { status: 500 });
  }
}
