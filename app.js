const body = document.body;
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
const intro = document.getElementById('intro');
const kv = document.getElementById('kv');
const kvTrack = document.getElementById('kvTrack');
const kvStage = document.getElementById('kvStage');
const gestureHint = document.getElementById('gestureHint');
const unlockBtn = document.getElementById('unlockBtn');
const lockBtn = document.getElementById('lockBtn');
const prevSlideBtn = document.getElementById('prevSlide');
const nextSlideBtn = document.getElementById('nextSlide');
const permissionOverlay = document.getElementById('permissionOverlay');
const enableCameraBtn = document.getElementById('enableCamera');
const skipCameraBtn = document.getElementById('skipCamera');
const cameraPanel = document.getElementById('cameraPanel');
const cameraStatus = document.getElementById('cameraStatus');
const cameraVideo = document.getElementById('camera');

const config = window.APP_CONFIG || {};
const themeConfig = config.theme || {};
const themeVars = themeConfig.cssVars || {};
const pageMediaConfig = config.pageMedia || {};

const defaultCopy = {
  brand: 'Xiaomi Explorers',
  meta: 'MWC 2026 - Barcelona',
  kicker: 'The New Wave of AI',
  title: 'See Xiaomi at MWC 2026',
  dates: '2026.03.02 - 2026.03.05 - Hall X - Booth X',
  subtitle: 'Xiaomi Explorer: navigating the New Wave',
  gestureUnlock: 'Show an open hand to unlock the invitation.',
  gestureReturn: 'Close your hand to return.',
  unlockButton: 'Unlock without camera',
  kvTitle: 'The New Wave of AI',
  kvSubtitle: 'See Xiaomi at MWC 2026',
  ctaPrimary: '2026.03.02 - 2026.03.05',
  ctaSecondary: 'Hall X - Booth X',
  kvHelp: 'Swipe or use arrow keys to explore details.',
  prevLabel: 'Prev',
  nextLabel: 'Next',
  backLabel: 'Back to intro',
  permissionTitle: 'Enable camera to interact',
  permissionBody:
    'Camera access is required for real-time interaction only. No recording or data storage.',
  enableCamera: 'Enable camera',
  skipCamera: 'Continue without camera',
  footnote:
    'Camera access is required for real-time interaction only. No recording or data storage.',
  cameraOff: 'Camera: off',
  cameraLive: 'Camera: live',
  cameraBlocked: 'Camera: blocked',
  cameraUnsupported: 'Camera: unsupported',
  cameraSkipped: 'Camera: skipped',
};

const defaultSlides = [
  {
    label: '01',
    title: 'Human x Phone',
    body:
      'AI across Xiaomi HyperOS connects the phone to every device with real-time intelligence.',
    accent: 'sun',
    shape: 'phone',
  },
  {
    label: '02',
    title: 'Human x Car',
    body:
      'Gesture, voice, and multimodal sensing bring the cockpit into the living ecosystem.',
    accent: 'wave',
    shape: 'car',
  },
  {
    label: '03',
    title: 'Human x Home',
    body: 'AI appliances, ambient displays, and proactive assistants in every room.',
    accent: 'sky',
    shape: 'home',
  },
  {
    label: '04',
    title: 'Human x Lab',
    body: 'Xiaomi Explorers test the edge of physical AI in Barcelona.',
    accent: 'ember',
    shape: 'lab',
  },
];

const copy = { ...defaultCopy, ...(config.copy || {}) };
const slides = Array.isArray(config.slides) && config.slides.length
  ? config.slides
  : defaultSlides;
const particleConfig = config.particle || {};
const maskConfig = particleConfig.mask || {};
const waveConfig = particleConfig.wave || {};
const colorsConfig = config.colors || {};
const gestureConfig = config.gesture || {};
const kvMediaConfig = config.kvMedia || {};

const palette = colorsConfig.palette || [
  '#ff5a1f',
  '#ff2d6f',
  '#ffd166',
  '#5fd8ff',
];
const textLines =
  particleConfig.textLines || ['The New Wave of AI', 'See Xiaomi in MWC'];

const baseImageDesktop = kvMediaConfig.baseImage || '';
const baseImageMobile = kvMediaConfig.baseImageMobile || '';
const defaultPosition = kvMediaConfig.defaultPosition || '50% 50%';
const defaultSize = kvMediaConfig.defaultSize || 'cover';
const defaultOverlay =
  typeof kvMediaConfig.overlayOpacity === 'number'
    ? kvMediaConfig.overlayOpacity
    : 0.35;
