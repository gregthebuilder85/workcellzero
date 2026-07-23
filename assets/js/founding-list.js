/* ============================================================================
   WORKCELL ZERO // founding-list capture
   Writes a single email to Supabase via the public anon key. The founding_list
   table has Row Level Security set to anonymous INSERT only, so this page can
   add a row but can never read, update, or delete the list.
   Progressive enhancement: if the backend is not configured, the form degrades
   to a clear "opening soon" message instead of failing.
   ============================================================================ */
(function () {
  "use strict";

  var CFG = window.WORKCELL_ZERO_CONFIG || {};
  var forms = Array.prototype.slice.call(document.querySelectorAll("[data-founding-list]"));
  if (!forms.length) return;

  var ready = CFG.foundingListEnabled && CFG.supabaseUrl && CFG.supabaseAnonKey;
  var ENDPOINT = ready ? CFG.supabaseUrl.replace(/\/+$/, "") + "/rest/v1/" + (CFG.foundingListTable || "founding_list") : "";
  var EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  function setStatus(el, msg, kind) {
    if (!el) return;
    el.textContent = msg;
    el.className = "flist-status" + (kind ? " is-" + kind : "");
  }

  forms.forEach(function (form) {
    var input = form.querySelector('input[type="email"]');
    var honeypot = form.querySelector('input[name="company"]');
    var button = form.querySelector('button[type="submit"], button:not([type])');
    var status = form.querySelector("[data-flist-status]");

    if (!ready) {
      setStatus(status, "The founding list opens shortly. Check back soon.", "muted");
      if (button) { button.setAttribute("aria-disabled", "true"); }
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!ready) { setStatus(status, "The founding list opens shortly. Check back soon.", "muted"); return; }

      // Honeypot: real people leave this empty. Bots fill it. Silently accept.
      if (honeypot && honeypot.value.trim() !== "") {
        setStatus(status, "You are on the founding list.", "ok");
        form.reset();
        return;
      }

      var email = (input && input.value || "").trim();
      if (!EMAIL_RE.test(email)) {
        setStatus(status, "Enter a valid email address.", "err");
        if (input) input.focus();
        return;
      }

      if (button) { button.disabled = true; }
      setStatus(status, "Adding you to the list...", "muted");

      fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "apikey": CFG.supabaseAnonKey,
          "Authorization": "Bearer " + CFG.supabaseAnonKey,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          email: email,
          source: (location.pathname.replace(/^\//, "") || "index.html") + (form.dataset.source ? " // " + form.dataset.source : ""),
          user_agent: navigator.userAgent.slice(0, 300)
        })
      }).then(function (res) {
        if (res.status === 201 || res.status === 204) {
          setStatus(status, "You are on the founding list. Watch your inbox at launch.", "ok");
          form.reset();
        } else if (res.status === 409) {
          // duplicate email: already registered, treat as success
          setStatus(status, "You are already on the founding list.", "ok");
          form.reset();
        } else if (res.status === 400 || res.status === 422) {
          setStatus(status, "That email did not look valid. Please check it.", "err");
          if (button) button.disabled = false;
        } else {
          setStatus(status, "Something went wrong. Please try again in a moment.", "err");
          if (button) button.disabled = false;
        }
      }).catch(function () {
        setStatus(status, "Network problem. Please try again in a moment.", "err");
        if (button) button.disabled = false;
      });
    });
  });
})();
