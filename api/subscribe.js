/* ============================================================================
   WORKCELL ZERO // POST /api/subscribe
   Server-side founding-list handler. Runs on Vercel (Node). Secrets live in
   environment variables, never in the client:
     SUPABASE_URL                 project URL
     SUPABASE_SERVICE_ROLE_KEY    service role key (server only)
     RESEND_API_KEY               Resend API key (optional; email skipped if absent)
     RESEND_FROM                  verified sender, e.g. "WORKCELL ZERO <hello@workcellzero.com>"
   The confirmation email is sent only for a genuinely new signup, and an email
   failure never fails the signup.
   ============================================================================ */

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function readRaw(req) {
  return new Promise(function (resolve) {
    var data = "";
    req.on("data", function (c) { data += c; if (data.length > 10000) req.destroy(); });
    req.on("end", function () { resolve(data); });
    req.on("error", function () { resolve(""); });
  });
}

async function sendConfirmation(email) {
  var from = process.env.RESEND_FROM;
  var url = "https://workcellzero.com/system-01.html";
  var subject = "Confirmed: you are on the WORKCELL ZERO founding list";
  var preheader = "You are on the founding list for WORKCELL ZERO // SYSTEM 01. One email when it opens, at the founding price for early buyers.";
  var text = [
    "WORKCELL ZERO // SYSTEM 01",
    "",
    "FOUNDING LIST // CONFIRMED",
    "",
    "You are on the founding list.",
    "",
    "WORKCELL ZERO // SYSTEM 01 is the complete AI business-building kit. You install it in ChatGPT or Claude, and it turns an idea into a working product and a real market test. If the idea is weak, it tells you to stop.",
    "",
    "What happens next: we will send you one email the moment SYSTEM 01 opens, at the founding price for early buyers. No spam, and you can reply to this message any time.",
    "",
    "One pass through the line produces:",
    "  + A decision you can defend, with the evidence that made it",
    "  + A working first version you can put in front of a real customer",
    "  + One real market test, aimed at your riskiest assumption",
    "",
    "See how it works: " + url,
    "",
    "You are receiving this because you joined the founding list at workcellzero.com. If this was not you, you can ignore this email.",
    "WORKCELL ZERO // Built to challenge, not flatter."
  ].join("\n");
  var html = [
    '<!doctype html><html lang="en"><head><meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    '<meta name="color-scheme" content="dark light"><meta name="supported-color-schemes" content="dark light">',
    '<title>WORKCELL ZERO</title></head>',
    '<body style="margin:0;padding:0;background:#050708;">',
    '<span style="display:none!important;max-height:0;overflow:hidden;opacity:0;color:#050708;font-size:1px;line-height:1px;">' + preheader + '</span>',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#050708" style="background:#050708;"><tr><td align="center" style="padding:28px 16px;">',
    '<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;">',
    '<tr><td style="padding:0 2px 16px 2px;">',
    '<div style="font-family:Arial,Helvetica,sans-serif;font-weight:bold;font-size:22px;letter-spacing:3px;color:#f0eee8;">WORKCELL <span style="color:#ff6500;">ZERO</span></div>',
    '<div style="font-family:Courier New,monospace;font-size:10px;letter-spacing:3px;color:#829095;padding-top:6px;">SYSTEM 01 // AUTOMATED VENTURE WORKBENCH</div>',
    '</td></tr>',
    '<tr><td bgcolor="#0b1011" style="background:#0b1011;border:1px solid #273236;padding:34px 30px;">',
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="border:1px solid #3c5b45;color:#66f28b;font-family:Courier New,monospace;font-size:11px;letter-spacing:2px;padding:7px 11px;">FOUNDING LIST // CONFIRMED</td></tr></table>',
    '<h1 style="font-family:Arial Narrow,Arial,sans-serif;font-weight:bold;text-transform:uppercase;letter-spacing:1px;color:#f0eee8;font-size:32px;line-height:1.05;margin:20px 0 14px 0;">You are on the founding list.</h1>',
    '<p style="font-family:Georgia,serif;font-size:16px;line-height:1.55;color:#cfd3cf;margin:0 0 16px 0;">WORKCELL ZERO // SYSTEM 01 is the complete AI business-building kit. You install it in ChatGPT or Claude, and it turns an idea into a working product and a real market test. If the idea is weak, it tells you to <span style="color:#ff5f4f;">stop</span>.</p>',
    '<p style="font-family:Georgia,serif;font-size:16px;line-height:1.55;color:#cfd3cf;margin:0 0 22px 0;">We will send you one email the moment it opens, at the founding price for early buyers. No spam, and you can reply to this message any time.</p>',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #273236;">',
    '<tr><td style="padding:14px 0 6px 0;font-family:Courier New,monospace;font-size:9px;letter-spacing:2px;color:#ff6500;text-transform:uppercase;">One pass produces</td></tr>',
    '<tr><td style="padding:6px 0;font-family:Georgia,serif;font-size:14px;line-height:1.4;color:#cfd3cf;"><span style="color:#66f28b;font-family:Courier New,monospace;">+</span>&nbsp;&nbsp;A decision you can defend, with the evidence that made it</td></tr>',
    '<tr><td style="padding:6px 0;font-family:Georgia,serif;font-size:14px;line-height:1.4;color:#cfd3cf;"><span style="color:#66f28b;font-family:Courier New,monospace;">+</span>&nbsp;&nbsp;A working first version you can put in front of a real customer</td></tr>',
    '<tr><td style="padding:6px 0 2px 0;font-family:Georgia,serif;font-size:14px;line-height:1.4;color:#cfd3cf;"><span style="color:#66f28b;font-family:Courier New,monospace;">+</span>&nbsp;&nbsp;One real market test, aimed at your riskiest assumption</td></tr>',
    '</table>',
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:26px;"><tr><td bgcolor="#ff6500" style="background:#ff6500;"><a href="' + url + '" style="display:inline-block;padding:14px 24px;font-family:Arial,Helvetica,sans-serif;font-weight:bold;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#1b1207;text-decoration:none;">See how it works</a></td></tr></table>',
    '</td></tr>',
    '<tr><td style="padding:20px 4px 0 4px;font-family:Courier New,monospace;font-size:10px;line-height:1.8;color:#5c676a;">',
    'You are receiving this because you joined the founding list at workcellzero.com.<br>If this was not you, you can ignore this email.<br>',
    '<span style="color:#829095;">WORKCELL ZERO // Built to challenge, not flatter.</span>',
    '</td></tr>',
    '</table></td></tr></table></body></html>'
  ].join("");

  var payload = { from: from, to: [email], subject: subject, html: html, text: text };
  if (process.env.RESEND_REPLY_TO) payload.reply_to = process.env.RESEND_REPLY_TO;

  var r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + process.env.RESEND_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  if (!r.ok) {
    var t = await r.text();
    throw new Error("resend " + r.status + " " + t.slice(0, 300));
  }
}

