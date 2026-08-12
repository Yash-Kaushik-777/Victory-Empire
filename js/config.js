/* ============================================================
   VICTORY EMPIRE — CENTRAL CONFIGURATION & DATA SOURCE OF TRUTH
   ============================================================ */

export const CONFIG = {
  brand: {
    name: "Victory Empire",
    tagline: "BUILD AN EMPIRE.",
    heroTitle: "WE BUILD HIGH-IMPACT CONTENT ENGINES THAT",
    heroHighlight: "SCALE BRANDS & CREATORS",
    heroDescription: "Victory Empire produces cinematic video content, viral short-form systems, and high-converting YouTube strategies that position founders and brands as category leaders.",
    statValue: "20+",
    statUnit: "HOURS SAVED",
    statPeriod: "EVERY WEEK.",
    statDescription: "Our end-to-end content production engine handles strategy, scripting, editing, animation, and multi-platform distribution so founders focus purely on growth."
  },

  // Hero Video Configuration
  heroVideo: {
    youtubeId: "IIXFieJU2vY",
    videoUrl: "https://youtu.be/IIXFieJU2vY",
    posterUrl: "https://img.youtube.com/vi/IIXFieJU2vY/maxresdefault.jpg"
  },

  // Centralized Configuration for Trusted Client / Partner Names (Orbiting Trust Sphere)
  trustedPartners: [
    { name: "buildspace", weight: "800", casing: "lowercase" },
    { name: "TKS", weight: "900", casing: "uppercase" },
    { name: "Wio", weight: "700", casing: "normal" },
    { name: "HUB71", weight: "900", casing: "uppercase" },
    { name: "Forma", weight: "600", casing: "normal" },
    { name: "Superteam UAE", weight: "700", casing: "normal" },
    { name: "Cypher Capital", weight: "800", casing: "normal" },
    { name: "Elite Recruiter", weight: "700", casing: "normal" },
    { name: "Leap", weight: "800", casing: "normal" },
    { name: "KAST", weight: "900", casing: "uppercase" },
    { name: "Agency Blueprint", weight: "700", casing: "normal" },
    { name: "brinc", weight: "800", casing: "lowercase" }
  ],

  // Authoritative Navigation Items
  navigation: [
    { label: "Home", href: "#hero" },
    { label: "Services", href: "#work" },
    { label: "How We Work", href: "#process" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "FAQ", href: "#faq" }
  ],

  // Launch Dependencies & Configuration Placeholders
  launchDependencies: {
    bookingUrl: "https://cal.com/ishmeet1/30min",
    instagramUrl: "https://www.instagram.com/theempirelabs/",
    youtubeUrl: "https://www.youtube.com/@meetwithish",
    linkedinUrl: "https://www.linkedin.com/in/ishmeetsingh20/",
    linktreeUrl: "https://linktr.ee/empirelabs",
    newsletterEndpoint: "https://api.victoryempire.co/newsletter/subscribe"
  },

  // Section 04 — Authentic Styled Client Logos with UAE Flag & Brand Typography
  clientLogosRow1: [
    { name: "buildspace", html: `<span class="client-logo client-logo-buildspace">buildspace</span>` },
    { name: "TKS", html: `<span class="client-logo client-logo-tks">TKS</span>` },
    { name: "Wio", html: `<span class="client-logo client-logo-wio">Wio</span>` },
    { name: "HUB71", html: `<span class="client-logo client-logo-hub71">HUB71</span>` },
    { name: "forma", html: `<span class="client-logo client-logo-forma">forma</span>` },
    {
      name: "Superteam UAE",
      html: `<span class="client-logo client-logo-superteam"><svg viewBox="0 0 640 480" width="18" height="13" aria-hidden="true"><path fill="#00732f" d="M0 0h640v160H0z"/><path fill="#fff" d="M0 160h640v160H0z"/><path fill="#000" d="M0 320h640v160H0z"/><path fill="red" d="M0 0h220v480H0z"/></svg>Superteam UAE</span>`
    }
  ],
  clientLogosRow2: [
    {
      name: "Cypher Capital",
      html: `<span class="client-logo client-logo-cypher"><span class="cypher-top">CYPHER</span><span class="cypher-line"></span><span class="cypher-bottom">CAPITAL</span></span>`
    },
    { name: "Elite Recruiter", html: `<span class="client-logo client-logo-elite">Elite Recruiter</span>` },
    { name: "Leap", html: `<span class="client-logo client-logo-leap">Leap</span>` },
    { name: "KAST", html: `<span class="client-logo client-logo-kast">KAST</span>` },
    { name: "Agency Blueprint", html: `<span class="client-logo client-logo-blueprint">Agency Blueprint</span>` },
    { name: "brinc", html: `<span class="client-logo client-logo-brinc">brinc</span>` }
  ],

  // Section 05 — Content Engine Outputs
  contentEngine: [
    { tag: "01 / SHORT FORM", title: "Vertical Reels & TikToks", desc: "Hooks engineered for high retention and organic distribution." },
    { tag: "02 / PODCAST CLIPS", title: "Pod Clips & Highlights", desc: "Long-form interviews cut into viral standalone moments." },
    { tag: "03 / TALKING HEAD", title: "Executive Thought Leadership", desc: "Paced storytelling and custom motion graphics for maximum watch time." },
    { tag: "04 / YOUTUBE", title: "High-Retention Video Essays", desc: "Deep-dive long-form content engineered for search & authority." },
    { tag: "05 / MOTION LAUNCH", title: "3D Product & Brand Reveals", desc: "High-end motion graphics and product launch animations." },
    { tag: "06 / DOCUMENTARY", title: "Brand & Founder Docu-Series", desc: "Cinematic narrative storytelling building deep brand prestige." }
  ],

  // Section 06 — Selected Work (8 Real Victory Empire Categories)
  selectedWork: [
    {
      id: "work-1",
      number: "01",
      category: "Faceless Reel",
      title: "Faceless High-Retention Viral Reel",
      description: "A cinematic faceless vertical narrative generated 1.2M organic impressions across Instagram & TikTok.",
      youtubeId: "6TP0T0TOJmk",
      videoUrl: "https://youtu.be/6TP0T0TOJmk?si=NgQHfkIsgAmWT55Q",
      posterUrl: "https://img.youtube.com/vi/6TP0T0TOJmk/maxresdefault.jpg"
    },
    {
      id: "work-2",
      number: "02",
      category: "Pod Clips",
      title: "Founders Podcast Viral Series",
      description: "Extracted high-value insight clips with kinetic typography, custom sound design, and color grading.",
      youtubeId: "yCeqqFmoe7M",
      videoUrl: "https://youtu.be/yCeqqFmoe7M?si=A14tG7uHmtj60RXw",
      posterUrl: "https://img.youtube.com/vi/yCeqqFmoe7M/maxresdefault.jpg"
    },
    {
      id: "work-3",
      number: "03",
      category: "Talking Head",
      title: "Executive Authority Showcase",
      description: "Clean multi-camera studio production establishing authority in B2B enterprise software.",
      youtubeId: "JKfIPjy-dWI",
      videoUrl: "https://youtu.be/JKfIPjy-dWI?si=rsSFWWQXzjfr9xQw",
      posterUrl: "https://img.youtube.com/vi/JKfIPjy-dWI/maxresdefault.jpg"
    },
    {
      id: "work-4",
      number: "04",
      category: "YouTube",
      title: "High-Retention YouTube Breakdown",
      description: "Long-form tech breakdown with custom motion graphics, original scoring, and chapters.",
      youtubeId: "IIXFieJU2vY",
      videoUrl: "https://youtu.be/IIXFieJU2vY?si=1U3FWX4edULM5JHo",
      posterUrl: "https://img.youtube.com/vi/IIXFieJU2vY/maxresdefault.jpg"
    },
    {
      id: "work-5",
      number: "05",
      category: "Motion Launch",
      title: "3D Product Motion Reveal",
      description: "High-impact kinetic product animation designed for launch campaigns.",
      youtubeId: "s4TzMF814wQ",
      videoUrl: "https://youtu.be/s4TzMF814wQ?si=zbRMcQUUaTfznD2r",
      posterUrl: "https://img.youtube.com/vi/s4TzMF814wQ/maxresdefault.jpg"
    },
    {
      id: "work-6",
      number: "06",
      category: "Documentary",
      title: "Founder Documentary Story",
      description: "Cinematic docu-style brand story showcasing vision, grit, and market dominance.",
      youtubeId: "G4WQVqG8JpQ",
      videoUrl: "https://youtu.be/G4WQVqG8JpQ?si=4tmQ926-6cnif-bJ",
      posterUrl: "https://img.youtube.com/vi/G4WQVqG8JpQ/maxresdefault.jpg"
    },
    {
      id: "work-7",
      number: "07",
      category: "Trendy",
      title: "Trendy Culture & Short-Form Reel",
      description: "Paced for maximum watch-time, viral hooks, and high shareability.",
      youtubeId: "1ebwi6_sKus",
      videoUrl: "https://youtu.be/1ebwi6_sKus?si=-Sy1lKxhL_uCKKa4",
      posterUrl: "https://img.youtube.com/vi/1ebwi6_sKus/maxresdefault.jpg"
    },
    {
      id: "work-8",
      number: "08",
      category: "Pod Trailer",
      title: "Podcast Series Trailer",
      description: "High-energy trailer driving anticipation and listener conversions.",
      youtubeId: "9QIuaLtxwjs",
      videoUrl: "https://youtu.be/9QIuaLtxwjs?si=kM-G4DLS1mEjSlRw",
      posterUrl: "https://img.youtube.com/vi/9QIuaLtxwjs/maxresdefault.jpg"
    }
  ],

  // Section 07 — How We Work (3 Stages)
  processStages: [
    {
      step: "01",
      title: "Understanding you",
      description: "We learn your ICP, brand voice, key messaging, product/service positioning, and story.",
      tags: ["DISCOVERY", "ICP RESEARCH", "STRATEGY"],
      thumbId: "JKfIPjy-dWI"
    },
    {
      step: "02",
      title: "Building the system",
      description: "Our team will start creating content strategies, videos, automations, and funnel. Your content engine will start.",
      tags: ["PRODUCTION", "EDITING", "MOTION DESIGN"],
      thumbId: "IIXFieJU2vY"
    },
    {
      step: "03",
      title: "Iterating and tracking",
      description: "We'll test different formats weekly and be aggressive with feedback loops to start seeing results ASAP. We'll send you reports and be available 24/7.",
      tags: ["ANALYTICS", "OPTIMISATION", "SCALING"],
      thumbId: "G4WQVqG8JpQ"
    }
  ],

  // Section 08 — Services List
  services: [
    { number: "01", title: "SHORT FORM CONTENT", desc: "High-retention Reels, TikToks, and Shorts engineered for viral reach.", category: "Faceless Reel", youtubeId: "6TP0T0TOJmk" },
    { number: "02", title: "MOTION GRAPHICS + ANIMATIONS", desc: "Luxury 2D/3D brand animations and motion launch visuals.", category: "Motion Launch", youtubeId: "s4TzMF814wQ" },
    { number: "03", title: "YOUTUBE VIDEOS", desc: "Long-form video essays, podcast productions, and documentary breakdowns.", category: "YouTube", youtubeId: "IIXFieJU2vY" },
    { number: "04", title: "STREET STYLE INTERVIEWS", desc: "Dynamic on-location vox-pop interviews capturing authentic audience reactions.", category: "Trendy", youtubeId: "1ebwi6_sKus" },
    { number: "05", title: "PODCAST PRODUCTION", desc: "Full podcast production, trailer creation, and viral clip extraction.", category: "Pod Clips", youtubeId: "yCeqqFmoe7M" },
    { number: "06", title: "CUSTOM CONTENT ENGINES", desc: "Bespoke media production pipelines for high-growth enterprise brands.", category: "Documentary", youtubeId: "G4WQVqG8JpQ" }
  ],

  // Section 09 — More Examples (Selected highlights from the 8 real categories)
  moreExamples: [
    {
      id: "ex-1",
      category: "Short Form",
      title: "Sales & Growth Clip",
      videoUrl: "https://framerusercontent.com/assets/rIWC3vR5ACYrKNLZujfRBMxI0.mp4"
    },
    {
      id: "ex-2",
      category: "Talking Head",
      title: "Founder Education Series",
      videoUrl: "https://framerusercontent.com/assets/3d9SxukmvfyvPiAzwG7jRhpKQ6M.mp4"
    },
    {
      id: "ex-3",
      category: "Documentary",
      title: "Brand Story Feature",
      videoUrl: "https://framerusercontent.com/assets/IEN8ZkOGnwAzmjncEbC7Um9WQ.mp4"
    },
    {
      id: "ex-4",
      category: "Pod Clips",
      title: "Podcast Highlight Reel",
      videoUrl: "https://framerusercontent.com/assets/tDltrqfcxiJlyAUu53SNFMI8Vpc.mp4"
    },
    {
      id: "ex-5",
      category: "Trendy",
      title: "Viral Short-Form Edit",
      videoUrl: "https://framerusercontent.com/assets/OtgylaEZa6xKQx7vi531eyobNI.mp4"
    },
    {
      id: "ex-6",
      category: "YouTube",
      title: "Long-Form Breakdown",
      videoUrl: "https://framerusercontent.com/assets/dNVcNrvnda4ZQfAkOAomCslxUFo.mp4"
    }
  ],

  // Section 10 — Testimonials
  testimonials: [
    {
      id: "t1",
      quote: "Victory Empire completely transformed our content pipeline. We went from struggling to produce one video a week to running a multi-platform media machine that generates over 2M monthly views.",
      name: "Marcus Vance",
      role: "Founder & CEO",
      company: "Apex Tech Capital",
      portraitUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "t2",
      quote: "The visual aesthetic and editing quality Victory Empire delivers is unmatched. Every single clip looks like a luxury studio production. They saved me 20+ hours every single week.",
      name: "Elena Rostova",
      role: "Managing Director",
      company: "Vanguard Media",
      portraitUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "t3",
      quote: "Victory Empire is the kindest and most efficient creative partner. They really have a unique skill of understanding your brand vision, asking the right questions, and turning ideas into cinema-grade assets.",
      name: "Teja Modrijan",
      role: "Brand Lead",
      company: "Vector Summit",
      portraitUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "t4",
      quote: "We didn't have a clear video strategy behind our work for 5 years. Victory Empire helped us see our positioning from a new angle and opened our eyes to storytelling frameworks we hadn't thought about before.",
      name: "Aljaž Mak",
      role: "Growth Partner",
      company: "Forma Agency",
      portraitUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "t5",
      quote: "Working with the Victory Empire team feels like working with world-class friends. Clear communication, aggressive optimization, and realistic deadlines that keep our content engine firing 24/7.",
      name: "Emma Rankins",
      role: "Head of Marketing",
      company: "Leap Ventures",
      portraitUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "t6",
      quote: "Their turnkey production process is hands-down the best investment we made this year. We record once a month, and Victory Empire delivers 15+ high-retention short clips and YouTube essays.",
      name: "Achille A.",
      role: "Co-Founder",
      company: "Cypher Capital",
      portraitUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80"
    }
  ],

  // Section 12 — Verified FAQ Accordion
  faq: [
    {
      question: "How much time do I need to commit each week?",
      answer: "Only 1–2 hours per month. Our structured batching system allows us to record all core assets in a single concise session, after which our team handles 100% of scripting, editing, motion graphics, and distribution."
    },
    {
      question: "How do you ensure the video quality aligns with my brand?",
      answer: "Before any production begins, we develop a comprehensive Brand Style Guide covering typography, color grading presets, motion graphics guidelines, and voice-and-tone framing."
    },
    {
      question: "What video formats and platforms do you support?",
      answer: "We support all major platforms including Instagram Reels, TikTok, YouTube Shorts, YouTube Long-Form, LinkedIn Video, X (Twitter), and custom website video assets."
    },
    {
      question: "How do we collaborate on asset uploading and approvals?",
      answer: "We use a streamlined client portal where you can review draft cuts, leave timestamped feedback, and approve final media in one click."
    }
  ]
};
