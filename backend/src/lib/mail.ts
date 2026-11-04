import { Resend } from 'resend';

const TO = process.env.NOTIFY_EMAIL ?? 'info@inkerrobotics.com';
// Sender. Override with MAIL_FROM in Render once a different address is
// verified in Resend. Until inkerrobotics.com is verified, Resend refuses
// this sender, so sendInquiryNotification falls back to Resend's own test
// sender (which only delivers to the Resend account owner's address).
const FROM = process.env.MAIL_FROM ?? 'Inker Website <noreply@inkerrobotics.com>';
const FALLBACK_FROM = 'Inker Website <onboarding@resend.dev>';

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not set');
  return new Resend(key);
}

interface InquiryPayload {
  name: string;
  organization?: string;
  phone: string;
  email: string;
  location?: string;
  inquiryType: string;
  message: string;
}

const TYPE_LABELS: Record<string, string> = {
  robotics: 'Robotics Solution',
  raas: 'Robot as a Service',
  ai: 'AI Solution',
  roboparks: 'RoboParks / Partnership',
  edutech: 'EduTech Programs',
  expo: 'Future Tech Expo',
  careers: 'Careers / OJT',
  'industrial-visit': 'Industrial Visit',
  general: 'General Inquiry',
};

function esc(v: string): string {
  return v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export async function sendInquiryNotification(raw: InquiryPayload) {
  // Everything below is user-submitted; escape it before it goes into the HTML email.
  const data: InquiryPayload = {
    name: esc(raw.name),
    organization: raw.organization ? esc(raw.organization) : undefined,
    phone: esc(raw.phone),
    email: esc(raw.email),
    location: raw.location ? esc(raw.location) : undefined,
    inquiryType: raw.inquiryType,
    message: esc(raw.message),
  };
  const type = TYPE_LABELS[data.inquiryType] ?? esc(data.inquiryType);

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #E4DED1;border-radius:8px;overflow:hidden;">
      <div style="background:#0B1730;padding:24px 32px;">
        <p style="margin:0;font-size:11px;letter-spacing:0.15em;color:#F37021;font-weight:700;">INKER ROBOTICS</p>
        <h1 style="margin:8px 0 0;color:#fff;font-size:20px;font-weight:700;">New Website Inquiry</h1>
      </div>
      <div style="padding:32px;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:8px 0;color:#56627A;width:160px;">Name</td><td style="padding:8px 0;color:#0B1730;font-weight:600;">${data.name}</td></tr>
          ${data.organization ? `<tr><td style="padding:8px 0;color:#56627A;">Organization</td><td style="padding:8px 0;color:#0B1730;">${data.organization}</td></tr>` : ''}
          <tr><td style="padding:8px 0;color:#56627A;">Phone</td><td style="padding:8px 0;color:#0B1730;">${data.phone}</td></tr>
          <tr><td style="padding:8px 0;color:#56627A;">Email</td><td style="padding:8px 0;color:#0B1730;">${data.email}</td></tr>
          ${data.location ? `<tr><td style="padding:8px 0;color:#56627A;">Location</td><td style="padding:8px 0;color:#0B1730;">${data.location}</td></tr>` : ''}
          <tr><td style="padding:8px 0;color:#56627A;">Inquiry Type</td><td style="padding:8px 0;"><span style="background:rgba(243,112,33,0.12);color:#F37021;padding:3px 10px;border-radius:3px;font-size:12px;font-weight:600;">${type}</span></td></tr>
        </table>
        <div style="margin-top:24px;padding:20px;background:#F6F3EC;border-radius:6px;">
          <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.08em;color:#56627A;font-weight:600;">MESSAGE</p>
          <p style="margin:0;color:#0B1730;font-size:15px;line-height:1.6;">${data.message.replace(/\n/g, '<br/>')}</p>
        </div>
        <div style="margin-top:28px;">
          <a href="${process.env.FRONTEND_URL ?? 'http://localhost:3001'}/admin/inquiries" style="display:inline-block;background:#F37021;color:#fff;text-decoration:none;padding:12px 24px;border-radius:4px;font-size:14px;font-weight:600;">View in Admin Panel →</a>
        </div>
      </div>
      <div style="padding:16px 32px;border-top:1px solid #E4DED1;font-size:12px;color:#56627A;">
        This notification was sent automatically from the Inker Robotics website contact form.
      </div>
    </div>
  `;

  // Resend does not throw on failure — it returns { error }. Surface it so
  // the caller knows the email did not go out.
  const message = {
    to: TO,
    replyTo: raw.email,
    subject: `New Inquiry: ${type} — ${raw.name}`,
    html,
  };
  const resend = getResend();
  let { error } = await resend.emails.send({ from: FROM, ...message });

  // Sender domain not verified yet → retry from Resend's test sender.
  if (error && /domain|verif|not allowed|own email/i.test(error.message ?? '')) {
    console.warn(`[mail] ${FROM} refused (${error.message}). Retrying from ${FALLBACK_FROM}.`);
    ({ error } = await resend.emails.send({ from: FALLBACK_FROM, ...message }));
  }
  if (error) throw new Error(`Resend: ${error.name ?? 'error'} — ${error.message}`);
}

/*
 * TEMPORARY diagnostic for "emails don't arrive". Reports which Resend
 * account the key belongs to (its domains), and tries one test send from the
 * real sender, returning Resend's own answer. Never returns the key itself.
 * Remove once mail is confirmed working.
 */
export async function mailDiagnostics() {
  const key = process.env.RESEND_API_KEY;
  const report: Record<string, unknown> = {
    resendKey: key ? `${key.slice(0, 6)}… (${key.length} chars)` : 'NOT SET',
    to: TO,
    from: FROM,
  };
  if (!key) return report;
  const resend = getResend();
  try {
    const domains = await resend.domains.list();
    report.domainsOnThisResendAccount = domains.error
      ? { error: domains.error }
      : ((domains.data as any)?.data ?? domains.data ?? []).map((d: any) => ({ name: d.name, status: d.status, region: d.region }));
  } catch (e) {
    report.domainsOnThisResendAccount = { error: String(e) };
  }
  const send = await resend.emails.send({
    from: FROM,
    to: TO,
    subject: 'Inker website — mail test',
    html: '<p>This is a test email from the Inker Robotics website mail check.</p>',
  });
  report.testSend = send.error ? { ok: false, error: send.error } : { ok: true, id: (send.data as any)?.id };
  return report;
}
