/* ==========================================================================
   ORBITECH — CONTENT CONFIGURATION
   ==========================================================================

   ⚠️  THIS IS THE ONLY FILE YOU NEED TO EDIT TO SWAP IN REAL CONTENT.

   Every number, card, bio, language and label rendered on the page comes
   from the ORBITECH object below. Nothing here affects layout — change the
   values, and the page rebuilds itself around them.

   Anything marked  // 🔴 PLACEHOLDER  is invented sample data. Replace it.
   Anything marked  // ⚙️  CONFIG      is a real setting you must configure.

   See CONTENT-GUIDE.md for a field-by-field map.
   ========================================================================== */

const ORBITECH = {

  /* ======================================================================
     ⚙️  1. INTEGRATIONS — real settings, not placeholders
     ====================================================================== */
  integrations: {

    /* ⚙️ CONFIG — Google Apps Script Web App URL for the "Join Our Team"
       application form. Until this is replaced, the form runs in DEMO MODE:
       it validates and shows a success state but does not send anything.

       Get this URL by following backend/SETUP-GOOGLE-APPS-SCRIPT.md
       It looks like:
       https://script.google.com/macros/s/AKfycbx.....D2/exec               */
    GOOGLE_SCRIPT_URL: "REPLACE_ME",

    /* ⚙️ CONFIG — Endpoint for the client Contact form. You can point this at
       the SAME Apps Script URL (Code.gs routes on the `formType` field and
       writes client inquiries to a second sheet tab), or at a different
       service entirely. Leave as "REPLACE_ME" to keep it in demo mode.     */
    CONTACT_ENDPOINT: "REPLACE_ME",

    /* ⚙️ CONFIG — Max CV upload size. Apps Script can accept roughly 45 MB in
       a single request; 8 MB is a sane limit for a CV and keeps the base64
       payload small enough to upload quickly on a poor connection.         */
    maxUploadMB: 8,
    acceptedUploadTypes: ".pdf,.doc,.docx,.rtf,.odt,.txt"
  },


  /* ======================================================================
     🔴 2. COMPANY — basics used in the footer, contact block and SEO
     ====================================================================== */
  company: {
    name: "Orbitech",
    // 🔴 PLACEHOLDER — one-line descriptor, also used as the meta description base
    descriptor: "Multilingual data solutions and software engineering, under one roof.",
    email: "hello@orbitech.example",              // 🔴 PLACEHOLDER
    salesEmail: "projects@orbitech.example",      // 🔴 PLACEHOLDER
    talentEmail: "talent@orbitech.example",       // 🔴 PLACEHOLDER
    phone: "+00 0000 000000",                     // 🔴 PLACEHOLDER
    location: "Remote-first · Operating across 20+ time zones", // 🔴 PLACEHOLDER
    responseTime: "We reply to project enquiries within 1 business day", // 🔴 PLACEHOLDER
    foundedYear: 2019,                            // 🔴 PLACEHOLDER

    // 🔴 PLACEHOLDER — replace `url` with real profiles. Remove any you don't use.
    socials: [
      { label: "LinkedIn", url: "#", icon: "linkedin" },
      { label: "X",        url: "#", icon: "x" },
      { label: "GitHub",   url: "#", icon: "github" },
      { label: "Email",    url: "mailto:hello@orbitech.example", icon: "mail" }
    ]
  },


  /* ======================================================================
     3. NAVIGATION — labels are deliberately conventional and scannable.
        Keep the playful orbit language for section headers, not here.
     ====================================================================== */
  nav: [
    { label: "Solutions", href: "#solutions" },
    { label: "Work",      href: "#work" },
    { label: "Team",      href: "#team" },
    { label: "Join Us",   href: "#join" },
    { label: "Contact",   href: "#contact" }
  ],


  /* ======================================================================
     4. DATA SOLUTIONS PILLAR — supplied company content
     ====================================================================== */
  // Company content supplied in Untitled document.pdf.
  dataSolutions: {
    "stats": [
        {
            "value": "100+",
            "label": "Languages supported",
            "note": "Including regional variations and diverse dialects"
        },
        {
            "value": "500+ h",
            "label": "ASR audio delivered",
            "note": "Across eight languages in our featured ASR project"
        },
        {
            "value": "120,000+",
            "label": "Words translated",
            "note": "Across three language pairs in our featured translation project"
        },
        {
            "value": "98%",
            "label": "ASR project accuracy",
            "note": "Achieved through structured quality control and review"
        }
    ],
    "services": [
        {
            "icon": "annotate",
            "title": "Data Annotation & Labeling",
            "desc": "We turn raw images, videos, text, and audio into meaningful training data. Every annotation is created with your project's objectives in mind, helping AI systems recognize patterns, understand information, and make better decisions.",
            "meta": "Image · Video · Text · Audio"
        },
        {
            "icon": "transcribe",
            "title": "Audio Transcription",
            "desc": "We transform spoken language into clean, accurate, and usable data. From everyday conversations to complex multi speaker recordings, our teams handle diverse audio content with careful attention to context and detail.",
            "meta": "Conversations · Multi-speaker recordings"
        },
        {
            "icon": "translate",
            "title": "Translation & Localization",
            "desc": "Good translation is not simply about changing words from one language to another. Our language specialists preserve meaning, context, tone, and cultural nuance so your content feels natural wherever it is used.",
            "meta": "Meaning · Context · Cultural nuance"
        },
        {
            "icon": "mtpe",
            "title": "Machine Translation Post Editing",
            "desc": "We bring human judgment to machine generated translations. Our specialists review and refine content for accuracy, fluency, grammar, and natural expression while keeping the original meaning intact.",
            "meta": "Accuracy · Fluency · Natural expression"
        },
        {
            "icon": "collect",
            "title": "Data Collection",
            "desc": "The right dataset starts with the right source. We collect and organize customized text, audio, image, and video data according to your project's specific requirements, helping you build datasets that are relevant from the very beginning.",
            "meta": "Text · Audio · Image · Video"
        },
        {
            "icon": "qa",
            "title": "Data Quality & Validation",
            "desc": "Quality is not something we check only at the end. It is part of the process from start to finish. Our review and validation workflows help detect inconsistencies, reduce errors, and maintain the reliability your AI project depends on.",
            "meta": "Review · Validation · Consistency"
        }
    ],
    "languageFlags": {
        "English": "assets/img/flags/gb.svg",
        "German": "assets/img/flags/de.svg",
        "Greek": "assets/img/flags/gr.svg",
        "French": "assets/img/flags/fr.svg",
        "Spanish": "assets/img/flags/es.svg",
        "Italian": "assets/img/flags/it.svg",
        "Portuguese": "assets/img/flags/pt.svg",
        "Arabic": "assets/img/flags/ae.svg",
        "Bengali": "assets/img/flags/bd.svg",
        "Hindi": "assets/img/flags/in.svg",
        "Urdu": "assets/img/flags/pk.svg",
        "Turkish": "assets/img/flags/tr.svg",
        "Dutch": "assets/img/flags/nl.svg",
        "Polish": "assets/img/flags/pl.svg",
        "Russian": "assets/img/flags/ru.svg",
        "Japanese": "assets/img/flags/jp.svg",
        "Korean": "assets/img/flags/kr.svg",
        "Chinese (Mandarin)": "assets/img/flags/cn.svg",
        "Indonesian": "assets/img/flags/id.svg",
        "Vietnamese": "assets/img/flags/vn.svg",
        "Finnish": "assets/img/flags/fi.svg",
        "Swedish": "assets/img/flags/se.svg"
},
    "languageGroups": [
        {
                "label": "Asia",
                "languages": [
                        "Arabic",
                        "Bengali",
                        "Chinese (Mandarin)",
                        "Hindi",
                        "Indonesian",
                        "Japanese",
                        "Korean",
                        "Turkish",
                        "Urdu",
                        "Vietnamese"
                ]
        },
        {
                "label": "Europe",
                "languages": [
                        "Dutch",
                        "English",
                        "Finnish",
                        "French",
                        "German",
                        "Greek",
                        "Italian",
                        "Polish",
                        "Portuguese",
                        "Russian",
                        "Spanish",
                        "Swedish"
                ]
        }
],
    "languageNote": "Language should never be a barrier to building intelligent technology. Our growing network of language specialists allows us to support projects across more than 100 languages, including regional variations and diverse dialects. Whether you need one language or a multilingual dataset at scale, we bring the same commitment to accuracy and consistency to every project.",
    "featuredWork": [
        {
            "client": {
                "sector": "Speech recognition"
            },
            "title": "ASR Transcription Project",
            "summary": "A large-scale multilingual ASR data project covering 8 languages: German, French, Dutch, Finnish, Swedish, English, Urdu, and Bengali. Our team managed the complete data workflow, including audio transcription, annotation, and labeling, with 30 annotators dedicated to each language. Across 500 hours of audio, the project was successfully completed within the agreed deadline while achieving 98% accuracy through structured quality control and review. Project period: February–June.",
            "tags": [
                "Annotation",
                "Transcription",
                "Data Labeling"
            ],
            "metrics": [
                {
                    "value": "500+ h",
                    "label": "Hours of audio"
                },
                {
                    "value": "8",
                    "label": "Languages"
                },
                {
                    "value": "30",
                    "label": "Annotators per language"
                },
                {
                    "value": "98%",
                    "label": "Accuracy"
                }
            ]
        },
        {
            "client": {
                "sector": "Language services"
            },
            "title": "Multilingual Translation Project",
            "summary": "We delivered a multilingual translation project covering Bengali ↔ English, Hindi ↔ English, and Urdu ↔ English, with a combined volume of 120,000+ words. A dedicated team of 15 language specialists for each project handled the translation and review process, maintaining consistency, accuracy, and natural language quality throughout the work. The project was completed within the agreed timeline with 90%+ accuracy. Project period: June–July.",
            "tags": [
                "Translation",
                "Localization",
                "Quality Review"
            ],
            "metrics": [
                {
                    "value": "120,000+",
                    "label": "Words"
                },
                {
                    "value": "3",
                    "label": "Language pairs"
                },
                {
                    "value": "15",
                    "label": "Specialists per project"
                },
                {
                    "value": "90%+",
                    "label": "Accuracy"
                }
            ]
        }
    ]
},


  /* ======================================================================
     5. SOFTWARE DEVELOPMENT PILLAR — supplied company capabilities
     ====================================================================== */
  // Software capabilities supplied in Orbitech_Portfolio_v3.pdf.
  // Four featured projects selected by the user from the supplied portfolio.
  software: {
    "stats": [
        {
            "value": "10",
            "label": "Software engineers",
            "note": "Frontend, backend, mobile, machine learning, and DevOps"
        },
        {
            "value": "15+",
            "label": "Projects delivered",
            "note": "Web platforms, mobile apps, AI-integrated tools, and backend systems"
        },
        {
            "value": "30+",
            "label": "Frameworks & tools",
            "note": "Used across frontend, backend, data, AI, and infrastructure"
        }
    ],
    "services": [
        {
            "icon": "web",
            "title": "Web Platforms & Dashboards",
            "desc": "Role-based portals, admin dashboards, and marketplaces built around how a product team actually operates.",
            "meta": "Portals · Dashboards · Marketplaces"
        },
        {
            "icon": "mobile",
            "title": "Mobile Apps",
            "desc": "Cross-platform iOS and Android apps from a single React Native codebase.",
            "meta": "iOS · Android · React Native"
        },
        {
            "icon": "ai",
            "title": "AI-Integrated Features",
            "desc": "OCR, natural-language data entry, recommendation engines, and predictive models.",
            "meta": "OCR · Recommendations · Predictive models"
        },
        {
            "icon": "pipeline",
            "title": "Real-Time & Offline Systems",
            "desc": "Live tracking, chat, and notifications, plus apps that keep working without a stable connection.",
            "meta": "Live tracking · Chat · Offline support"
        },
        {
            "icon": "cloud",
            "title": "Backend & Infrastructure",
            "desc": "Microservices, message queues, monitoring, and CI/CD built to production standards.",
            "meta": "Microservices · Monitoring · CI/CD"
        },
        {
            "icon": "consult",
            "title": "Product Discovery & UX",
            "desc": "Requirements gathering, prioritization, and interactive prototyping before code is written.",
            "meta": "Discovery · Prioritization · Prototyping"
        }
    ],
    "techStack": [
        {
            "label": "Frontend & Product",
            "icon": "web",
            "description": "Interfaces, mobile experiences, and prototypes shaped around the people using them.",
            "items": [
                "React",
                "Next.js",
                "TypeScript",
                "JavaScript",
                "Tailwind CSS",
                "Vite",
                "React Native",
                "Figma",
                "Leaflet"
            ]
        },
        {
            "label": "Backend & Data",
            "icon": "pipeline",
            "description": "Application logic, real-time connections, and the data systems behind the product.",
            "items": [
                "Node.js",
                "Express",
                "Spring Boot",
                "Django",
                "Laravel",
                "Socket.io",
                "MongoDB",
                "PostgreSQL",
                "MySQL",
                "Firebase",
                "SQLite"
            ]
        },
        {
            "label": "AI & Engineering",
            "icon": "ai",
            "description": "Intelligent features, predictive models, and the engineering that puts them to work.",
            "items": [
                "Python",
                "TensorFlow",
                "scikit-learn",
                "Google Gemini",
                "pandas",
                "C++"
            ]
        },
        {
            "label": "Infrastructure & Delivery",
            "icon": "cloud",
            "description": "Containers, messaging, and observability to deploy and operate what we build.",
            "items": [
                "Docker",
                "Kubernetes",
                "RabbitMQ",
                "Prometheus",
                "Grafana",
                "Git"
            ]
        }
    ],
    "featuredWork": [
        {
                "client": {
                        "sector": "AI & Intelligent Products"
                },
                "title": "MoneyBag",
                "summary": "AI personal finance app parsing transactions and receipts via Gemini vision/text.",
                "tags": [
                        "React",
                        "Node.js",
                        "MongoDB",
                        "Google Gemini"
                ]
        },
        {
                "client": {
                        "sector": "AI & Intelligent Products"
                },
                "title": "DesiTrip",
                "summary": "Offline-first travel and expense tracker with bilingual AI itinerary generation.",
                "tags": [
                        "Next.js",
                        "Node.js",
                        "Google Gemini"
                ]
        },
        {
                "client": {
                        "sector": "Platforms & Infrastructure"
                },
                "title": "EVENT-EKHANE",
                "summary": "Multi-role event platform with real-time ticketing and QR check-in.",
                "tags": [
                        "Next.js",
                        "TypeScript",
                        "MySQL"
                ]
        },
        {
                "client": {
                        "sector": "Safety, Civic & Social Impact"
                },
                "title": "Aid-Link",
                "summary": "Real-time emergency volunteer coordination with automated matching.",
                "tags": [
                        "React",
                        "Node.js",
                        "Express"
                ]
        }
]
},


  /* ======================================================================
     6. WHY ORBITECH — supplied company content
     ====================================================================== */
  // Company content supplied in Untitled document.pdf.
  why: {
    "compare": null,
    "points": [
        {
            "title": "Scalable Delivery",
            "desc": "From highly specialized datasets to large scale AI initiatives, Orbitech combines skilled people, structured processes, and thoughtful quality control to deliver data you can rely on."
        },
        {
            "title": "Reliable Quality",
            "desc": "Quality is not something we check only at the end. It is part of the process from start to finish. Our review and validation workflows help detect inconsistencies, reduce errors, and maintain the reliability your AI project depends on."
        },
        {
            "title": "Human Expertise",
            "desc": "At Orbitech, we believe the strongest AI systems begin with people who understand the value of every piece of data. Behind every accurate label, every carefully transcribed word, and every validated dataset is human attention, judgment, and expertise."
        },
        {
            "title": "Built Around Your Goals",
            "desc": "Every project has a different purpose, and every dataset has different requirements. We take the time to understand yours and build a workflow around your goals, timeline, and quality expectations."
        }
    ]
},


  /* ======================================================================
     🔴 7. TEAM
     --------------------------------------------------------------------
     `photo` — path to a real image, e.g. "assets/img/team/asha.jpg".
                Leave as null to render the generated initials placeholder.
     ====================================================================== */
  team: [
    {
      name: "A. Rahman",                                   // 🔴 PLACEHOLDER
      role: "Founder & Managing Director",
      bio: "Fifteen years in multilingual data operations. Leads client strategy and keeps delivery honest across both service lines.",
      photo: null
    },
    {
      name: "M. Chowdhury",                                // 🔴 PLACEHOLDER
      role: "Head of Data Solutions",
      bio: "Runs the annotation and linguistics network. Built the vetting process that keeps first-pass acceptance above 98%.",
      photo: null
    },
    {
      name: "S. Ahmed",                                    // 🔴 PLACEHOLDER
      role: "Head of Engineering",
      bio: "Full-stack and platform background. Owns architecture and delivery standards for every client engagement.",
      photo: null
    },
    {
      name: "N. Islam",                                    // 🔴 PLACEHOLDER
      role: "Operations Lead",
      bio: "Keeps four to six concurrent projects on schedule. Designed the at-risk flagging that replaced manual check-ins.",
      photo: null
    },
    {
      name: "T. Hasan",                                    // 🔴 PLACEHOLDER
      role: "Lead AI Engineer",
      bio: "Works across model integration, evaluation harnesses and the retrieval systems behind our clients' AI products.",
      photo: null
    },
    {
      name: "R. Karim",                                    // 🔴 PLACEHOLDER
      role: "Quality & Linguistics Manager",
      bio: "Sets quality bars per project and manages the reviewer layer. Specialist in low-resource language sourcing.",
      photo: null
    }
  ],


  /* ======================================================================
     🔴 8. JOIN OUR TEAM
     ====================================================================== */
  join: {

    // 🔴 PLACEHOLDER — why join
    pitch: [
      {
        icon: "globe",
        title: "Work from anywhere",
        desc: "Our network spans 20+ time zones. Everything is remote and asynchronous by default — no relocation, no fixed hours."
      },
      {
        icon: "clock",
        title: "Choose your load",
        desc: "Take the projects that fit your week. Contributors range from a few hours to full-time equivalent, and you set which."
      },
      {
        icon: "layers",
        title: "Genuinely varied work",
        desc: "Annotation one month, transcription or post-editing the next, across industries from healthcare to frontier AI research."
      },
      {
        icon: "trend",
        title: "Track record that travels",
        desc: "Your acceptance rate and project history build a visible record with us — and it's what gets you first call on the next brief."
      },
      {
        icon: "pay",
        title: "Clear, on-time payment",
        desc: "Rates agreed before you start, tied to accepted work, paid on a fixed schedule. No opaque deductions."
      },
      {
        icon: "support",
        title: "Real support, not a ticket queue",
        desc: "A named operations contact per project, written guidelines up front, and answers in hours rather than days."
      }
    ],

    /* 🔴 PLACEHOLDER — refresh this regularly, it's the most time-sensitive
       content on the page. Keep it honest: listing roles you aren't hiring
       for is the fastest way to burn talent-network goodwill. */
    inDemand: {
      lastUpdated: "August 2026",                          // 🔴 PLACEHOLDER
      groups: [
        {
          label: "Languages",
          items: ["Czech", "Portuguese (EU)", "Norwegian", "Finnish", "Vietnamese",
                  "Hebrew", "Swahili", "Nepali", "Slovak", "Danish"]
        },
        {
          label: "Skills",
          items: ["Medical transcription", "Legal MTPE", "Audio diarisation",
                  "LiDAR / 3D annotation", "RLHF preference ranking",
                  "Native-speaker QA review"]
        }
      ]
    },

    // Options for the "How did you hear about us?" field
    referralSources: [
      "LinkedIn",
      "A friend or colleague",
      "Search engine",
      "A freelancing platform",
      "Facebook or a community group",
      "Worked with Orbitech before",
      "Other"
    ]
  },


  /* ======================================================================
     🔴 9. TRUST & CONFIDENTIALITY
     --------------------------------------------------------------------
     ⚠️  IMPORTANT: this copy is written to be truthful WITHOUT claiming any
     certification. Do not add "ISO 27001 certified", "SOC 2 compliant" or
     similar until you actually hold the certification — describing your
     practices is fine, claiming an audit you haven't passed is not.
     ====================================================================== */
  trust: {
    items: [                                                // 🔴 PLACEHOLDER
      {
        icon: "nda",
        title: "NDAs as standard",
        desc: "Every contributor signs a confidentiality agreement before receiving access to any client material. Project-specific NDAs are supported where you require your own."
      },
      {
        icon: "access",
        title: "Need-to-know access",
        desc: "Contributors see only the data required for their assigned task, for as long as the task is open. Access is revoked automatically on completion."
      },
      {
        icon: "shield",
        title: "Controlled environments",
        desc: "Sensitive projects can be run inside your own systems or a restricted environment we provision, with no local download and no residual copies."
      },
      {
        icon: "trace",
        title: "Traceable handling",
        desc: "Every unit is attributable to the contributor who worked on it and the reviewer who checked it, so any concern can be traced to a specific point in the chain."
      },
      {
        icon: "delete",
        title: "Defined retention",
        desc: "Retention and deletion windows are agreed in the contract, and we confirm deletion in writing at project close."
      },
      {
        icon: "region",
        title: "Data residency options",
        desc: "Where a project requires data to stay within a jurisdiction, we can restrict both storage location and contributor location accordingly."
      }
    ],

    // 🔴 PLACEHOLDER — the honest caveat. Keep something like it.
    note: "Orbitech is building towards formal information-security certification. We are not yet certified, and we won't claim otherwise — what we can do today is meet your security requirements contractually, work inside your environment and controls, and complete your vendor security assessment in full. Ask us for our current data-handling policy and we'll send it before you share anything."
  },


  /* ======================================================================
     10. CONTACT FORM
     ====================================================================== */
  contact: {
    inquiryTypes: [
      {
        value: "quote",
        title: "Get a project quote",
        desc: "You have a brief, a rough scope or a deadline. We'll come back with an approach and a number."
      },
      {
        value: "general",
        title: "General enquiry",
        desc: "Questions, partnerships, or you're just working out whether we're a fit. No commitment."
      }
    ],
    // Which service lines a client can flag interest in
    interests: [
      "Data annotation", "Transcription", "Translation & localisation", "MTPE",
      "Data collection", "Custom software", "AI/ML engineering", "Not sure yet"
    ]
  },


  /* ======================================================================
     11. FOOTER
     ====================================================================== */
  footer: {
    columns: [
      {
        title: "Solutions",
        links: [
          { label: "Data Solutions",       href: "#solutions" },
          { label: "Software Development", href: "#software" },
          { label: "Featured work",        href: "#work" },
          { label: "Why Orbitech",         href: "#why" }
        ]
      },
      {
        title: "Company",
        links: [
          { label: "Meet the team",        href: "#team" },
          { label: "Trust & security",     href: "#trust" },
          { label: "Contact",              href: "#contact" }
        ]
      },
      {
        title: "For talent",
        links: [
          { label: "Join our team", href: "#join", highlight: true },
          { label: "Roles in demand", href: "#join" },
          { label: "How we work",     href: "#join" }
        ]
      }
    ],
    // 🔴 PLACEHOLDER — point these at real pages when they exist
    legal: [
      { label: "Privacy policy",    href: "#" },
      { label: "Terms of service",  href: "#" },
      { label: "Data handling",     href: "#" }
    ]
  }
};

/* Expose for app.js. Kept as a plain global so the site works when opened
   directly from the filesystem (file://), where ES modules are blocked. */
window.ORBITECH = ORBITECH;