const mobileQuery = window.matchMedia('(max-width: 768px)');
const introMediaConfig = pageMediaConfig.intro || {};
const kvPageMediaConfig = pageMediaConfig.kv || {};
const maskImageDesktop = maskConfig.image || '';
const maskImageMobile = maskConfig.imageMobile || '';
const maskFit = maskConfig.fit === 'cover' ? 'cover' : 'contain';
const maskThreshold =
  typeof maskConfig.threshold === 'number' ? maskConfig.threshold : 10;
const maskInvert = Boolean(maskConfig.invert);
const maskGap = typeof maskConfig.gap === 'number' ? maskConfig.gap : null;
const maskDensity =
  typeof maskConfig.sampleDensity === 'number' ? maskConfig.sampleDensity : null;

const particleSizeMin =
  typeof particleConfig.sizeMin === 'number' ? particleConfig.sizeMin : 1.4;
const particleSizeMax =
  typeof particleConfig.sizeMax === 'number' ? particleConfig.sizeMax : 3.2;
const targetCount =
  typeof particleConfig.targetCount === 'number' && particleConfig.targetCount > 0
    ? Math.floor(particleConfig.targetCount)
    : null;

const swipeEnabled = gestureConfig.swipeEnabled !== false;
const swipeDistance =
  typeof gestureConfig.swipeDistance === 'number' ? gestureConfig.swipeDistance : 0.14;
const swipeCooldownMs =
  typeof gestureConfig.swipeCooldownMs === 'number'
    ? gestureConfig.swipeCooldownMs
    : 800;
const fallbackWhenCameraOn = Boolean(gestureConfig.fallbackWhenCameraOn);

let width = 0;
let height = 0;
let dpr = window.devicePixelRatio || 1;
let particles = [];
let textTargets = [];
let waveTargets = [];
let unlockTargets = [];
let maskTargets = [];
let maskLoadId = 0;
let particleAlpha = 1;
let targetAlpha = 1;
let particleMode = 'text';
let currentSlide = 0;
let slideSpacing = 0;
let trackingActive = false;
let openFrames = 0;
let closedFrames = 0;
let frameRequested = false;
let swipeLastX = null;
let swipeAccum = 0;
let swipeDirection = 0;
let swipeCooldownUntil = 0;

const state = {
  mode: 'intro',
  cameraEnabled: false,
  cameraReady: false,
};

const openThreshold =
  typeof gestureConfig.openFrames === 'number' ? gestureConfig.openFrames : 6;
const closedThreshold =
  typeof gestureConfig.closedFrames === 'number' ? gestureConfig.closedFrames : 6;

function setText(id, value) {
  const element = document.getElementById(id);
  if (!element) {
    return null;
  }
  if (value === undefined || value === null || value === '') {
    element.textContent = '';
    element.style.display = 'none';
  } else {
    element.textContent = value;
    element.style.removeProperty('display');
  }
  return element;
}

function setButtonText(button, value) {
  if (!button) {
    return;
  }
  if (value === undefined || value === null || value === '') {
    button.textContent = '';
    button.style.display = 'none';
  } else {
    button.textContent = value;
    button.style.removeProperty('display');
  }
}

function toggleContainer(container) {
  if (!container) {
    return;
  }
  const visible = Array.from(container.children).some(
    (child) => child.style.display !== 'none'
  );
  if (visible) {
    container.style.removeProperty('display');
  } else {
    container.style.display = 'none';
  }
}

