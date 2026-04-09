import { NextResponse } from 'next/server';
import { readAppConfig } from '../../../lib/dataService';
import { AppConfigSchema } from '../../../lib/validators';

export async function GET() {
  try {
    const config = readAppConfig();
    const validated = AppConfigSchema.parse(config);

    return NextResponse.json(validated, {
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
