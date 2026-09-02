const LP_BOOT_MIN_MS = 7000;
const LP_BOOT_MAX_MS = 25000;
const lpBootStartedAt = Date.now();

function hideLpBootScreen() {
  const boot = document.getElementById("lp-boot");
  if (!boot || boot.classList.contains("is-done")) return;

  boot.classList.add("is-done");
  boot.setAttribute("aria-busy", "false");

  const remove = () => boot.remove();
  boot.addEventListener("transitionend", remove, { once: true });
  window.setTimeout(remove, 700);
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function landingPageIsReady() {
  const root = document.getElementById("root");
  const hasPage = Boolean(root && root.querySelector("main, header, .page-shell"));
  if (!hasPage) return false;

  const images = [...root.querySelectorAll("img")].filter(
    (image) => image.getAttribute("loading") !== "lazy"
  );
  const videos = [...root.querySelectorAll("video")];
  const imagesReady = images.length === 0 || images.every((image) => image.complete);
  const videosReady =
    videos.length === 0 ||
    videos.every((video) => video.readyState >= 3 || Boolean(video.error));

  return imagesReady && videosReady;
}

function waitForLandingMedia() {
  const deadline = Date.now() + LP_BOOT_MAX_MS;

  return new Promise((resolve) => {
    const tick = () => {
      if (landingPageIsReady() || Date.now() > deadline) {
        resolve();
        return;
      }
      window.requestAnimationFrame(tick);
    };

    window.requestAnimationFrame(tick);
  });
}

async function revealLandingWhenReady() {
  try {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
  } catch (_error) {
    /* ignore font wait failures */
  }

  await waitForLandingMedia();

  const remaining = LP_BOOT_MIN_MS - (Date.now() - lpBootStartedAt);
  if (remaining > 0) {
    await wait(remaining);
  }

  hideLpBootScreen();
}
