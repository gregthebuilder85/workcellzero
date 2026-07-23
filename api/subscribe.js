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
  var subject = "You are on the WORKCELL ZERO founding list";
  var text = [
    "You are on the founding list for WORKCELL ZERO // SYSTEM 01, the AI business-building kit.",
    "",
    "You will get one email the moment it opens, at the founding price for early buyers. No spam.",
    "",
    "If this was not you, you can ignore this message.",
    "",
    "WORKCELL ZERO"
  ].join("\n");
  var html = [
    '<div style="background:#050708;color:#f0eee8;font-family:Georgia,serif;padding:32px;max-width:560px;margin:auto">',
    '<div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;color:#ff6500;text-transform:uppercase">WORKCELL ZERO // System 01</div>',
    '<h1 style="font-family:Arial,sans-serif;text-transform:uppercase;font-size:26px;margin:14px 0 16px;color:#f0eee8">You are on the founding list.</h1>',
    '<p style="font-size:16px;line-height:1.55;color:#cfd3cf">WORKCELL ZERO // SYSTEM 01 is the AI business-building kit: it turns an idea into a working product and a real market test, or tells you to stop.</p>',
    '<p style="font-size:16px;line-height:1.55;color:#cfd3cf">You will get one email the moment it opens, at the founding price for early buyers. No spam.</p>',
    '<p style="font-size:13px;line-height:1.5;color:#829095;border-top:1px solid #273236;padding-top:16px;margin-top:20px">If this was not you, you can ignore this message.</p>',
    "</div>"
  ].join("");

  var r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + process.env.RESEND_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ from: from, to: [email], subject: subject, html: html, text: text })
  });
  if (!r.ok) {
    var t = await r.text();
    throw new Error("resend " + r.status + " " + t.slice(0, 300));
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

  // Confirmation email: only for new signups, only when Resend is configured.
  // Never let an email failure fail the signup.
  var emailed = false;
  if (isNew && process.env.RESEND_API_KEY && process.env.RESEND_FROM) {
    try { await sendConfirmation(email); emailed = true; }
    catch (e) { console.error("subscribe: resend", e && e.message ? e.message : e); }
  }

  return res.status(200).json({ ok: true, status: isNew ? "subscribed" : "already", emailed: emailed });
};
