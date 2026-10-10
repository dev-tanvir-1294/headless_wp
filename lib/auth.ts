import { wpFetch } from './anti-bot';
import { WP_API } from './config';

export interface JwtLoginResult {
  ok: boolean;
  token?: string;
  displayName?: string;
  email?: string;
  nicename?: string;
  error?: string;
}

function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, '').trim();
}

/**
 * Exchanges WordPress username/password for a JWT token via the
 * "JWT Authentication for WP REST API" plugin (already installed on the store).
 */
export async function jwtLogin(username: string, password: string): Promise<JwtLoginResult> {
  try {
    const response = await wpFetch(`${WP_API}/jwt-auth/v1/token`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      let message = `Login failed (${response.status})`;
      try {
        const data = (await response.json()) as { message?: string; code?: string };
        message = stripHtml(data.message ?? '') || data.code || message;
      } catch {
        // ignore body parse errors
      }
      return { ok: false, error: message };
    }

    const data = (await response.json()) as {
      token?: string;
      user_display_name?: string;
      user_email?: string;
      user_nicename?: string;
    };

    return {
      ok: true,
      token: data.token,
      displayName: data.user_display_name,
      email: data.user_email,
      nicename: data.user_nicename,
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Unexpected login error' };
  }
}
