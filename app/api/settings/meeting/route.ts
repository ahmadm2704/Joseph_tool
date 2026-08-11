import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    let slots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];
    let dates: any[] = [];

    if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({ slots, dates });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { data: slotsData } = await supabase.from('admin_settings').select('value').eq('key', 'meeting_slots').single();
        const { data: datesData } = await supabase.from('admin_settings').select('value').eq('key', 'meeting_dates').single();
        
        if (slotsData?.value) {
            try { slots = JSON.parse(slotsData.value); } catch {}
        }
        if (datesData?.value) {
            try { dates = JSON.parse(datesData.value); } catch {}
        }

        return NextResponse.json({ slots, dates });
    } catch (err) {
        return NextResponse.json({ slots, dates });
    }
}

export async function POST(req: Request) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({ success: true, warning: 'No Supabase keys' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const body = await req.json();
        
        if (body.slots) {
            await supabase.from('admin_settings').upsert({ key: 'meeting_slots', value: JSON.stringify(body.slots) }, { onConflict: 'key' });
        }
        if (body.dates) {
            await supabase.from('admin_settings').upsert({ key: 'meeting_dates', value: JSON.stringify(body.dates) }, { onConflict: 'key' });
        }
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