function applyCopy() {
  const introCopy = document.querySelector('.intro-copy');
  const kvHeader = document.querySelector('.kv-header');
  const cta = document.querySelector('.cta');
  const topbar = document.querySelector('.topbar');

  setText('brand', copy.brand);
  setText('meta', copy.meta);
  setText('kicker', copy.kicker);
  setText('title', copy.title);
  setText('dates', copy.dates);
  setText('subtitle', copy.subtitle);
  setText('gestureHint', copy.gestureUnlock);
  setButtonText(unlockBtn, copy.unlockButton);
  setText('kvTitle', copy.kvTitle);
  setText('kvSubtitle', copy.kvSubtitle);
  setText('ctaPrimary', copy.ctaPrimary);
  setText('ctaSecondary', copy.ctaSecondary);
  setText('kvHelp', copy.kvHelp);
  setText('permissionTitle', copy.permissionTitle);
  setText('permissionBody', copy.permissionBody);
  setText('footnote', copy.footnote);
  setText('cameraStatus', copy.cameraOff);

  setButtonText(prevSlideBtn, copy.prevLabel);
  setButtonText(nextSlideBtn, copy.nextLabel);
  setButtonText(lockBtn, copy.backLabel);
  setButtonText(enableCameraBtn, copy.enableCamera);
  setButtonText(skipCameraBtn, copy.skipCamera);

  toggleContainer(topbar);
  toggleContainer(introCopy);
  toggleContainer(cta);
  toggleContainer(kvHeader);
}

function getMediaSource(media) {
  if (!media) {
    return '';
  }
  if (isMobileView()) {
    return media.imageMobile || media.image || '';
  }
  return media.image || '';
}

function applyPageMedia(elementId, media) {
  const element = document.getElementById(elementId);
  if (!element) {
    return;
  }
  const source = getMediaSource(media);
  if (!source) {
    element.style.display = 'none';
    element.style.backgroundImage = 'none';
    return;
  }
  element.style.removeProperty('display');
  element.style.backgroundImage = `url('${source}')`;
  element.style.backgroundPosition = media.position || '50% 50%';
  element.style.backgroundSize = media.size || 'cover';
  const overlay =
    typeof media.overlayOpacity === 'number' ? media.overlayOpacity : 0.35;
  element.style.setProperty('--media-overlay', overlay);
}

function applyTheme() {
  const root = document.documentElement;
  Object.entries(themeVars).forEach(([key, value]) => {
    if (key && value !== undefined && value !== null) {
      root.style.setProperty(key, String(value));
    }
  });
}

function isMobileView() {
  return mobileQuery.matches;
}

function canUseFallbackNavigation() {
  if (!state.cameraEnabled) {
    return true;
  }
  return fallbackWhenCameraOn;
}

function getSlideImageSource(slide) {
  const useMobile = isMobileView();
  const slideImage = useMobile ? slide.imageMobile || slide.image : slide.image;
  const baseImage = useMobile ? baseImageMobile || baseImageDesktop : baseImageDesktop;
  return slideImage || baseImage || '';
}

function applySlideMedia(card, slide) {
  const imageSource = getSlideImageSource(slide);
  let media = card.querySelector('.slide-media');
  if (!media) {
    media = document.createElement('div');
    media.className = 'slide-media';
    card.appendChild(media);
  }

  if (!imageSource) {
    card.classList.remove('has-media');
    media.style.backgroundImage = 'none';
    media.removeAttribute('role');
    media.setAttribute('aria-hidden', 'true');
    return;
  }

  const position = slide.imagePosition || defaultPosition;
  const size = slide.imageSize || defaultSize;
  const overlay =
    typeof slide.overlayOpacity === 'number' ? slide.overlayOpacity : defaultOverlay;

  card.classList.add('has-media');
  media.style.backgroundImage = `url('${imageSource}')`;
  media.style.backgroundPosition = position;
  media.style.backgroundSize = size;
  media.style.setProperty('--slide-overlay', overlay);
  if (slide.imageAlt) {
    media.setAttribute('role', 'img');
    media.setAttribute('aria-label', slide.imageAlt);
    media.removeAttribute('aria-hidden');
  } else {
    media.removeAttribute('role');
    media.setAttribute('aria-hidden', 'true');
  }
}

function buildSlides() {
  kvTrack.innerHTML = '';
  slides.forEach((slide) => {
    const card = document.createElement('article');
    card.className = 'kv-slide';
    if (slide.accent) {
      card.dataset.accent = slide.accent;
    }

    const label = document.createElement('div');
    label.className = 'slide-label';
    label.textContent = slide.label || '';

    const title = document.createElement('h3');
    title.textContent = slide.title || '';

    const bodyText = document.createElement('p');
    bodyText.textContent = slide.body || '';

    const shape = document.createElement('div');
    shape.className = 'slide-shape';
    if (slide.shape) {
      shape.classList.add(slide.shape);
    }

    card.appendChild(label);
    card.appendChild(title);
    card.appendChild(bodyText);
    card.appendChild(shape);
    kvTrack.appendChild(card);
    applySlideMedia(card, slide);
  });
}

