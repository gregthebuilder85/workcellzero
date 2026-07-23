/* WORKCELL ZERO // public site configuration.
   Brand, version, the founding Operator price hypothesis, and the founding-list
   toggle. The founding-list form posts to the server function at /api/subscribe,
   which holds all secrets in environment variables. No keys live in the client. */
window.WORKCELL_ZERO_CONFIG = {
  brandName: "WORKCELL ZERO",
  version: "1.2",
  lastInspected: "2026-07-23",
  operatorPrice: "$99",

  // Founding-list capture (handled server-side at /api/subscribe)
  foundingListEnabled: true,
  foundingListEndpoint: "/api/subscribe"
};
