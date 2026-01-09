window.APP_CONFIG = {
  copy: {
    brand: "",
    meta: "",
    kicker: "",
    title: "",
    dates: "",
    subtitle: "",
    gestureUnlock: "Show an open hand to unlock the invitation.",
    gestureReturn: "Close your hand to return.",
    unlockButton: "Unlock without camera",
    kvTitle: "",
    kvSubtitle: "",
    ctaPrimary: "",
    ctaSecondary: "",
    kvHelp: "Swipe your hand left or right to explore details.",
    prevLabel: "Prev",
    nextLabel: "Next",
    backLabel: "Back to intro",
    permissionTitle: "Enable camera to interact",
    permissionBody:
      "Camera access is required for real-time interaction only. No recording or data storage.",
    enableCamera: "Enable camera",
    skipCamera: "Continue without camera",
    footnote:
      "Camera access is required for real-time interaction only. No recording or data storage.",
    cameraOff: "Camera: off",
    cameraLive: "Camera: live",
    cameraBlocked: "Camera: blocked",
    cameraUnsupported: "Camera: unsupported",
    cameraSkipped: "Camera: skipped"
  },
  pageMedia: {
    intro: {
      image: "",
      imageMobile: "",
      position: "50% 50%",
      size: "cover",
      overlayOpacity: 0.25
    },
    kv: {
      image: "",
      imageMobile: "",
      position: "50% 50%",
      size: "cover",
      overlayOpacity: 0.25
    }
  },
  theme: {
    cssVars: {
      "--ink": "#0b0d12",
      "--pearl": "#f8f3ee",
      "--sun": "#ff5a1f",
      "--coral": "#ff2d6f",
      "--sky": "#5fd8ff",
      "--gold": "#ffd166",
      "--steel": "#21242d",
      "--haze": "rgba(255, 255, 255, 0.08)",
      "--page-bg": "radial-gradient(circle at top, #1b2232, #0b0d12 60%)",
      "--orb-one": "radial-gradient(circle, rgba(255, 90, 31, 0.35), transparent 60%)",
      "--orb-two": "radial-gradient(circle, rgba(95, 216, 255, 0.25), transparent 70%)",
      "--font-body": "'Space Grotesk', sans-serif",
      "--font-display": "'Staatliches', sans-serif"
    }
  },
  kvMedia: {
    baseImage: "",
    baseImageMobile: "",
    defaultPosition: "50% 50%",
    defaultSize: "cover",
    overlayOpacity: 0.35
  },
  particle: {
    textLines: ["The New Wave of AI", "See Xiaomi in MWC"],
    fontFamily: "'Space Grotesk'",
    fontWeight: 700,
    fontScale: 0.08,
    maxFontSize: 64,
    targetCount: null,
    minGap: 4,
    sampleDensity: 180,
    sizeMin: 1.4,
    sizeMax: 3.2,
    mask: {
      enabled: false,
      image: "",
      imageMobile: "",
      fit: "contain",
      threshold: 20,
      invert: false,
      gap: 0,
      sampleDensity: 180
    },
    wave: {
      rows: 4,
      rowGapScale: 0.06,
      amplitudeScale: 0.07,
      frequency: 4
    }
  },
  colors: {
    palette: ["#ff5a1f", "#ff2d6f", "#ffd166", "#5fd8ff"]
  },
  gesture: {
    openFrames: 6,
    closedFrames: 6,
    swipeEnabled: true,
    swipeDistance: 0.1,
    swipeCooldownMs: 600,
    swipeDeadZone: 0.002,
    swipeSuppressCloseMs: 600,
    swipePoint: "wrist",
    swipeResetZone: 0.08,
    swipeResetFrames: 6,
    fallbackWhenCameraOn: false
  },
  slides: [
    {
      label: "01",
      title: "Human x Phone",
      body:
        "AI across Xiaomi HyperOS connects the phone to every device with real-time intelligence.",
      accent: "sun",
      shape: "phone",
      image: "",
      imageMobile: "",
      imagePosition: "20% 50%",
      imageSize: "cover",
      imageAlt: ""
    },
    {
      label: "02",
      title: "Human x Car",
      body:
        "Gesture, voice, and multimodal sensing bring the cockpit into the living ecosystem.",
      accent: "wave",
      shape: "car",
      image: "",
      imageMobile: "",
      imagePosition: "50% 50%",
      imageSize: "cover",
      imageAlt: ""
    },
    {
      label: "03",
      title: "Human x Home",
      body:
        "AI appliances, ambient displays, and proactive assistants in every room.",
      accent: "sky",
      shape: "home",
      image: "",
      imageMobile: "",
      imagePosition: "80% 45%",
      imageSize: "cover",
      imageAlt: ""
    },
    {
      label: "04",
      title: "Human x Lab",
      body: "Xiaomi Explorers test the edge of physical AI in Barcelona.",
      accent: "ember",
      shape: "lab",
      image: "",
      imageMobile: "",
      imagePosition: "60% 40%",
      imageSize: "cover",
      imageAlt: ""
    }
  ]
};
