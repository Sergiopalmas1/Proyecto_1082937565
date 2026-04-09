import { NextResponse } from 'next/server';
import { readHomeData } from '../../../lib/dataService';
import { HomeDataSchema } from '../../../lib/validators';

export async function GET() {
  try {
    const data = readHomeData();
    const validated = HomeDataSchema.parse(data);

    return NextResponse.json(validated, {
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
