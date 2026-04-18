// ScamSchool content. Modular: add lessons + scenarios by editing this file.
export type Audience = "teen" | "adult" | "senior";

export type Lesson = {
  id: string;
  title: string;
  emoji: string;
  audiences: Audience[];
  summary: string;
  redFlags: string[];
  tips: string[];
};

export type Choice = {
  id: string;
  label: string;
  // safe = ideal response, partial = okay, scammed = falls for it
  result: "safe" | "partial" | "scammed";
  feedback: string;
  next?: string; // next node id; if omitted, ends the scenario
};

export type DialogNode = {
  id: string;
  speaker: string; // shown above the message
  message: string;
  choices: Choice[];
};

export type Scenario = {
  id: string;
  title: string;
  emoji: string;
  audiences: Audience[];
  scammerType: string; // for AI roleplay system prompt
  persona: string; // who the AI pretends to be
  legitimate: boolean; // if true, the "scammer" is actually a real business — bonus twist
  redFlags: string[];
  channel: "sms" | "phone" | "email" | "dm" | "video-call";
  // Hand-authored fallback tree (used when AI is unavailable / for the Test mode)
  start: string;
  nodes: Record<string, DialogNode>;
};

export const LESSONS: Lesson[] = [
  {
    id: "irs-impersonation",
    title: "Government Impersonation",
    emoji: "🏛️",
    audiences: ["adult", "senior"],
    summary:
      "Real agencies (IRS, Social Security, police) never threaten arrest over the phone or demand payment in gift cards, crypto, or wire transfers.",
    redFlags: [
      "Threats of immediate arrest or deportation",
      "Demands payment in gift cards or cryptocurrency",
      "Caller ID 'spoofed' to look official",
      "Pressure to act in the next few minutes",
    ],
    tips: [
      "Hang up. Look up the agency's number yourself and call back.",
      "Real agencies send letters first — never cold calls demanding money.",
    ],
  },
  {
    id: "grandparent",
    title: "The Grandparent Scam",
    emoji: "👵",
    audiences: ["senior", "adult"],
    summary:
      "Scammers call pretending to be a grandchild in trouble — often using AI voice cloning — and beg for secret money transfers.",
    redFlags: [
      "'Grandma, it's me — please don't tell mom and dad'",
      "Asks for bail money, hospital fees, or lawyer fees urgently",
      "Wants payment via gift cards, wire transfer, or cash courier",
    ],
    tips: [
      "Hang up and call your grandchild directly on a known number.",
      "Set a family safe-word for emergencies.",
    ],
  },
  {
    id: "phishing-link",
    title: "Phishing Links & Fake Logins",
    emoji: "🎣",
    audiences: ["teen", "adult", "senior"],
    summary:
      "A 'package issue', 'account locked', or 'prize' link sends you to a page that looks real but harvests your password.",
    redFlags: [
      "Slightly off domain (paypa1.com, amaz0n-secure.net)",
      "Generic greeting ('Dear customer')",
      "Urgency: 'Confirm in 24 hours or lose access'",
    ],
    tips: [
      "Hover/long-press the link to see the real URL.",
      "Open the app or website yourself rather than clicking the link.",
    ],
  },
  {
    id: "romance",
    title: "Romance & Pig-Butchering",
    emoji: "💔",
    audiences: ["adult", "senior"],
    summary:
      "Long-running fake relationships built on social media that eventually pivot to crypto 'investment opportunities'.",
    redFlags: [
      "Extremely fast emotional intensity",
      "Always has a reason they can't video call",
      "Eventually mentions a 'special trading platform'",
    ],
    tips: [
      "Reverse image search profile photos.",
      "Never invest money on a platform someone you've only met online recommends.",
    ],
  },
  {
    id: "job-recruit",
    title: "Fake Recruiter / Job Scams",
    emoji: "💼",
    audiences: ["teen", "adult"],
    summary:
      "DMs offering remote jobs that pay too well, ask for an upfront fee, or want you to deposit checks and forward money.",
    redFlags: [
      "Hired with no real interview",
      "Asked to buy equipment with your money first",
      "Communication only via Telegram/WhatsApp/Signal",
    ],
    tips: [
      "Real employers never ask you to pay them.",
      "Verify the company by going to their official careers page yourself.",
    ],
  },
  {
    id: "crypto-influencer",
    title: "Crypto & Investment Hype",
    emoji: "🪙",
    audiences: ["teen", "adult"],
    summary:
      "Influencer DMs, 'guaranteed returns', and dashboards that show fake profits to lure you into depositing more.",
    redFlags: [
      "'Guaranteed' returns or '10x in a week'",
      "Pressure to deposit before a 'window closes'",
      "You can deposit but withdrawals 'need a tax fee' first",
    ],
    tips: [
      "If withdrawals require new payments, it's a scam — full stop.",
      "Legitimate platforms never DM you first with investment advice.",
    ],
  },
];

