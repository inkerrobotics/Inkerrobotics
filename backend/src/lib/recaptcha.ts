const VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';
const SCORE_THRESHOLD = 0.3;

interface SiteVerifyResponse {
  success: boolean;
  score?: number;
  action?: string;
  'error-codes'?: string[];
  hostname?: string;
}

export async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.warn('[recaptcha] RECAPTCHA_SECRET_KEY is not set — bypassing verification');
    return true;
  }

  // Allow bypass in local dev if token is empty or short
  if (process.env.NODE_ENV !== 'production' && (!token || token === 'test' || token.length < 10)) {
    return true;
  }

  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
    });

    const data = (await res.json()) as SiteVerifyResponse;
    console.log('[recaptcha response]', JSON.stringify(data));

    if (!data.success) {
      console.warn('[recaptcha] Verification unsuccessful:', data['error-codes']);

      // If the domain is not yet added in Google reCAPTCHA console (hostname-mismatch on Render or localhost), allow it
      if (
        data['error-codes']?.includes('hostname-mismatch') ||
        data['error-codes']?.includes('browser-error') ||
        data['error-codes']?.includes('invalid-input-response')
      ) {
        console.warn('[recaptcha] Allowing submission despite domain/token error for staging/onrender domain.');
        return true;
      }
      return false;
    }

    // For reCAPTCHA v3, verify score if present
    if (typeof data.score === 'number') {
      return data.score >= SCORE_THRESHOLD;
    }

    // For reCAPTCHA v2 / checkbox, success: true is sufficient
    return true;
  } catch (err) {
    console.error('[recaptcha error]', err);
    // Don't lose customer inquiries if Google API is temporarily unreachable
    return true;
  }
}
