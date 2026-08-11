import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    let cities: any[] = [];
    let days: any[] = [];
    let galleryImages: any[] = [];

    if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({ cities, days, galleryImages });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const [citiesRes, daysRes, galleryRes] = await Promise.all([
            supabase.from('admin_settings').select('value').eq('key', 'global_cities').single(),
            supabase.from('admin_settings').select('value').eq('key', 'global_days').single(),
            supabase.from('admin_settings').select('value').eq('key', 'gallery_images').single()
        ]);
        
        if (citiesRes.data?.value) {
            try { cities = JSON.parse(citiesRes.data.value); } catch {}
        }
        if (daysRes.data?.value) {
            try { days = JSON.parse(daysRes.data.value); } catch {}
        }
        if (galleryRes.data?.value) {
            try { galleryImages = JSON.parse(galleryRes.data.value); } catch {}
        }

        return NextResponse.json({ cities, days, galleryImages });
    } catch (err) {
        return NextResponse.json({ cities, days, galleryImages });
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
        
        if (body.cities) {
            await supabase.from('admin_settings').upsert({ key: 'global_cities', value: JSON.stringify(body.cities) }, { onConflict: 'key' });
        }
        if (body.days) {
            await supabase.from('admin_settings').upsert({ key: 'global_days', value: JSON.stringify(body.days) }, { onConflict: 'key' });
        }
        if (body.galleryImages) {
            await supabase.from('admin_settings').upsert({ key: 'gallery_images', value: JSON.stringify(body.galleryImages) }, { onConflict: 'key' });
        }
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
