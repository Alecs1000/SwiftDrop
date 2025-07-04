import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const name = formData.get('name') as string;

  if (!file || !name) {
    return NextResponse.json({ error: 'Missing file or name' }, { status: 400 });
  }

  // Upload to Supabase Storage
  const filePath = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from('mockups')
    .upload(filePath, file);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Insert metadata into the database
  const { data: dbData, error: dbError } = await supabase
    .from('mockups')
    .insert([{ name, image_path: filePath }])
    .select();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, mockup: dbData[0] });
} 