function updateSlideMedia() {
  const cards = kvTrack.querySelectorAll('.kv-slide');
  cards.forEach((card, index) => {
    const slide = slides[index];
    if (slide) {
      applySlideMedia(card, slide);
    }
  });
}

function updateNavigationAvailability() {
  const allowFallback = canUseFallbackNavigation();
  [prevSlideBtn, nextSlideBtn, lockBtn].forEach((button) => {
    if (!button) {
      return;
    }
    if (allowFallback) {
      button.removeAttribute('disabled');
      button.style.removeProperty('pointer-events');
      button.style.removeProperty('opacity');
    } else {
      button.setAttribute('disabled', 'true');
      button.style.pointerEvents = 'none';
      button.style.opacity = '0.4';
    }
  });
  if (unlockBtn) {
    if (!unlockBtn.textContent) {
      unlockBtn.style.display = 'none';
      return;
    }
    if (allowFallback) {
      unlockBtn.style.removeProperty('display');
    } else {
      unlockBtn.style.display = 'none';
    }
  }
}

class Particle {
  constructor(x, y, index) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.index = index;
    this.base = textTargets[index] || { x, y };
    this.unlock = unlockTargets[index] || { x, y };
    this.size = particleSizeMin + Math.random() * (particleSizeMax - particleSizeMin);
  }

  update() {
    const target = particleMode === 'text' ? this.base : this.unlock;
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    this.vx += dx * 0.02;
    this.vy += dy * 0.02;
    this.vx *= 0.85;
    this.vy *= 0.85;
    this.x += this.vx;
    this.y += this.vy;
  }

  draw() {
    const color = palette[this.index % palette.length];
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  textTargets = buildTextTargets(textLines);
  waveTargets = buildWaveTargets(textTargets.length);
  unlockTargets = waveTargets;
  buildParticles();
  updateSlideMetrics();
  updateMaskTargets();
  applyPageMedia('introMedia', introMediaConfig);
  applyPageMedia('kvMedia', kvPageMediaConfig);
}

function getSampleGap(overrideGap, overrideDensity) {
  const minGap = typeof particleConfig.minGap === 'number' ? particleConfig.minGap : 4;
  const sampleDensity =
    typeof particleConfig.sampleDensity === 'number' ? particleConfig.sampleDensity : 180;
  if (typeof overrideGap === 'number' && overrideGap > 0) {
    return Math.max(minGap, Math.floor(overrideGap));
  }
  const density = typeof overrideDensity === 'number' && overrideDensity > 0
    ? overrideDensity
    : sampleDensity;
  return Math.max(minGap, Math.floor(width / density));
}

function downsamplePoints(points, count) {
  if (points.length <= count) {
    return points;
  }
  const step = points.length / count;
  const next = [];
  for (let i = 0; i < count; i += 1) {
    next.push(points[Math.floor(i * step)]);
  }
  return next;
}

function normalizePoints(points, count) {
  if (!count || !points.length) {
    return points;
  }
  if (points.length === count) {
    return points;
  }
  if (points.length > count) {
    return downsamplePoints(points, count);
  }
  const next = points.slice();
  let index = 0;
  while (next.length < count) {
    next.push(points[index % points.length]);
    index += 1;
  }
  return next;
}

function applyTargetCount(points) {
  if (!targetCount) {
    return points;
  }
  return normalizePoints(points, targetCount);
}

function applyUnlockTargets(nextTargets) {
  unlockTargets = nextTargets;
  particles.forEach((particle, index) => {
    particle.unlock = unlockTargets[index] || particle.base;
  });
}

