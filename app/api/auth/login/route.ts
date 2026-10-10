import { NextResponse } from 'next/server';
import { jwtLogin } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let body: { username?: string; password?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 });
  }

  if (!body.username || !body.password) {
    return NextResponse.json(
      { ok: false, error: 'Username and password are required' },
      { status: 400 }
    );
  }

  const result = await jwtLogin(body.username, body.password);

  if (!result.ok) {
    return NextResponse.json(result, { status: 401 });
  }

  return NextResponse.json(result);
}
