import { NextResponse } from 'next/server';
import { readHomeData } from '../../../lib/dataService';

export async function GET() {
  try {
    const data = await readHomeData();

    return NextResponse.json(data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Error reading home data',
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
