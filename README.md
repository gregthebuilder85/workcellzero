# WORKCELL ZERO website preview

Static, local preview. Plain HTML, CSS, and JavaScript. No backend, no build
step, no analytics, no external requests. All assets are local.

## Run it locally

From this `website/` folder, run one command:

```
python -m http.server 4173
```

Then open:

```
http://localhost:4173/
```

Any static file server works (for example `npx serve` or the VS Code Live
Server extension). There is no build step.

## Pages

- `index.html` - WORKCELL brand homepage
- `system-01.html` - full WORKCELL ZERO sales and product page
- `build-records.html` - proof-library shell
- `system-02.html` - WORKCELL ONE (SYSTEM 02) development page
- `privacy.html`, `terms.html`, `thank-you.html`, `404.html`

## Preview inputs (local only)

`preview-config.js` holds the launch inputs (founder, support email, demo URL,
build record URL, changelog, checkout URL, domain). They may stay blank. While
blank, each section renders as a clearly labeled slot. No blank value is shown
as if it were real, and no configuration note appears in public page copy.

`config.js` holds the brand name, version, and the founding Operator price
hypothesis.

## Preview state

- Checkout is disabled and marked `PREVIEW ONLY`.
- The Facilitator tier is absent.
- The founder, support, demo recording, and public Build Record are labeled
  slots until their real launch inputs exist.
