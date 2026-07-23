/* WORKCELL ZERO // public site configuration.
   Brand, version, the founding Operator price hypothesis, and the founding-list
   backend. The Supabase anon key is a PUBLIC key, designed to be shipped in the
   browser. Security is enforced by Row Level Security on the founding_list table
   (anonymous INSERT only, no reads). Never place the service_role or secret key
   here. */
window.WORKCELL_ZERO_CONFIG = {
  brandName: "WORKCELL ZERO",
  version: "1.2",
  lastInspected: "2026-07-23",
  operatorPrice: "$99",

  // Founding-list capture (public values only)
  foundingListEnabled: true,
  supabaseUrl: "https://zuvqgqwlmdfprpbnqbue.supabase.co",
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1dnFncXdsbWRmcHJwYm5xYnVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0ODE2NjYsImV4cCI6MjEwMDA1NzY2Nn0.RBQqkZD8QwJd6ee2L5l_Ta6Es4O-ibs1NI6I8w0SAzI",
  foundingListTable: "founding_list"
};
