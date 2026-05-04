import { NextResponse } from 'next/server';
import { readAppConfig } from '../../../lib/dataService';

export async function GET() {
  try {
    const config = await readAppConfig();

    return NextResponse.json(config, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Error reading app config',
        details: message,
      },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