// Founder notification: one email to the owner for each new signup.
async function sendNotification(email, source) {
  var to = process.env.NOTIFY_TO;
  if (!to) return; // notifications optional
  var from = process.env.RESEND_FROM;
  var text = "New founding-list signup.\n\nEmail: " + email + "\nSource: " + (source || "unknown") + "\n\nReply to this message to reach them directly.";
  var html = '<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#111">' +
    '<p style="color:#ff6500;letter-spacing:2px;font-size:11px;text-transform:uppercase;margin:0 0 8px">WORKCELL ZERO // Founding list</p>' +
    '<p><strong>New signup:</strong> ' + email + '</p>' +
    '<p style="color:#555">Source: ' + (source || "unknown") + '</p>' +
    '<p style="color:#555;font-size:13px">Reply to this message to reach them directly.</p></div>';

  var payload = { from: from, to: [to], subject: "New founding-list signup: " + email, html: html, text: text, reply_to: email };
  var r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!r.ok) {
    var t = await r.text();
    throw new Error("resend notify " + r.status + " " + t.slice(0, 300));
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  var body = req.body;
  if (!body || typeof body === "string") {
    try { body = JSON.parse((typeof body === "string" ? body : await readRaw(req)) || "{}"); }
    catch (e) { body = {}; }
  }

  var email = (body.email || "").toString().trim();
  var source = (body.source || "").toString().slice(0, 200);
  var honeypot = (body.company || "").toString().trim();

  // Honeypot: bots fill this. Accept silently, store nothing, send nothing.
  if (honeypot) return res.status(200).json({ ok: true, status: "subscribed" });

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return res.status(400).json({ error: "invalid_email" });
  }

  var SUPABASE_URL = process.env.SUPABASE_URL;
  var SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SERVICE) {
    console.error("subscribe: missing Supabase env");
    return res.status(500).json({ error: "not_configured" });
  }

  var isNew = false;
  try {
    var ins = await fetch(SUPABASE_URL.replace(/\/+$/, "") + "/rest/v1/founding_list", {
      method: "POST",
      headers: {
        "apikey": SERVICE,
        "Authorization": "Bearer " + SERVICE,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({
        email: email,
        source: source,
        user_agent: (req.headers["user-agent"] || "").toString().slice(0, 300)
      })
    });
    if (ins.status === 201 || ins.status === 204) isNew = true;
    else if (ins.status === 409) isNew = false;
    else {
      var et = await ins.text();
      console.error("subscribe: supabase insert " + ins.status + " " + et.slice(0, 300));
      return res.status(502).json({ error: "store_failed" });
    }
  } catch (e) {
    console.error("subscribe: supabase network", e);
    return res.status(502).json({ error: "store_failed" });
  }

  // Emails: only for new signups, only when Resend is configured. Confirmation
  // to the subscriber and a notification to the owner are independent, and
  // neither failure is allowed to fail the signup.
  var emailed = false;
  if (isNew && process.env.RESEND_API_KEY && process.env.RESEND_FROM) {
    try { await sendConfirmation(email); emailed = true; }
    catch (e) { console.error("subscribe: resend confirm", e && e.message ? e.message : e); }
    try { await sendNotification(email, source); }
    catch (e) { console.error("subscribe: resend notify", e && e.message ? e.message : e); }
  }

  return res.status(200).json({ ok: true, status: isNew ? "subscribed" : "already", emailed: emailed });
};