function buildTextTargets(lines) {
  const offscreen = document.createElement('canvas');
  offscreen.width = width;
  offscreen.height = height;
  const off = offscreen.getContext('2d');
  off.clearRect(0, 0, width, height);
  const fontScale =
    typeof particleConfig.fontScale === 'number' ? particleConfig.fontScale : 0.08;
  const maxFontSize =
    typeof particleConfig.maxFontSize === 'number' ? particleConfig.maxFontSize : 64;
  const fontWeight = particleConfig.fontWeight || 700;
  const fontFamily = particleConfig.fontFamily || "'Space Grotesk'";
  const fontSize = Math.min(width * fontScale, maxFontSize);
  off.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  off.textAlign = 'center';
  off.textBaseline = 'middle';
  off.fillStyle = '#ffffff';
  const lineGapScale =
    typeof particleConfig.lineGapScale === 'number'
      ? particleConfig.lineGapScale
      : 0.95;
  const startYScale =
    typeof particleConfig.startYScale === 'number' ? particleConfig.startYScale : 0.45;
  const lineGap = fontSize * lineGapScale;
  const startY = height * startYScale;
  lines.forEach((line, index) => {
    off.fillText(line, width / 2, startY + index * lineGap);
  });

  const data = off.getImageData(0, 0, width, height).data;
  const gap = getSampleGap();
  const points = [];
  for (let y = 0; y < height; y += gap) {
    for (let x = 0; x < width; x += gap) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 0) {
        points.push({ x, y });
      }
    }
  }
  return applyTargetCount(points);
}

function buildWaveTargets(count) {
  const targets = [];
  const rows = typeof waveConfig.rows === 'number' ? waveConfig.rows : 4;
  const baseYScale =
    typeof waveConfig.baseYScale === 'number' ? waveConfig.baseYScale : 0.5;
  const rowGapScale =
    typeof waveConfig.rowGapScale === 'number' ? waveConfig.rowGapScale : 0.06;
  const amplitudeScale =
    typeof waveConfig.amplitudeScale === 'number' ? waveConfig.amplitudeScale : 0.07;
  const frequency =
    typeof waveConfig.frequency === 'number' ? waveConfig.frequency : 4;
  const baseY = height * baseYScale;
  const rowGap = height * rowGapScale;
  const amplitude = height * amplitudeScale;
  const total = Math.max(count, 1);

  for (let i = 0; i < total; i += 1) {
    const t = i / total;
    const row = i % rows;
    const offset = (row - (rows - 1) / 2) * rowGap;
    const x = t * width;
    const y = baseY + offset + Math.sin(t * Math.PI * frequency + row) * amplitude;
    targets.push({ x, y });
  }

  return targets;
}

function getMaskSource() {
  if (isMobileView()) {
    return maskImageMobile || maskImageDesktop || '';
  }
  return maskImageDesktop || '';
}

function loadMaskTargets(source) {
  return new Promise((resolve, reject) => {
    if (!source) {
      resolve([]);
      return;
    }
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      const offscreen = document.createElement('canvas');
      offscreen.width = width;
      offscreen.height = height;
      const off = offscreen.getContext('2d');
      off.clearRect(0, 0, width, height);
      const scale =
        maskFit === 'cover'
          ? Math.max(width / image.width, height / image.height)
          : Math.min(width / image.width, height / image.height);
      const drawWidth = image.width * scale;
      const drawHeight = image.height * scale;
      const dx = (width - drawWidth) / 2;
      const dy = (height - drawHeight) / 2;
      off.drawImage(image, dx, dy, drawWidth, drawHeight);
      let data;
      try {
        data = off.getImageData(0, 0, width, height).data;
      } catch (error) {
        reject(error);
        return;
      }
      const gap = getSampleGap(maskGap, maskDensity);
      const points = [];
      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          const index = (y * width + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          const a = data[index + 3];
          const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          const strength = a < 255 ? a : luminance;
          const hit = maskInvert ? strength < maskThreshold : strength >= maskThreshold;
          if (hit) {
            points.push({ x, y });
          }
        }
      }
      resolve(points);
    };
    image.onerror = () => reject(new Error('Mask image failed to load'));
    image.src = source;
  });
}

function updateMaskTargets() {
  const maskEnabled = Boolean(maskConfig.enabled);
  if (!maskEnabled) {
    applyUnlockTargets(waveTargets);
    return;
  }
  const source = getMaskSource();
  if (!source) {
    applyUnlockTargets(waveTargets);
    return;
  }
  const currentLoad = (maskLoadId += 1);
  applyUnlockTargets(waveTargets);
  loadMaskTargets(source)
    .then((points) => {
      if (currentLoad !== maskLoadId) {
        return;
      }
      const normalized = normalizePoints(points, textTargets.length);
      if (!normalized.length) {
        applyUnlockTargets(waveTargets);
        return;
      }
      maskTargets = normalized;
      applyUnlockTargets(maskTargets);
    })
    .catch(() => {
      if (currentLoad !== maskLoadId) {
        return;
      }
      applyUnlockTargets(waveTargets);
    });
}

