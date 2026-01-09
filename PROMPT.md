# MiMo Prompt

You are generating a production-ready static web invitation for Xiaomi Explorers: "The New Wave of AI".

Output four files as separate fenced code blocks with file names:
- index.html
- styles.css
- config.js
- app.js

Constraints:
- Use only ASCII characters.
- No build tools; pure HTML/CSS/JS.
- Must work on mobile and desktop.
- Use config.js to store copy, slides, particle settings, KV image paths, and theme CSS variables.
- Use config.js to store pageMedia for intro and KV background images.
- Camera access prompt, with a skip option that still lets users continue.
- Use MediaPipe Hands from CDN for open-hand and closed-hand gestures.
- Gesture logic:
  - Open hand unlocks invitation and switches to the KV page.
  - Closed hand returns to intro.
  - On the KV page, detect left/right hand or finger movement to navigate hotspots.
  - Include manual buttons as fallback only when camera is unavailable.
- Particle system:
  - Canvas text particles show the slogan.
  - Particles disperse and transition when unlocked while KV appears.
  - Optional mask shape for the unlocked particle target, controlled by a config flag.
- KV browse:
  - Horizontal slide track with 4 slides.
  - Primary navigation uses hand swipe detection.
  - Pointer/keyboard fallback only when camera is unavailable.
- Include copy:
  - Slogan: "The New Wave of AI"
  - CTA: "See Xiaomi at MWC 2026"
  - Dates: "2026.03.02 - 2026.03.05"
  - Location: "Hall X - Booth X"
  - Xiaomi Explorer line: "Xiaomi Explorer: navigating the New Wave"
  - Gesture hint: "Show an open hand to unlock the invitation."
  - Disclaimer: "Camera access is required for real-time interaction only. No recording or data storage."

Visual direction:
- Bold, cinematic, warm energy.
- Use a custom font (e.g., Space Grotesk + Staatliches) from Google Fonts.
- Use gradients, atmospheric orbs, and floating shapes to evoke a KV.
- Avoid dark-mode-only look; use deep background but with warm highlights.

Implementations details:
- Use requestAnimationFrame for particles.
- Build particle targets by sampling text in an offscreen canvas.
- Use a secondary target set for the wave transition.
- Keep all code in the three files; no external assets besides MediaPipe and fonts.

Deliverable: full content of index.html, styles.css, config.js, and app.js.
