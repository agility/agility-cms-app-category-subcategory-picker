import { NextResponse } from 'next/server';

export async function POST() {
  // Handle app uninstall webhook
  return NextResponse.json({ success: true });
}

