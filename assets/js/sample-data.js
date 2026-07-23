/* Illustrative sample-run data for the SYSTEM 01 interactive sample.
   Teaching examples only. No revenue, conversion, or validation claims. */
window.WORKCELL_SAMPLE_DATA = {
  consultant: {
    idea: "I perform the same onboarding audit for every new design client. I want to package the diagnosis instead of repeating it by hand.",
    stages: [
      ["SPARK", "A repeatable audit exists. The customer is a small design agency preparing for a client kickoff. The neutral question asks whether the repeated diagnosis can become a useful first product.",
        "SPARK CARD\nCustomer: independent design agency\nRepeated job: readiness audit\nAsset: existing questions and judgment\nUnknown: will buyers trust an automated result?"],
      ["SCAN", "Comparable questionnaires collect information but rarely interpret readiness. Consultants already sell audits and implementation reviews. Contradictory evidence: some clients may prefer the audit as part of the core service.",
        "EVIDENCE STATUS: WORKABLE\nExisting spend: consultant audit\nAlternative: static intake form\nReachable group: prior prospects\nConstraint: do not overstate diagnosis"],
      ["LOCK", "Existing forms help clients send information, but they fail to diagnose missing prerequisites, forcing consultants to repeat the same manual review.",
        "DECISION: BUILD\nOpening: guided readiness diagnostic\nDangerous assumption: people will complete it before a call"],
      ["BLUEPRINT", "Three shapes compared. The strongest first shape is a guided diagnostic with an optional paid human review. A template pack is easier to copy. A full app is unnecessary.",
        "WORK ORDER\nOffer: readiness diagnosis\nPrice hypothesis: low-cost front end\nRevenue: paid review\nFirst test: prior prospects"],
      ["BUILD", "The user answers twelve questions and receives a tailored readiness profile, missing prerequisites, and a one-week preparation list.",
        "CORE JOURNEY\nInput: 12 questions\nLogic: transparent readiness rules\nOutput: tailored action list\nQuit rule: under 5 minutes"],
      ["LAUNCH", "The page demonstrates the assessment before asking for payment. The paid offer is a human review, not an inflated promise that software replaces expertise.",
        "SHOP\nHeadline: Find what will delay kickoff before it starts\nAction: Run the readiness check\nPaid step: book a review"],
      ["TEST", "Invite prior prospects to complete the diagnostic. Track starts, completions, review bookings, objections, and repeated missing items.",
        "TEST ORDER\nAudience: prior prospects\nSignal: completion plus review demand\nInconclusive: tracking failure"],
      ["DECIDE", "Continue when people complete the assessment and request help. Narrow when one client type shows the strongest pattern. Stop when no one completes without live guidance.",
        "DECISION RECORD\nBehavior beats praise\nPreserve the previous version\nChange one thing at a time"]
    ]
  },
  service: {
    idea: "I answer the same mobile-grooming quote questions by text. I want a better way to price and book each request.",
    stages: [
      ["SPARK", "A repeated quote process can become a service front door. The customer is a local pet owner who wants a realistic range before booking.",
        "SPARK CARD\nAsset: real price menu\nRepeated job: qualify and quote\nConstraint: no false fixed price"],
      ["SCAN", "Booking tools accept appointments, but the price depends on size, coat, condition, temperament, and travel. Owners abandon long forms when they see no useful range.",
        "EVIDENCE STATUS: WORKABLE\nExisting behavior: text chain\nAlternative: generic booking form\nConstraint: service area and safety"],
      ["LOCK", "Existing tools schedule the appointment but fail to qualify and explain a range. The opening is a short estimate path tied to real service rules.",
        "DECISION: BUILD\nOpening: quote plus qualification\nDangerous assumption: form completion"],
      ["BLUEPRINT", "Start as the existing business front door. Sell a reusable template or setup service only after the operator proves the logic.",
        "WORK ORDER\nUser and payer: pet owner\nRevenue: grooming service\nTest: route one week of inquiries"],
      ["BUILD", "The flow checks area, size, coat, condition, and temperament, then returns a range and appointment request.",
        "CORE JOURNEY\nUnder 90 seconds\nProgress visible\nEstimate assumptions shown"],
      ["LAUNCH", "The page promises a realistic estimate without a long text chain. It does not promise a final price before inspection.",
        "SHOP\nAction: Check my dog and area\nConversion: request appointment"],
      ["TEST", "Send every new inquiry to the flow for one week and compare completions, confirmed jobs, manual messages, and estimate corrections.",
        "TEST ORDER\nSignal: less chasing and stable estimates\nInconclusive: too few inquiries"],
      ["DECIDE", "Change price logic when estimates are regularly corrected. Narrow when one service type causes most confusion.",
        "DECISION RECORD\nMeasure completion and booking\nDo not count compliments"]
    ]
  },
  calculator: {
    idea: "I keep rebuilding the same commercial-cleaning supply estimate in a spreadsheet. The formula should become a simple product.",
    stages: [
      ["SPARK", "The spreadsheet contains useful logic. The customer is a small cleaning operator preparing a new contract or reorder.",
        "SPARK CARD\nAsset: working formula\nJob: estimate consumables\nConstraint: show assumptions"],
      ["SCAN", "Supplier calculators exist but often tie estimates to a catalog and hide the assumptions. Small operators rely on recent orders and spreadsheets.",
        "EVIDENCE STATUS: WORKABLE\nExisting spend: supplies and time\nAlternative: distributor tool\nRisk: safety and dilution claims"],
      ["LOCK", "The opening is an independent consumables calculator with transparent ranges and an editable reorder schedule.",
        "DECISION: NARROW\nExclude regulated chemical dosing\nStart with paper, liners, and basic consumables"],
      ["BLUEPRINT", "Build a utility first, then offer a paid supply audit when a user wants expert review.",
        "WORK ORDER\nOffer: monthly range and purchase list\nPrice hypothesis: self-serve tool\nAudit hypothesis: reviewed report"],
      ["BUILD", "Building size, frequency, occupancy, and room counts produce low, expected, and high ranges.",
        "CORE JOURNEY\nInputs validated\nRanges, not false precision\nAssumptions editable"],
      ["LAUNCH", "The page shows the calculator and its assumptions. The paid export is useful without pretending to guarantee exact consumption.",
        "SHOP\nHeadline: Stop rebuilding the same estimate\nAction: Run the monthly estimate"],
      ["TEST", "A set of operators compare the range with a completed order. Track accuracy, edits, exports, audit requests, and reasons for distrust.",
        "TEST ORDER\nSignal: actuals fall within range\nNarrow: accuracy varies by building type"],
      ["DECIDE", "Continue when the ranges are credible and people export. Change the product when buyers value the audit but not the calculator.",
        "DECISION RECORD\nReal orders are the evidence\nPreserve every assumption change"]
    ]
  }
};