function resetSwipeTracker() {
  swipeLastX = null;
  swipeAccum = 0;
  swipeDirection = 0;
}

function getGesturePoint(landmarks) {
  if (!landmarks || !landmarks.length) {
    return null;
  }
  return landmarks[8] || landmarks[0] || null;
}

function handleSwipeGesture(landmarks) {
  if (!swipeEnabled || state.mode !== 'kv' || !state.cameraEnabled) {
    resetSwipeTracker();
    return;
  }
  const point = getGesturePoint(landmarks);
  if (!point) {
    resetSwipeTracker();
    return;
  }
  const now = performance.now();
  if (now < swipeCooldownUntil) {
    swipeLastX = point.x;
    return;
  }
  if (swipeLastX === null) {
    swipeLastX = point.x;
    return;
  }
  const dx = point.x - swipeLastX;
  swipeLastX = point.x;
  if (Math.abs(dx) < 0.002) {
    return;
  }
  const direction = Math.sign(dx);
  if (direction !== swipeDirection) {
    swipeDirection = direction;
    swipeAccum = 0;
  }
  swipeAccum += dx;
  if (Math.abs(swipeAccum) >= swipeDistance) {
    if (swipeAccum < 0) {
      goToSlide(currentSlide + 1);
    } else {
      goToSlide(currentSlide - 1);
    }
    swipeAccum = 0;
    swipeDirection = 0;
    swipeCooldownUntil = now + swipeCooldownMs;
  }
}

function buildParticles() {
  particles = textTargets.map((point, index) =>
    new Particle(
      point.x + (Math.random() - 0.5) * 30,
      point.y + (Math.random() - 0.5) * 30,
      index
    )
  );
  particles.forEach((particle, index) => {
    particle.base = textTargets[index];
    particle.unlock = unlockTargets[index] || textTargets[index];
  });
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  particleAlpha += (targetAlpha - particleAlpha) * 0.08;
  ctx.globalAlpha = particleAlpha;

  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  ctx.globalAlpha = 1;
  requestAnimationFrame(animate);
}

function setMode(nextMode) {
  if (state.mode === nextMode) {
    return;
  }
  state.mode = nextMode;
  body.dataset.mode = nextMode;
  if (nextMode === 'kv') {
    particleMode = 'unlock';
    targetAlpha = 0.2;
    kv.setAttribute('aria-hidden', 'false');
    intro.setAttribute('aria-hidden', 'true');
    setText('gestureHint', copy.gestureReturn);
  } else {
    particleMode = 'text';
    targetAlpha = 1;
    kv.setAttribute('aria-hidden', 'true');
    intro.setAttribute('aria-hidden', 'false');
    setText('gestureHint', copy.gestureUnlock);
  }
  resetSwipeTracker();
}

function unlock() {
  setMode('kv');
}

function lock() {
  setMode('intro');
}

function updateSlideMetrics() {
  const slide = document.querySelector('.kv-slide');
  if (!slide) {
    return;
  }
  const style = window.getComputedStyle(slide);
  slideSpacing = slide.offsetWidth + parseFloat(style.marginRight || '0');
  updateSlides();
}

function updateSlides() {
  kvTrack.style.transform = `translateX(${-currentSlide * slideSpacing}px)`;
}

function goToSlide(index) {
  const slides = document.querySelectorAll('.kv-slide');
  const max = slides.length - 1;
  currentSlide = Math.max(0, Math.min(index, max));
  updateSlides();
}

function handleSwipe() {
  let startX = 0;
  let pointerId = null;

  kvStage.addEventListener('pointerdown', (event) => {
    if (!canUseFallbackNavigation()) {
      return;
    }
    startX = event.clientX;
    pointerId = event.pointerId;
    kvStage.setPointerCapture(pointerId);
  });

  kvStage.addEventListener('pointerup', (event) => {
    if (!canUseFallbackNavigation()) {
      return;
    }
    if (pointerId !== event.pointerId) {
      return;
    }
    const delta = event.clientX - startX;
    if (Math.abs(delta) > 40) {
      if (delta < 0) {
        goToSlide(currentSlide + 1);
      } else {
        goToSlide(currentSlide - 1);
      }
    }
    pointerId = null;
  });

  kvStage.addEventListener('pointercancel', () => {
    pointerId = null;
  });
}

