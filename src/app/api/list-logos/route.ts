import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export async function GET() {
  const logosDir = path.join(process.cwd(), 'public', 'logos');
  try {
    const files = await fs.readdir(logosDir);
    const imageFiles = files.filter(f => /\.(png|jpe?g|svg|webp|gif)$/i.test(f));
    return NextResponse.json({ logos: imageFiles });
  } catch (e) {
    return NextResponse.json({ logos: [] });
  }
} 