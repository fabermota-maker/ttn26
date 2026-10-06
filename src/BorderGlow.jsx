import { useCallback, useEffect, useRef } from "react";
import "./BorderGlow.css";

function parseHSL(hslStr) {
  const match = String(hslStr).match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return {
    h: parseFloat(match[1]),
    s: parseFloat(match[2]),
    l: parseFloat(match[3]),
  };
}

function buildGlowVars(glowColor, intensity) {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ["", "-60", "-50", "-40", "-30", "-20", "-10"];
  const vars = {};

  for (let i = 0; i < opacities.length; i += 1) {
    vars[`--glow-color${keys[i]}`] = `hsl(${base} / ${Math.min(opacities[i] * intensity, 100)}%)`;
  }

  return vars;
}

const GRADIENT_POSITIONS = ["80% 55%", "69% 34%", "8% 6%", "41% 38%", "86% 85%", "82% 18%", "51% 4%"];
const GRADIENT_KEYS = [
  "--gradient-one",
  "--gradient-two",
  "--gradient-three",
  "--gradient-four",
  "--gradient-five",
  "--gradient-six",
  "--gradient-seven",
];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildGradientVars(colors) {
  const safeColors = Array.isArray(colors) && colors.length ? colors : ["#c084fc", "#f472b6", "#38bdf8"];
  const vars = {};

  for (let i = 0; i < 7; i += 1) {
    const color = safeColors[Math.min(COLOR_MAP[i], safeColors.length - 1)];
    vars[GRADIENT_KEYS[i]] = `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${color} 0px, transparent 50%)`;
  }

  vars["--gradient-base"] = `linear-gradient(${safeColors[0]} 0 100%)`;
  return vars;
}

function isLightColor(color) {
  const value = String(color || "").trim().replace("#", "");
  if (!/^[\da-f]{3}([\da-f]{3})?$/i.test(value)) return false;
  const hex = value.length === 3 ? value.split("").map((char) => char + char).join("") : value;
  const red = parseInt(hex.slice(0, 2), 16);
  const green = parseInt(hex.slice(2, 4), 16);
  const blue = parseInt(hex.slice(4, 6), 16);
  return red * 0.2126 + green * 0.7152 + blue * 0.0722 > 180;
}

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}

function easeInCubic(x) {
  return x * x * x;
}

function animateValue({ start = 0, end = 100, duration = 1000, delay = 0, ease = easeOutCubic, onUpdate, onEnd }) {
  let frameId = 0;
  let timeoutId = 0;
  let stopped = false;
  const t0 = performance.now() + delay;

  function tick() {
    if (stopped) return;
    const elapsed = performance.now() - t0;
    const t = Math.min(elapsed / duration, 1);
    onUpdate(start + (end - start) * ease(t));
    if (t < 1) {
      frameId = requestAnimationFrame(tick);
    } else if (onEnd) {
      onEnd();
    }
  }

  timeoutId = window.setTimeout(() => {
    frameId = requestAnimationFrame(tick);
  }, delay);

  return () => {
    stopped = true;
    window.clearTimeout(timeoutId);
    cancelAnimationFrame(frameId);
  };
}

function BorderGlow({
  children,
  className = "",
  edgeSensitivity = 30,
  glowColor = "40 80 80",
  backgroundColor = "#120F17",
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1,
  coneSpread = 25,
  animated = false,
  colors = ["#c084fc", "#f472b6", "#38bdf8"],
  fillOpacity = 0.5,
}) {
  const cardRef = useRef(null);
  const rectRef = useRef(null);
  const pointerRef = useRef({ clientX: 0, clientY: 0 });
  const pointerRafRef = useRef(null);

  const updatePointerGlow = useCallback(() => {
    pointerRafRef.current = null;
    const card = cardRef.current;
    const rect = rectRef.current;
    if (!card || !rect) return;

    const x = pointerRef.current.clientX - rect.left;
    const y = pointerRef.current.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = x - cx;
    const dy = y - cy;

    let kx = Infinity;
    let ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);

    let angle = 0;
    if (dx !== 0 || dy !== 0) {
      angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      if (angle < 0) angle += 360;
    }

    card.style.setProperty("--edge-proximity", `${(edge * 100).toFixed(3)}`);
    card.style.setProperty("--cursor-angle", `${angle.toFixed(3)}deg`);
  }, []);

  const cacheCardRect = useCallback(() => {
    if (!cardRef.current) return;
    rectRef.current = cardRef.current.getBoundingClientRect();
  }, []);

  const handlePointerEnter = useCallback(() => {
    cacheCardRect();
  }, [cacheCardRect]);

  const handlePointerMove = useCallback(
    (event) => {
      if (!rectRef.current) cacheCardRect();
      pointerRef.current.clientX = event.clientX;
      pointerRef.current.clientY = event.clientY;
      if (pointerRafRef.current === null) {
        pointerRafRef.current = requestAnimationFrame(updatePointerGlow);
      }
    },
    [cacheCardRect, updatePointerGlow]
  );

  const handlePointerLeave = useCallback(() => {
    rectRef.current = null;
    if (pointerRafRef.current !== null) {
      cancelAnimationFrame(pointerRafRef.current);
      pointerRafRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (pointerRafRef.current !== null) {
        cancelAnimationFrame(pointerRafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!animated || !cardRef.current) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const card = cardRef.current;
    const angleStart = 110;
    const angleEnd = 465;
    card.classList.add("sweep-active");
    card.style.setProperty("--cursor-angle", `${angleStart}deg`);

    const cleanups = [
      animateValue({
        duration: 500,
        onUpdate: (value) => card.style.setProperty("--edge-proximity", value),
      }),
      animateValue({
        ease: easeInCubic,
        duration: 1500,
        end: 50,
        onUpdate: (value) => {
          card.style.setProperty("--cursor-angle", `${(angleEnd - angleStart) * (value / 100) + angleStart}deg`);
        },
      }),
      animateValue({
        ease: easeOutCubic,
        delay: 1500,
        duration: 2250,
        start: 50,
        end: 100,
        onUpdate: (value) => {
          card.style.setProperty("--cursor-angle", `${(angleEnd - angleStart) * (value / 100) + angleStart}deg`);
        },
      }),
      animateValue({
        ease: easeInCubic,
        delay: 2500,
        duration: 1500,
        start: 100,
        end: 0,
        onUpdate: (value) => card.style.setProperty("--edge-proximity", value),
        onEnd: () => card.classList.remove("sweep-active"),
      }),
    ];

    return () => {
      cleanups.forEach((stop) => stop());
      card.classList.remove("sweep-active");
    };
  }, [animated]);

  const glowVars = buildGlowVars(glowColor, glowIntensity);
  const lightSurface = isLightColor(backgroundColor);

  return (
    <div
      ref={cardRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`border-glow-card${lightSurface ? " border-glow-card--light" : ""} ${className}`.trim()}
      style={{
        "--card-bg": backgroundColor,
        "--edge-sensitivity": edgeSensitivity,
        "--border-radius": `${borderRadius}px`,
        "--glow-padding": `${glowRadius}px`,
        "--cone-spread": coneSpread,
        "--fill-opacity": fillOpacity,
        ...glowVars,
        ...buildGradientVars(colors),
      }}
    >
      <div className="edge-light" aria-hidden="true" />
      <div className="border-glow-inner">{children}</div>
    </div>
  );
}

export default BorderGlow;