function handleKeys(event) {
  if (state.mode !== 'kv') {
    return;
  }
  if (!canUseFallbackNavigation()) {
    return;
  }
  if (event.key === 'ArrowRight') {
    goToSlide(currentSlide + 1);
  }
  if (event.key === 'ArrowLeft') {
    goToSlide(currentSlide - 1);
  }
}

function updateCameraStatus(text, active) {
  cameraStatus.textContent = text;
  if (active) {
    cameraPanel.classList.add('active');
  } else {
    cameraPanel.classList.remove('active');
  }
}

async function startCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    updateCameraStatus(copy.cameraUnsupported, false);
    permissionOverlay.classList.add('hidden');
    updateNavigationAvailability();
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' },
      audio: false,
    });
    cameraVideo.srcObject = stream;
    await cameraVideo.play();
    state.cameraEnabled = true;
    state.cameraReady = true;
    updateCameraStatus(copy.cameraLive, true);
    permissionOverlay.classList.add('hidden');
    updateNavigationAvailability();
    startHandTracking();
  } catch (error) {
    updateCameraStatus(copy.cameraBlocked, false);
    permissionOverlay.classList.add('hidden');
    updateNavigationAvailability();
  }
}

function skipCamera() {
  updateCameraStatus(copy.cameraSkipped, false);
  permissionOverlay.classList.add('hidden');
  updateNavigationAvailability();
}

function isFingerExtended(landmarks, tipIndex, pipIndex) {
  return landmarks[tipIndex].y < landmarks[pipIndex].y - 0.02;
}

function detectHandState(landmarks) {
  const tips = [8, 12, 16, 20];
  const pips = [6, 10, 14, 18];
  let extended = 0;
  for (let i = 0; i < tips.length; i += 1) {
    if (isFingerExtended(landmarks, tips[i], pips[i])) {
      extended += 1;
    }
  }
  return {
    open: extended >= 3,
    closed: extended <= 1,
  };
}

function handleResults(results) {
  if (!state.cameraEnabled) {
    return;
  }
  const hands = results.multiHandLandmarks || [];
  if (!hands.length) {
    openFrames = 0;
    closedFrames = 0;
    resetSwipeTracker();
    return;
  }
  const { open, closed } = detectHandState(hands[0]);
  if (open) {
    openFrames += 1;
    closedFrames = 0;
  } else if (closed) {
    closedFrames += 1;
    openFrames = 0;
  } else {
    openFrames = 0;
    closedFrames = 0;
  }

  if (openFrames >= openThreshold) {
    unlock();
    openFrames = 0;
  }
  if (closedFrames >= closedThreshold) {
    lock();
    closedFrames = 0;
  }

  handleSwipeGesture(hands[0]);
}

function startHandTracking() {
  if (!window.Hands || trackingActive) {
    return;
  }
  trackingActive = true;
  const hands = new Hands({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });
  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6,
  });
  hands.onResults(handleResults);

  const process = async () => {
    if (!state.cameraEnabled || !state.cameraReady) {
      trackingActive = false;
      return;
    }
    if (frameRequested) {
      requestAnimationFrame(process);
      return;
    }
    frameRequested = true;
    await hands.send({ image: cameraVideo });
    frameRequested = false;
    requestAnimationFrame(process);
  };

  requestAnimationFrame(process);
}

unlockBtn.addEventListener('click', unlock);
lockBtn.addEventListener('click', lock);
prevSlideBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
nextSlideBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

enableCameraBtn.addEventListener('click', startCamera);
skipCameraBtn.addEventListener('click', skipCamera);

document.addEventListener('keydown', handleKeys);
handleSwipe();

window.addEventListener('resize', () => {
  resizeCanvas();
  updateSlideMedia();
});

mobileQuery.addEventListener('change', () => {
  updateSlideMedia();
  updateMaskTargets();
  applyPageMedia('introMedia', introMediaConfig);
  applyPageMedia('kvMedia', kvPageMediaConfig);
});

applyTheme();
applyCopy();
buildSlides();
updateNavigationAvailability();
resizeCanvas();
animate();

if (document.visibilityState === 'visible') {
  permissionOverlay.classList.remove('hidden');
}
