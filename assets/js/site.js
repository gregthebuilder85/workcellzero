/* ============================================================================
   WORKCELL ZERO // shared site behavior
   Static, no backend, no analytics, no network calls.
   Reads config.js (brand + price) and preview-config.js (launch inputs).
   Blank launch inputs render as clearly labeled slots, never as real values.
   ============================================================================ */
(function () {
  "use strict";

  var CFG = Object.assign({
    version: "1.2",
    operatorPrice: "$99",
    lastInspected: ""
  }, window.WORKCELL_ZERO_CONFIG || {});

  var PRE = Object.assign({
    founderName: "",
    founderImage: "",
    founderSocial: "",
    supportEmail: "",
    demoUrl: "",
    publicBuildRecordUrl: "",
    changelogUrl: "",
    operatorCheckoutUrl: "",
    publicDomain: ""
  }, window.WORKCELL_PREVIEW || {});

  function on(el, ev, fn) { if (el) el.addEventListener(ev, fn); }
  function all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function has(v) { return typeof v === "string" && v.trim() !== ""; }

  /* ---- Price + version fills ------------------------------------------ */
  all(".js-operator-price").forEach(function (x) { x.textContent = CFG.operatorPrice; });
  all(".js-version").forEach(function (x) { x.textContent = "v" + CFG.version; });

  /* ---- Mobile nav toggle ---------------------------------------------- */
  var toggle = document.querySelector(".navtoggle");
  var nav = document.querySelector(".nav");
  on(toggle, "click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  /* ---- Light / dark theme toggle ------------------------------------- */
  // The initial theme is resolved before paint by an inline <head> script
  // (localStorage override, else prefers-color-scheme). This just flips and
  // persists the choice.
  var themeBtn = document.querySelector(".themetoggle");
  on(themeBtn, "click", function () {
    var next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("wz-theme", next); } catch (e) {}
    themeBtn.setAttribute("aria-pressed", next === "light" ? "true" : "false");
  });

  /* ---- Preview-only checkout guard ------------------------------------ */
  var modal = document.querySelector("#previewModal");
  function openModal() {
    if (!modal) return;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    var f = modal.querySelector("button, a");
    if (f) f.focus();
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }
  all(".js-buy").forEach(function (b) {
    on(b, "click", function (e) {
      e.preventDefault();
      // Checkout is intentionally disabled in preview. Never navigate.
      openModal();
    });
  });
  on(modal, "click", function (e) { if (e.target === modal) closeModal(); });
  on(document.querySelector("#closeModal"), "click", closeModal);
  on(document, "keydown", function (e) {
    if (e.key === "Escape" && modal && modal.classList.contains("open")) closeModal();
  });

  /* ---- Launch-input slots: fill when present, keep slot when blank ----- */
  // Support: only expose an address if one is configured. Otherwise show the
  // release-pending note that already lives in the markup.
  all("[data-support]").forEach(function (el) {
    if (has(PRE.supportEmail)) {
      if (el.tagName === "A") {
        el.setAttribute("href", "mailto:" + PRE.supportEmail);
        el.textContent = PRE.supportEmail;
      } else {
        el.textContent = PRE.supportEmail;
      }
      el.removeAttribute("hidden");
      var ph = el.parentNode && el.parentNode.querySelector("[data-support-pending]");
      if (ph) ph.setAttribute("hidden", "");
    }
  });

  // Demo recording slot: swap to an embed link only if a URL exists.
  all("[data-demo-slot]").forEach(function (slot) {
    if (!has(PRE.demoUrl)) return;
    var link = slot.querySelector("[data-demo-link]");
    if (link) { link.setAttribute("href", PRE.demoUrl); link.removeAttribute("hidden"); }
    slot.setAttribute("data-filled", "true");
  });

  // Public build record link.
  all("[data-record-link]").forEach(function (a) {
    if (has(PRE.publicBuildRecordUrl)) {
      a.setAttribute("href", PRE.publicBuildRecordUrl);
      a.removeAttribute("hidden");
    }
  });

  // Changelog link.
  all("[data-changelog]").forEach(function (a) {
    if (has(PRE.changelogUrl)) {
      a.setAttribute("href", PRE.changelogUrl);
      a.removeAttribute("hidden");
      a.textContent = "View changelog";
    }
  });

  // Founder identity: fill only if a real name exists.
  all("[data-founder-name]").forEach(function (el) {
    if (has(PRE.founderName)) el.textContent = PRE.founderName;
  });

  /* ---- Interactive sample run (system-01) ----------------------------- */
  var sampleData = window.WORKCELL_SAMPLE_DATA;
  var tabsEl = document.querySelector("#sampleTabs");
  var reportEl = document.querySelector("#sampleReport");
  var ideaEl = document.querySelector("#sampleIdea");
  if (sampleData && tabsEl && reportEl) {
    var curCase = "consultant", curStage = 0;
    function pad(n) { return String(n).padStart(2, "0"); }
    function renderSample() {
      var d = sampleData[curCase], s = d.stages[curStage];
      if (ideaEl) ideaEl.value = d.idea;
      tabsEl.innerHTML = d.stages.map(function (x, i) {
        return '<button class="' + (i === curStage ? "active" : "") + '" data-i="' + i + '" aria-pressed="' + (i === curStage) + '">' + pad(i + 1) + " " + x[0] + "</button>";
      }).join("");
      reportEl.innerHTML =
        '<div class="rk">RECOVERED ARTIFACT // ' + pad(curStage + 1) + " // ILLUSTRATIVE</div>" +
        "<h3>" + s[0] + "</h3><p>" + s[1] + "</p>" +
        '<div class="receipt">' + s[2] + "</div>" +
        '<div class="sample-note">Illustrative case file. No revenue, conversion, or validation claim.</div>';
      all("button", tabsEl).forEach(function (b) {
        on(b, "click", function () { curStage = +b.dataset.i; renderSample(); });
      });
    }
    all("[data-case]").forEach(function (b) {
      on(b, "click", function () {
        curCase = b.dataset.case; curStage = 0;
        all("[data-case]").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        renderSample();
      });
    });
    if (ideaEl) on(ideaEl, "change", function () { sampleData[curCase].idea = ideaEl.value; });
    renderSample();
  }

  /* ---- Build Record walker (build-records) ---------------------------- */
  var brData = window.WORKCELL_RECORD_CHAIN;
  var brIndex = document.querySelector("#brIndex");
  var brPanel = document.querySelector("#brPanel");
  if (brData && brIndex && brPanel) {
    var curArt = 0;
    function renderBR() {
      var a = brData[curArt];
      brIndex.innerHTML = brData.map(function (x, i) {
        return '<button class="' + (i === curArt ? "active" : "") + '" data-i="' + i + '"><span class="bn">' +
          String(i + 1).padStart(2, "0") + "</span>" + x.code + "</button>";
      }).join("");
      brPanel.innerHTML =
        '<div class="rk">COMPLETE PROJECT RECORD // ARTIFACT ' + String(curArt + 1).padStart(2, "0") + " OF 10</div>" +
        "<h3>" + a.title + "</h3>" +
        '<div class="sub">' + a.code + "</div>" +
        "<p>" + a.body + "</p>" +
        '<div class="br-card">' + a.card + "</div>" +
        '<div class="br-illus">Illustrative founder-style project. Shown to demonstrate the record structure. Not a market claim.</div>';
      all("button", brIndex).forEach(function (b) {
        on(b, "click", function () { curArt = +b.dataset.i; renderBR(); });
      });
    }
    renderBR();
  }

})();
