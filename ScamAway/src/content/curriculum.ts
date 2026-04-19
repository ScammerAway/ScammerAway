// ScamSchool content. Modular: add lessons + scenarios by editing this file.
export type Audience = "teen" | "adult" | "senior" | "all";

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
  result: "safe" | "partial" | "scammed";
  feedback: string;
  next?: string;
};

export type DialogNode = {
  id: string;
  speaker: string;
  message: string;
  choices: Choice[];
};

export type Scenario = {
  id: string;
  title: string;
  emoji: string;
  audiences: Audience[];
  scammerType: string;
  persona: string;
  legitimate: boolean;
  redFlags: string[];
  channel: "sms" | "phone" | "email" | "dm" | "video-call";
  start: string;
  nodes: Record<string, DialogNode>;
};

export const LESSONS: Lesson[] = [
  {
    id: "identity-theft-phishing",
    title: "Identity Theft & Account Takeover",
    emoji: "🆔",
    audiences: ["teen", "adult", "senior", "all"],
    summary:
      "Scammers use fake 'Security Alerts' from banks or apps to trick you into entering your login credentials on a fake website, allowing them to steal your identity and access your accounts.",
    redFlags: [
      "Emails/Texts with 'New Login' or 'Unauthorized Access' warnings",
      "Links that lead to a site that isn't the official domain (e.g., bank-secure-login.com vs bank.com)",
      "Requests to verify your identity by providing your SSN, DOB, or full credit card number",
      "Urgency: 'Account will be locked if you don't verify now'",
    ],
    tips: [
      "Never click the link in a 'security alert'. Open your browser and type the bank's URL yourself.",
      "Enable Multi-Factor Authentication (MFA/2FA) on all important accounts.",
      "Real companies will never ask for your full SSN or password via email.",
    ],
  },
  {
    id: "advance-fee-fraud",
    title: "Advance-Fee & Inheritance Scams",
    emoji: "💰",
    audiences: ["adult", "senior", "all"],
    summary:
      "Scammers offer you a large sum of money (inheritance, lottery, or business deal) in exchange for paying a small 'fee' or 'tax' upfront. You pay the fee, but the money never arrives.",
    redFlags: [
      "Unsolicited emails from strangers claiming they have millions for you",
      "Requests to pay taxes, legal fees, or 'processing' fees to unlock the funds",
      "Extreme secrecy required ('Don't tell anyone, for your protection')",
      "Uses high-pressure, formal, or emotional language",
    ],
    tips: [
      "If you have to pay money to get money, it is a scam.",
      "Real inheritances or business deals go through official, traceable channels, not random emails.",
      "Never share bank details, social security numbers, or passports with strangers online.",
    ],
  },
  {
    id: "tech-support-scam",
    title: "Tech Support Impersonation",
    emoji: "💻",
    audiences: ["adult", "senior", "all"],
    summary:
      "Scammers use fake browser pop-ups or cold calls claiming your computer has a 'critical virus' to trick you into granting remote access and paying for fake repairs.",
    redFlags: [
      "Browser pop-up with loud alarms or flashing lights",
      "Claims your 'Windows/Apple license is expired' or 'compromised'",
      "Demands you install 'remote access' software (AnyDesk, TeamViewer)",
      "Urgency: 'Do not restart your computer or you will lose your data'",
    ],
    tips: [
      "No legitimate tech company (Microsoft, Apple, etc.) will ever call you out of the blue.",
      "Browser pop-ups cannot scan your computer for viruses.",
      "If you are locked in a browser, use Ctrl+Alt+Del (or Command+Option+Esc) to force quit the browser.",
    ],
  },
  {
    id: "refund-overpayment",
    title: "The 'Accidental' Refund Scam",
    emoji: "💸",
    audiences: ["senior", "adult", "all"],
    summary:
      "A scammer claims they accidentally refunded you too much money (e.g., $5,000 instead of $50) and begs you to 'send back' the difference immediately.",
    redFlags: [
      "Caller claims they made a 'clerical error' and refunded too much",
      "They demand you return the 'extra' money via gift cards or wire transfer",
      "They try to keep you on the line so you can't verify your actual bank balance",
      "They ask for remote access to your computer to 'check the transaction'",
    ],
    tips: [
      "If you see an unexpected deposit, never call the number provided by the caller. Call your bank's official number from the back of your card.",
      "No legitimate business will ever ask you to return a refund using gift cards.",
      "Never let someone you don't know use remote access software on your computer.",
    ],
  },
  {
    id: "game-currency-generator",
    title: "Free Game Currency Generators",
    emoji: "🎮",
    audiences: ["teen", "all"],
    summary:
      "Sites promising 'Unlimited Gems,' 'Robux,' or 'V-Bucks' are scams. They exist to steal your account credentials or force you to complete surveys that make the scammer money.",
    redFlags: [
      "Claims of 'Unlimited' or 'Free' currency",
      "Requires you to enter your game username AND password",
      "Asks for 'Human Verification' by completing random surveys/app downloads",
      "URL doesn't match the official game developer's domain",
    ],
    tips: [
      "Official currency is only generated through the game's official store/client.",
      "Never enter your password on any site that isn't the game's official login portal.",
      "If you see 'Human Verification' surveys, leave immediately — it's a trap.",
    ],
  },
  {
    id: "youtube-telegram-scam",
    title: "YouTube Comment & Telegram Scams",
    emoji: "💬",
    audiences: ["teen", "adult", "all"],
    summary:
      "Scammers post bot-like comments on popular videos promising huge profits, then lure you to a Telegram or WhatsApp channel to 'invest.'",
    redFlags: [
      "Comments praising a random person for making them rich",
      "Links pointing to Telegram, WhatsApp, or private messengers",
      "Broken English or repetitive, generic praise",
      "Urgency: 'I only have a few spots left for my course/trading group'",
    ],
    tips: [
      "Never click links in YouTube comments — they are almost always spam.",
      "Professional traders do not recruit clients via YouTube comment sections.",
      "Report the comment as spam/scam and ignore it.",
    ],
  },
  {
    id: "influencer-crypto",
    title: "Influencer Crypto Giveaways",
    emoji: "🚀",
    audiences: ["teen", "adult", "all"],
    summary:
      "Influencers do not give away money to random followers. Scammers create fake accounts that look verified to trick you into 'doubling' your crypto or connecting your wallet to a drainer site.",
    redFlags: [
      "Handle is slightly misspelled (e.g., @MrBeast_Official_Giv)",
      "Requests a 'small' payment or wallet connection to 'verify' you",
      "Promises '10x returns' or 'doubling' your money",
      "Urgency: 'Only 5 slots left for the giveaway!'",
    ],
    tips: [
      "If it sounds like 'free money,' it's a scam.",
      "Always check the handle, not just the display name.",
      "Never connect your crypto wallet to a link sent in a DM.",
    ],
  },
  {
    id: "irs-impersonation",
    title: "Government Impersonation",
    emoji: "🏛️",
    audiences: ["adult", "senior", "all"],
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
    audiences: ["senior", "all"],
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
    audiences: ["teen", "adult", "senior", "all"],
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
    audiences: ["adult", "senior", "all"],
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
    audiences: ["teen", "adult", "all"],
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
    audiences: ["teen", "adult", "all"],
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

export const SCENARIOS: Scenario[] = [
  {
    id: "bank-security-alert",
    title: "The 'Unauthorized Login' Alert",
    emoji: "🆔",
    audiences: ["adult", "senior", "all"],
    scammerType: "Phishing / Identity Theft",
    persona:
      "An automated-looking email from a major bank. It claims a login occurred from a different country. The link leads to a pixel-perfect replica of the bank's login page designed to capture usernames and passwords.",
    legitimate: false,
    channel: "email",
    redFlags: [
      "Generic greeting ('Dear Customer')",
      "Link URL is suspicious",
      "Panic-inducing language about account lockouts",
    ],
    start: "n1",
    nodes: {
      n1: {
        id: "n1",
        speaker: "📧 Alert from 'BankSupport'",
        message:
          "SECURITY ALERT: A login attempt was detected from Russia. If this was not you, please secure your account immediately: https://login-bank-verification.com/secure",
        choices: [
          { id: "c1", label: "Go to your bank's app directly to check alerts", result: "safe", feedback: "Perfect. Always use your official app or bookmark, never links in emails." },
          { id: "c2", label: "Click the link to see if it's real", result: "partial", feedback: "Even clicking the link can sometimes trigger a browser exploit. Stay away.", next: "n2" },
          { id: "c3", label: "Enter your credentials on the site", result: "scammed", feedback: "Your username and password have just been sent directly to the scammer.", next: "n3" },
        ],
      },
      n2: {
        id: "n2",
        speaker: "🌐 Fake Bank Login Page",
        message:
          "Please verify your identity. Enter your username, password, and for security: your full Social Security Number.",
        choices: [
          { id: "c1", label: "Close the page immediately", result: "safe", feedback: "Correct. A bank will NEVER ask for your SSN on a login page like this." },
          { id: "c2", label: "Enter the info", result: "scammed", feedback: "You have just handed them the keys to your financial identity. They can now open loans in your name.", next: "n3" },
        ],
      },
      n3: {
        id: "n3",
        speaker: "🌐 Fake Bank Login Page",
        message:
          "Verification successful. You will be redirected to your dashboard in 5 seconds. (You are actually redirected to the real bank homepage).",
        choices: [
          { id: "c1", label: "Change your password on the REAL site immediately", result: "partial", feedback: "You realized too late, but changing your password now might save your account." },
          { id: "c2", label: "Wait to be redirected", result: "scammed", feedback: "The scammer now has your credentials. They will likely change your password and lock you out within minutes." },
        ],
      },
    },
  },
  {
    id: "inheritance-email",
    title: "The 'Unclaimed Fortune' Email",
    emoji: "💰",
    audiences: ["adult", "senior", "all"],
    scammerType: "Advance-Fee Fraud (The 'Nigerian Prince' variant)",
    persona:
      "A 'High-Court Attorney' from a foreign country. They claim to have discovered an unclaimed fortune belonging to a distant relative of yours. They need your help to move the funds.",
    legitimate: false,
    channel: "email",
    redFlags: [
      "Formal but desperate tone",
      "Promise of massive wealth for minimal effort",
      "Request for secrecy",
      "Immediate demand for 'processing fees'",
    ],
    start: "n1",
    nodes: {
      n1: {
        id: "n1",
        speaker: "📧 Attorney James K.",
        message:
          "Dear Sir/Madam, I am an attorney representing the estate of a late client with your same surname. There is a dormant account containing $8,500,000. As the next of kin, you are entitled to this, but we must transfer it quickly before the government seizes it. Reply to proceed.",
        choices: [
          { id: "c1", label: "Delete the email immediately", result: "safe", feedback: "Perfect. Legitimate inheritances are handled by local probate courts, not random lawyers via email." },
          { id: "c2", label: "Reply: 'How did you find me?'", result: "partial", feedback: "Engaging confirms your email is active. They will use this to ramp up pressure.", next: "n2" },
          { id: "c3", label: "'I am interested, tell me more'", result: "scammed", feedback: "You've taken the bait. Now they will start asking for your info and fees.", next: "n3" },
        ],
      },
      n2: {
        id: "n2",
        speaker: "📧 Attorney James K.",
        message:
          "I found your contact through an international registry. This is a very sensitive matter. To verify your identity and release the funds to your bank account, you must pay a $500 'legal processing fee'.",
        choices: [
          { id: "c1", label: "Block the sender", result: "safe", feedback: "Correct. Never pay a fee to access 'winnings' or 'inheritances'." },
          { id: "c2", label: "Ask if it can be deducted from the $8M", result: "partial", feedback: "They will invent a 'legal reason' why it must be paid upfront. Don't fall for the logic trap.", next: "n3" },
        ],
      },
      n3: {
        id: "n3",
        speaker: "📧 Attorney James K.",
        message:
          "I am sorry, but the fee must be paid in advance via wire transfer or crypto. Time is running out, the government is about to close the account!",
        choices: [
          { id: "c1", label: "Stop communicating and delete everything", result: "safe", feedback: "Yes. The 'government is seizing it' is a classic fear tactic to make you pay fast." },
          { id: "c2", label: "Send the $500", result: "scammed", feedback: "The money is gone. Tomorrow, they will claim there's a 'tax' fee, then a 'bribe' fee. They will never stop until you run out of money." },
        ],
      },
    },
  },
  {
    id: "tech-support-pop-up",
    title: "The 'Critical Virus' Pop-up",
    emoji: "💻",
    audiences: ["adult", "senior", "all"],
    scammerType: "Tech support / Remote access scam",
    persona:
      "A fake 'Microsoft Certified' technician. Very polite but authoritative. They want you to believe your computer is about to be wiped unless you let them 'fix' the security breach remotely.",
    legitimate: false,
    channel: "phone",
    redFlags: [
      "Claiming a 'critical security breach'",
      "Requesting remote access software",
      "Demanding payment for 'subscription support' fees",
    ],
    start: "n1",
    nodes: {
      n1: {
        id: "n1",
        speaker: "📞 'Microsoft Support'",
        message:
          "Hello, this is David from Microsoft Security. We've detected a critical virus on your machine that is currently uploading your personal files to a public server. I can help you secure it, but you must download our protection tool immediately. Are you at your computer?",
        choices: [
          { id: "c1", label: "Hang up. Microsoft doesn't monitor your PC.", result: "safe", feedback: "Correct. Microsoft will never call you to report a virus on your computer." },
          { id: "c2", label: "Ask: 'Which computer is infected?'", result: "partial", feedback: "They will guess and likely get it wrong. But don't engage—just hang up.", next: "n2" },
          { id: "c3", label: "Panic and say 'Yes, I'm at my computer'", result: "scammed", feedback: "They've hooked you. The next step will be them asking for remote access.", next: "n3" },
        ],
      },
      n2: {
        id: "n2",
        speaker: "📞 'David'",
        message:
          "We can see the logs on our server! It's the Windows 10/11 machine. I need you to go to 'Support.me' and download the helper tool so I can scan the system for you.",
        choices: [
          { id: "c1", label: "Close the browser and restart PC", result: "safe", feedback: "Perfect. Using Task Manager to kill the browser is the best way to escape these pop-ups." },
          { id: "c2", label: "Download the 'helper tool'", result: "scammed", feedback: "You just gave them full control of your computer. They can now see your bank logins.", next: "n3" },
        ],
      },
      n3: {
        id: "n3",
        speaker: "📞 'David'",
        message:
          "Okay, I'm connected. Wait—I see suspicious activity in your bank account! We need to move your funds to a 'secure' wallet while I clean the system.",
        choices: [
          { id: "c1", label: "Force shut down the computer immediately", result: "safe", feedback: "Great move. If you are already connected, unplugging the PC/Wi-Fi is the fastest way to kick them out." },
          { id: "c2", label: "Follow his instructions", result: "scammed", feedback: "This is the final stage of the scam. He is going to drain your accounts." },
        ],
      },
    },
  },
  {
    id: "refund-scam",
    title: "The Accidental Refund",
    emoji: "💸",
    audiences: ["senior", "adult", "all"],
    scammerType: "Refund overpayment scam",
    persona:
      "A frantic 'customer support representative' claiming they accidentally processed a $5,000 refund instead of $50. They are weeping and claiming they will be fired if you don't return the money.",
    legitimate: false,
    channel: "phone",
    redFlags: [
      "High emotional pressure (fear of losing job)",
      "Urgency to act before checking the bank",
      "Requests payment via non-traceable methods",
    ],
    start: "n1",
    nodes: {
      n1: {
        id: "n1",
        speaker: "📞 'Support' Rep (Crying)",
        message:
          "Oh no, I've made a terrible mistake. I refunded you $5,000 for your subscription instead of $50. My boss is going to fire me! Please, you have to return the $4,950 or I lose my job. Can you send it back via Apple gift cards?",
        choices: [
          { id: "c1", label: "Hang up and check your real bank balance", result: "safe", feedback: "Perfect. 99% of the time, the 'deposit' is fake or doesn't exist at all." },
          { id: "c2", label: "Ask: 'How do I know this is real?'", result: "partial", feedback: "They will fake a screenshot or claim they see the money in your account. Don't trust them.", next: "n2" },
          { id: "c3", label: "Feel bad and ask how to help", result: "scammed", feedback: "They are manipulating your empathy. Do not send any money.", next: "n3" },
        ],
      },
      n2: {
        id: "n2",
        speaker: "📞 'Support' Rep",
        message:
          "I can send you a confirmation email! But please, you must go to the store and get the gift cards now. If you don't help me, I lose everything today.",
        choices: [
          { id: "c1", label: "Hang up. Gift cards are never used for refunds.", result: "safe", feedback: "Exactly. No business on earth uses gift cards to receive 'refunds'." },
          { id: "c2", label: "Agree to go to the store", result: "scammed", feedback: "You are being robbed. They are using your fear and empathy against you.", next: "n3" },
        ],
      },
      n3: {
        id: "n3",
        speaker: "📞 'Support' Rep",
        message:
          "Thank you! Please stay on the line with me while you drive to the store so I know you're coming.",
        choices: [
          { id: "c1", label: "Realize this is a trap and hang up", result: "partial", feedback: "Good catch. The 'stay on the line' tactic is designed to stop you from thinking clearly." },
          { id: "c2", label: "Keep following instructions", result: "scammed", feedback: "Once you buy those cards and read the codes, that money is gone forever." },
        ],
      },
    },
  },
  {
    id: "free-currency-gen",
    title: "The 'Unlimited Robux' Generator",
    emoji: "🎮",
    audiences: ["teen", "all"],
    scammerType: "Phishing / Credential harvesting",
    persona:
      "A slick, professional-looking website claiming to be a 'Currency Generator'. It shows progress bars, 'recent user' notifications, and asks for login info.",
    legitimate: false,
    channel: "email", // Could also be a link in a DM
    redFlags: [
      "Asking for password",
      "Fake progress bars/popups",
      "Domain name is sketchy (e.g., free-robux-gen2026.net)",
      "Requires 'Human Verification' surveys",
    ],
    start: "n1",
    nodes: {
      n1: {
        id: "n1",
        speaker: "🌐 Generator Website",
        message:
          "Enter your username and password below to receive 10,000 free tokens instantly! 100% secure and encrypted.",
        choices: [
          { id: "c1", label: "Close the site immediately", result: "safe", feedback: "Perfect. No legitimate site will ever ask for your password like this." },
          { id: "c2", label: "Enter username and fake password", result: "partial", feedback: "Smart, but don't even engage. They might log your IP or redirect you to malware.", next: "n2" },
          { id: "c3", label: "Enter real credentials", result: "scammed", feedback: "Never do this. Your account is now being stolen as we speak.", next: "n3" },
        ],
      },
      n2: {
        id: "n2",
        speaker: "🌐 Generator Website",
        message:
          "Success! Now, just complete 2 quick 'Human Verification' offers (install an app or take a survey) to prove you aren't a robot.",
        choices: [
          { id: "c1", label: "Exit the site", result: "safe", feedback: "Good. 'Human Verification' is just a way for them to make ad money off your clicks." },
          { id: "c2", label: "Complete a survey", result: "scammed", feedback: "You just made money for the scammer. They still won't give you any currency.", next: "n3" },
        ],
      },
      n3: {
        id: "n3",
        speaker: "🌐 Generator Website",
        message:
          "Error: Verification failed. Please try 3 more offers.",
        choices: [
          { id: "c1", label: "Realize it's a loop and close the tab", result: "partial", feedback: "They will keep you in this loop forever. Block the site." },
          { id: "c2", label: "Keep clicking offers", result: "scammed", feedback: "You're just generating profit for the scammer. They never intended to give you currency." },
        ],
      },
    },
  },
  {
    id: "yt-comment-funnel",
    title: "The 'Secret Trader' Comment",
    emoji: "💬",
    audiences: ["teen", "adult", "all"],
    scammerType: "YouTube to Telegram funnel scam",
    persona:
      "A bot account posing as a grateful student. Claims they made $10,000 using 'Mr. Smith's trading method' on Telegram. They are very insistent that you message 'Mr. Smith' directly.",
    legitimate: false,
    channel: "dm",
    redFlags: [
      "Unsolicited comment on a video",
      "Redirecting to a private messenger (Telegram)",
      "Fake 'testimonial' language",
    ],
    start: "n1",
    nodes: {
      n1: {
        id: "n1",
        speaker: "💬 YouTube Comment (Bot)",
        message:
          "I was struggling until I followed Mr. Smith's strategy! He taught me how to trade crypto and I made $5k this week. You should message him on Telegram: @MrSmith_Trader_Official",
        choices: [
          { id: "c1", label: "Report as spam and ignore", result: "safe", feedback: "Perfect. Reputable experts never recruit through YouTube comment sections." },
          { id: "c2", label: "Check the Telegram profile out of curiosity", result: "partial", feedback: "It's easy to get sucked in. The Telegram channel will look 'professional' with fake testimonials, but it's all staged.", next: "n2" },
          { id: "c3", label: "Message @MrSmith_Trader_Official", result: "scammed", feedback: "You've entered the funnel. He will now spend days building trust before asking for money.", next: "n3" },
        ],
      },
      n2: {
        id: "n2",
        speaker: "💬 Telegram Channel",
        message:
          "Welcome to the Inner Circle! (The channel has 10k members, but most are bots). See these screenshots of payouts? Invest $500 today to join the Gold Tier and get $5,000 in returns.",
        choices: [
          { id: "c1", label: "Leave the channel and block", result: "safe", feedback: "Correct. High returns with low risk are the hallmark of a Ponzi/Investment scam." },
          { id: "c2", label: "Ask how to send the $500", result: "scammed", feedback: "You are now being groomed for a classic 'advance-fee' fraud.", next: "n3" },
        ],
      },
      n3: {
        id: "n3",
        speaker: "💬 @MrSmith_Trader_Official",
        message:
          "Send the funds to this wallet address. Once confirmed, I'll trade for you and release your profits. It's a guaranteed win!",
        choices: [
          { id: "c1", label: "Block and report to Telegram", result: "partial", feedback: "Good catch, though you've already engaged significantly. Don't send a cent." },
          { id: "c2", label: "Send the money", result: "scammed", feedback: "This money is effectively burned. Once crypto is sent to a scammer's wallet, it is non-recoverable." },
        ],
      },
    },
  },
  {
    id: "influencer-giveaway",
    title: "The 'Giveaway' DM",
    emoji: "🚀",
    audiences: ["teen", "adult", "all"],
    scammerType: "Influencer crypto giveaway scam",
    persona:
      "A fake account mimicking a famous tech YouTuber. Very hyped up, uses emojis, claims to be 'giving back' to the community by doubling crypto deposits.",
    legitimate: false,
    channel: "dm",
    redFlags: [
      "Unsolicited DM from a famous person",
      "Asking for crypto transfer to 'verify' wallet",
      "Claims of 'doubling' money",
      "Aggressive urgency",
    ],
    start: "n1",
    nodes: {
      n1: {
        id: "n1",
        speaker: "💬 @TechGuy_Giveaway (Fake)",
        message:
          "Hey! Thanks for following the channel! I'm doing a huge community giveaway. Send 0.1 ETH to my wallet, and I'll send back 0.5 ETH instantly to reward my top fans. Only 5 slots left!",
        choices: [
          { id: "c1", label: "Block and report the account", result: "safe", feedback: "Perfect. No legitimate influencer will ever ask you to send them money to get money back." },
          { id: "c2", label: "Ask: 'Is this real?'", result: "partial", feedback: "They will use fake screenshots to 'prove' it's real. Don't engage.", next: "n2" },
          { id: "c3", label: "Send the 0.1 ETH", result: "scammed", feedback: "Your money is gone. You've just sent it directly to a scammer.", next: "n3" },
        ],
      },
      n2: {
        id: "n2",
        speaker: "💬 @TechGuy_Giveaway",
        message:
          "Of course it's real! Look at my pinned tweet! (He sends a link to a fake website that looks like a crypto dashboard). Just connect your wallet to verify you're a real fan and claim your 0.5 ETH.",
        choices: [
          { id: "c1", label: "Close the site and block", result: "safe", feedback: "Good catch. Connecting your wallet to a 'giveaway' site often gives them permission to drain all your funds." },
          { id: "c2", label: "Connect my wallet", result: "scammed", feedback: "You just authorized them to empty your entire crypto wallet. Never connect to random links." },
        ],
      },
      n3: {
        id: "n3",
        speaker: "💬 @TechGuy_Giveaway",
        message:
          "Transaction received! Processing... wait, there's a network error. Send another 0.1 ETH to 'activate' the return transaction.",
        choices: [
          { id: "c1", label: "Realize it's a scam and block", result: "partial", feedback: "You learned the hard way, but stopping now saves you from losing even more." },
          { id: "c2", label: "Send more money", result: "scammed", feedback: "The 'activation fee' trick is standard. They will keep asking for more until you stop paying." },
        ],
      },
    },
  },
  {
    id: "irs-call",
    title: "An urgent call from 'the IRS'",
    emoji: "🏛️",
    audiences: ["adult", "senior", "all"],
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
    audiences: ["senior", "all"],
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
    audiences: ["teen", "adult", "senior", "all"],
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
    audiences: ["adult", "senior", "all"],
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
    audiences: ["teen", "adult", "all"],
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
    audiences: ["teen", "adult", "senior", "all"],
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