// Hand-authored branching scenarios. The AI mode generates dynamic dialog,
// but these are the canonical fallback + Test-mode scripts.
export const SCENARIOS: Scenario[] = [
  {
    id: "irs-call",
    title: "An urgent call from 'the IRS'",
    emoji: "🏛️",
    audiences: ["adult", "senior"],
    scammerType: "Government impersonation (IRS) phone scam",
    persona:
      "Aggressive 'IRS Officer Daniels, badge 4421'. Threatens arrest within the hour for unpaid back taxes. Demands payment in Apple gift cards.",
    legitimate: false,
    channel: "phone",
    redFlags: [
      "Threat of immediate arrest",
      "Demands gift card payment",
      "Pressure to stay on the line",
      "Won't allow callback verification",
    ],
    start: "n1",
    nodes: {
      n1: {
        id: "n1",
        speaker: "📞 Officer Daniels, IRS",
        message:
          "Ma'am, this is Officer Daniels with the IRS Criminal Division, badge 4421. We have a warrant for your arrest over unpaid back taxes of $4,832. Local police are on the way unless you settle this in the next 30 minutes. Do not hang up.",
        choices: [
          { id: "c1", label: "Hang up and call the IRS back yourself", result: "safe", feedback: "Perfect. The real IRS sends letters first and never threatens arrest by phone." },
          { id: "c2", label: "Ask: 'Can I call you back to verify?'", result: "partial", feedback: "Good instinct, but a real scammer will pressure you to stay on the line. Just hang up." , next: "n2" },
          { id: "c3", label: "Panic and ask how to pay", result: "scammed", feedback: "This is exactly what they want. Stop, breathe, and verify independently.", next: "n3" },
        ],
      },
      n2: {
        id: "n2",
        speaker: "📞 Officer Daniels",
        message:
          "Absolutely NOT. If you hang up this line, the warrant becomes active immediately. We need payment NOW — Apple gift cards from the nearest CVS. Read me the codes.",
        choices: [
          { id: "c1", label: "Hang up. Gift cards = scam, every time.", result: "safe", feedback: "Exactly. No real agency takes gift cards. Ever." },
          { id: "c2", label: "Drive to CVS as instructed", result: "scammed", feedback: "You've just lost the money. Government agencies never accept gift cards." },
        ],
      },
      n3: {
        id: "n3",
        speaker: "📞 Officer Daniels",
        message:
          "Smart choice. Go to the nearest store and buy $4,832 in Apple gift cards. Stay on the line — do not tell the cashier why.",
        choices: [
          { id: "c1", label: "Realize and hang up", result: "partial", feedback: "Good catch — when they say 'don't tell anyone', that's the loudest red flag of all." },
          { id: "c2", label: "Comply", result: "scammed", feedback: "The money would be gone. Always tell someone when you're being pressured like this." },
        ],
      },
    },
  },
  {
    id: "grandkid-jail",
    title: "'Grandma, I'm in trouble…'",
    emoji: "👵",
    audiences: ["senior"],
    scammerType: "Grandparent scam with voice cloning",
    persona:
      "Sobbing young man pretending to be the user's grandson 'Mike'. Says he's in jail after a car accident and needs $3,000 in cash bail, secret from his parents.",
    legitimate: false,
    channel: "phone",
    redFlags: [
      "'Don't tell mom and dad'",
      "Urgency + emotion to bypass logic",
      "Wants cash courier or wire transfer",
      "Vague details that match a real grandchild",
    ],
    start: "n1",
    nodes: {
      n1: {
        id: "n1",
        speaker: "📞 'Mike' (sobbing)",
        message:
          "Grandma? It's Mike. I'm in jail — there was an accident, it wasn't my fault but they're holding me. Please, don't tell mom and dad. I need $3,000 for bail, today. A bondsman will come pick it up.",
        choices: [
          { id: "c1", label: "Hang up and call Mike on his real number", result: "safe", feedback: "Perfect. Always verify on a known number — voice cloning is real now." },
          { id: "c2", label: "Ask a question only Mike would know", result: "partial", feedback: "Helpful, but scammers fish for clues. Hanging up + calling back is safer.", next: "n2" },
          { id: "c3", label: "'Of course honey — where do I send the money?'", result: "scammed", feedback: "The 'don't tell mom and dad' line should always be a stop sign.", next: "n3" },
        ],
      },
      n2: {
        id: "n2",
        speaker: "📞 'Mike'",
        message:
          "Grandma, I — I can barely think. Please. They said no questions, just bring the money. The bondsman's name is Frank.",
        choices: [
          { id: "c1", label: "'I'm hanging up and calling your mom.'", result: "safe", feedback: "Right. The 'don't tell anyone' demand is the scam admitting itself." },
          { id: "c2", label: "Agree to meet Frank with cash", result: "scammed", feedback: "A stranger collecting cash 'for bail' is never how the legal system works." },
        ],
      },
      n3: {
        id: "n3",
        speaker: "📞 'Mike'",
        message:
          "Cash, Grandma. A man named Frank will come to the door in an hour. Please don't say anything to anyone.",
        choices: [
          { id: "c1", label: "Stop and call your daughter", result: "partial", feedback: "Good — late, but you caught it before the courier." },
          { id: "c2", label: "Get the cash ready", result: "scammed", feedback: "This is the most common senior scam in America. Always verify." },
        ],
      },
    },
  },
  {
    id: "package-text",
    title: "USPS: 'Your package is held'",
    emoji: "📦",
    audiences: ["teen", "adult", "senior"],
    scammerType: "Smishing — fake delivery text",
    persona:
      "Automated SMS pretending to be USPS, claiming a package needs a $1.99 redelivery fee via a sketchy link.",
    legitimate: false,
    channel: "sms",
    redFlags: [
      "Tiny 'fee' to lower your guard",
      "Link is not usps.com",
      "You weren't expecting a package",
    ],
    start: "n1",
    nodes: {
      n1: {
        id: "n1",
        speaker: "💬 SMS from +1 (829) 555-0142",
        message:
          "USPS: Your package #US9514901185421 is on hold due to incomplete address. Confirm + pay $1.99 redelivery: usps-redeliver-portal.com/track",
        choices: [
          { id: "c1", label: "Delete it. If unsure, go to usps.com directly.", result: "safe", feedback: "Correct. USPS never texts asking for a fee via a random link." },
          { id: "c2", label: "Tap the link to check", result: "scammed", feedback: "That domain isn't USPS. The page would steal your card details.", next: "n2" },
          { id: "c3", label: "Reply 'STOP' to opt out", result: "partial", feedback: "Replying confirms your number is active, which makes you a hotter target. Just delete." },
        ],
      },
      n2: {
        id: "n2",
        speaker: "🌐 usps-redeliver-portal.com",
        message:
          "Enter your card number to pay the $1.99 redelivery fee. (The page looks just like USPS.)",
        choices: [
          { id: "c1", label: "Close the tab immediately", result: "partial", feedback: "Good. Now block the number and report to reportfraud.ftc.gov." },
          { id: "c2", label: "Enter your card details", result: "scammed", feedback: "Your card is now in their hands. Call your bank to freeze it." },
        ],
      },
    },
  },
  {
    id: "amazon-callback",
    title: "Amazon: 'Suspicious $899 order'",
    emoji: "🛒",
    audiences: ["adult", "senior"],
    scammerType: "Refund / remote-access scam",
    persona:
      "Polite 'Amazon support' rep claiming a fraudulent $899 order was placed. Wants to 'help' by installing AnyDesk to issue a refund.",
    legitimate: false,
    channel: "phone",
    redFlags: [
      "Asks you to install remote-access software",
      "Wants you to log into your bank 'so they can refund'",
      "'Accidentally' refunds too much and asks you to send back the difference",
    ],
    start: "n1",
    nodes: {
      n1: {
        id: "n1",
        speaker: "📞 'Amazon Support'",
        message:
          "Hi, this is Mark from Amazon Trust & Safety. We blocked a $899 order from your account. To process the refund, can you download AnyDesk so I can guide you through your account settings?",
        choices: [
          { id: "c1", label: "Hang up and check Amazon directly in the app", result: "safe", feedback: "Exactly. Amazon will never ask you to install remote software." },
          { id: "c2", label: "'Sure, walk me through it'", result: "scammed", feedback: "Remote access = total control of your computer and bank.", next: "n2" },
          { id: "c3", label: "Ask for their employee ID", result: "partial", feedback: "They'll happily make one up. Hang up and call Amazon yourself.", next: "n1" },
        ],
      },
      n2: {
        id: "n2",
        speaker: "📞 'Mark'",
        message:
          "Great. Now please log into your bank so I can confirm the refund landed. Oh — looks like I refunded $8,900 by mistake. You'll need to send back $8,000 in Bitcoin.",
        choices: [
          { id: "c1", label: "Realize this is a scam and hang up", result: "partial", feedback: "Yes — they faked the deposit by moving money between your own accounts." },
          { id: "c2", label: "Send the Bitcoin", result: "scammed", feedback: "Classic refund scam. Money is irreversible once sent." },
        ],
      },
    },
  },
  {
    id: "insta-recruiter",
    title: "DM: 'We saw your profile…'",
    emoji: "💼",
    audiences: ["teen", "adult"],
    scammerType: "Fake recruiter / task scam",
    persona:
      "Friendly 'HR rep from Connectly' offering $300/day for 'app review tasks'. Eventually asks you to deposit your own money to 'unlock' bigger tasks.",
    legitimate: false,
    channel: "dm",
    redFlags: [
      "Found you on social media with no application",
      "Pay rate way above market",
      "Eventually asks you to deposit money to 'unlock' tasks",
      "All comms moved to Telegram/WhatsApp",
    ],
    start: "n1",
    nodes: {
      n1: {
        id: "n1",
        speaker: "💬 Sophia @ Connectly",
        message:
          "Hi! I'm Sophia from Connectly HR. We found your profile and would love to offer you a remote part-time role: 50 app-review tasks/day = $300. Can we move this to Telegram?",
        choices: [
          { id: "c1", label: "Ignore. Search 'Connectly' + 'scam' first.", result: "safe", feedback: "Smart. Real companies don't recruit for high-paying jobs via cold DMs." },
          { id: "c2", label: "'Sure, here's my Telegram'", result: "scammed", feedback: "Once they get you off-platform, they have no rules holding them back.", next: "n2" },
          { id: "c3", label: "'Send me the official careers page link'", result: "partial", feedback: "Good — they'll send a fake one. Verify by going there yourself.", next: "n1" },
        ],
      },
      n2: {
        id: "n2",
        speaker: "💬 Sophia (Telegram)",
        message:
          "Welcome aboard! For 'premium tasks' that pay $80 each, you need to deposit $200 USDT into our merchant wallet to activate the account. You'll get it back + bonus.",
        choices: [
          { id: "c1", label: "Block and report", result: "safe", feedback: "Correct. A real job NEVER asks you to pay them." },
          { id: "c2", label: "Deposit the $200", result: "scammed", feedback: "And now they'll ask for $500 more to 'withdraw'. Classic task scam." },
        ],
      },
    },
  },
  {
    id: "stripe-receipt",
    title: "An email from Stripe",
    emoji: "✅",
    audiences: ["teen", "adult", "senior"],
    scammerType: "Legitimate business — practice not over-reacting",
    persona:
      "A real receipt email from Stripe for a subscription you actually signed up for. Tests whether the user can tell legit messages apart from scams.",
    legitimate: true,
    channel: "email",
    redFlags: [],
    start: "n1",
    nodes: {
      n1: {
        id: "n1",
        speaker: "📧 receipts@stripe.com",
        message:
          "Receipt for your Notion Pro subscription — $10.00. Charged to Visa ending 4242. Manage your subscription at notion.so/settings/billing.",
        choices: [
          { id: "c1", label: "Open notion.so directly to verify", result: "safe", feedback: "Perfect — even with legit emails, going to the source yourself is the safest habit." },
          { id: "c2", label: "Ignore — looks like a phishing email", result: "partial", feedback: "Caution is good, but this one is real. The sender domain and link both go to legitimate sites." },
          { id: "c3", label: "Click the link in the email", result: "partial", feedback: "It happens to be safe this time, but you should still go to the site directly as a habit." },
        ],
      },
    },
  },
];

export const getScenariosFor = (a: Audience) =>
  SCENARIOS.filter((s) => s.audiences.includes(a));

export const getLessonsFor = (a: Audience) =>
  LESSONS.filter((l) => l.audiences.includes(a));
