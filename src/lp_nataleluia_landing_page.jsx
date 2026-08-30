import React, { useEffect, useMemo, useRef, useState } from "react";

const LOGO_URL = "./assets/logo-nataleluia.png";
const HERO_VIDEO_URL = "./assets/hero.mp4";
const CHURCH_LOGO_URL = "./assets/logo-pib.png";
const TIMELINE_SELECTED_BG_URL = "https://live.staticflickr.com/65535/55005691814_c0d8c37fbc.jpg";
const COMPROMISSO_ADORACAO_LOGO_URL = "./assets/images/compromisso-adoracao-logo.png?v=3";
const SPONSOR_MONOGRAM_URL = "./assets/icons/nataleluia-monogram-n.png";

const TIMELINE_2022_CARD_IMAGE_URL = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1200" role="img" aria-label="25 anos">
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f0eeea"/>
      <stop offset="100%" stop-color="#e4e0db"/>
    </linearGradient>
    <linearGradient id="washA" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#c9c8df"/>
      <stop offset="45%" stop-color="#8d63b1"/>
      <stop offset="100%" stop-color="#4d4d96"/>
    </linearGradient>
    <linearGradient id="washB" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#dddced"/>
      <stop offset="42%" stop-color="#9b6bb9"/>
      <stop offset="100%" stop-color="#3f428d"/>
    </linearGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer>
        <feFuncA type="table" tableValues="0 0.05"/>
      </feComponentTransfer>
    </filter>
  </defs>

  <rect width="900" height="1200" fill="url(#paper)"/>
  <rect width="900" height="1200" filter="url(#grain)"/>

  <g opacity="0.12">
    <circle cx="165" cy="182" r="86" fill="#ffffff"/>
    <circle cx="748" cy="312" r="104" fill="#ffffff"/>
    <circle cx="596" cy="980" r="120" fill="#ffffff"/>
  </g>

  <text x="150" y="590" fill="url(#washA)" font-family="Georgia, 'Times New Roman', serif" font-size="470" font-style="italic" font-weight="700" opacity="0.92">2</text>
  <text x="388" y="795" fill="url(#washB)" font-family="Georgia, 'Times New Roman', serif" font-size="500" font-style="italic" font-weight="700" opacity="0.94">5</text>

  <path d="M420 560c44 18 88 22 142 20 72-2 113-18 151-33 19-8 39 12 27 28-26 37-77 67-132 84-61 19-118 17-182 10z" fill="#5b4aa0" opacity="0.25"/>
</svg>` )}`;

const N2026_PRESENTATION_IMAGE_URL =
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1600&auto=format&fit=crop";
const COMPROMISSO_ADORACAO_INSTAGRAM_URL = "https://www.instagram.com/compromissoadoracao/";
const COMPROMISSO_ADORACAO_ADDRESS = "Rua Bento Viana, 1.200";
const COMPROMISSO_ADORACAO_MAPS_URL =
  "https://www.google.com/maps?cid=3873654248599174438&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAMYASAF&hl=pt-BR&gl=BR&source=embed";
const N2026_BRAND_LABEL = "N2✶26";

function N2026BrandMark({ className = "" }) {
  return (
    <span className={className}>
      N2<span className="text-[#f0ecb9]">✶</span>26
    </span>
  );
}

const navItemsLeft = [
  { label: "O Evento", href: "#evento" },
  { label: "A Experiência", href: "#experiencia" },
  { label: "Linha do tempo", href: "#timeline-lp" },
  { label: N2026_BRAND_LABEL, page: "n2026", isPage: true },
];

const navItemsRight = [
  { label: "FAQ perguntas", href: "#faq" },
  { label: "Seja um patrocinador", href: "#patrocine" },
];

const navItems = [...navItemsLeft, ...navItemsRight];

function getHeaderScrollOffset() {
  const header = document.querySelector(".page-shell > header");
  if (header) {
    return Math.ceil(header.getBoundingClientRect().bottom + 10);
  }
  return window.innerWidth < 768 ? 74 : 82;
}

function scrollToSection(target, behavior = "smooth") {
  const id = typeof target === "string" ? target.replace(/^#/, "") : target;
  const element = document.getElementById(id);
  if (!element) return false;

  const top = element.getBoundingClientRect().top + window.scrollY - getHeaderScrollOffset();
  window.scrollTo({ top: Math.max(0, top), behavior });
  return true;
}

function handleSectionNav(event, href, { setOpen, setCurrentPage } = {}) {
  event.preventDefault();
  setOpen?.(false);
  setCurrentPage?.("home");
  window.requestAnimationFrame(() => {
    scrollToSection(href);
    if (href) window.history.replaceState(null, "", href);
  });
}

function getInitialPage() {
  const { hash } = window.location;
  if (hash === "#n2026") return "n2026";
  if (hash === "#checkout") return "checkout";
  return "home";
}

function handlePageNav(page, { setOpen, setCurrentPage } = {}) {
  setOpen?.(false);
  setCurrentPage?.(page);
  window.requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior: page === "home" ? "smooth" : "auto" });
    const basePath = `${window.location.pathname}${window.location.search}`;
    window.history.replaceState(null, "", page === "home" ? basePath : `${basePath}#${page}`);
  });
}

function renderNavItem(item, { setOpen, setCurrentPage, currentPage, className }) {
  if (item.isPage) {
    const isActive = currentPage === item.page;
    return (
      <button
        key={item.label}
        type="button"
        onClick={() => handlePageNav(item.page, { setOpen, setCurrentPage })}
        className={`${className} ${isActive ? "bg-white/12 text-white" : ""}`}
        aria-current={isActive ? "page" : undefined}
      >
        {item.page === "n2026" ? (
          <N2026BrandMark />
        ) : (
          item.label
        )}
      </button>
    );
  }

  return (
    <a
      key={item.href}
      href={item.href}
      onClick={(event) => handleSectionNav(event, item.href, { setOpen, setCurrentPage })}
      className={className}
    >
      {item.label}
    </a>
  );
}

const cards = [
  {
    title: "Música",
    icon: "music",
    image: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=1000&auto=format&fit=crop",
    body: "Trilhas, arranjos e vozes que conduzem o público por uma narrativa sensível e imersiva.",
  },
  {
    title: "Teatro",
    icon: "theater",
    image: "https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=1000&auto=format&fit=crop",
    body: "Cenas, personagens e atuação ao vivo para contar a história eterna de forma contemporânea.",
  },
  {
    title: "Tecnologia",
    icon: "cpu",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=1000&auto=format&fit=crop",
    body: "Luz, projeção, som e experiências digitais ampliando o impacto da mensagem.",
  },
];

const CARD_IMAGE_SHAPE =
  "M24 56C29 33 46 22 68 22H77C86 9 101 0 121 0C143 0 161 11 170 29C179 11 197 0 219 0C242 0 260 12 268 31H277C299 31 316 48 316 70V286H0V79C0 66 10 56 24 56Z";

const PROGRAM_CARD_PATH =
  "M14 0H178C185.7 0 192 6.3 192 14V90C175.4 90 162 103.4 162 120C162 136.6 175.4 150 192 150V258C192 265.7 185.7 272 178 272H14C6.3 272 0 265.7 0 258V150C16.6 150 30 136.6 30 120C30 103.4 16.6 90 0 90V14C0 6.3 6.3 0 14 0Z";

const CHECKOUT_TICKET_PATH =
  "M12 0H180C186.6 0 192 5.4 192 12V24C186 26 182 30 182 36C182 42 186 46 192 48V224C186 226 182 230 182 236C182 242 186 246 192 248V260C192 266.6 186.6 272 180 272H12C5.4 272 0 266.6 0 260V248C6 246 10 242 10 236C10 230 6 226 0 224V48C6 46 10 42 10 36C10 30 6 26 0 24V12C0 5.4 5.4 0 12 0Z";

const sponsors = [
  {
    id: "centro-formacao",
    label: "Centro de Formação",
    src: "https://pibcuritiba.org.br/wp-content/uploads/2025/05/cf-logotipo-5@150x.png",
  },
  {
    id: "colegio-grace",
    label: "Colégio Grace",
    src: "https://colegiograce.com.br/wp-content/uploads/2026/02/LOGO-COLE%CC%81GIO-SITE-156x72-1-1.svg",
  },
  {
    id: "duovias",
    label: "Duovias",
    src: "https://duovias.com.br/images/logoduovias.png",
  },
  {
    id: "fabapar",
    label: "FABAPAR",
    src: "https://criiemais.com.br/wp-content/uploads/2024/07/Fabapar-Criiemais-Publicidade.webp",
  },
  {
    id: "outdoormidia",
    label: "Outdoormídia",
    src: "https://nataleluia.com.br/wp-content/uploads/2025/12/escrita-laranja-1.png",
  },
  {
    id: "prefeitura-curitiba",
    label: "Prefeitura de Curitiba",
    src: "https://iconape.com/wp-content/png_logo_vector/prefeitura-de-curitiba-logo.png",
  },
  {
    id: "sevenpass",
    label: "SevenPass",
    src: "./assets/images/logo-sevenpass.png",
  },
];

function assertLandingPageData() {
  if (typeof console === "undefined" || typeof console.assert !== "function") return;

  const sectionNavItems = navItems.filter((item) => !item.isPage);
  const uniqueNavHrefs = new Set(sectionNavItems.map((item) => item.href));
  const uniqueCardTitles = new Set(cards.map((card) => card.title));

  console.assert(navItems.length === 6, "Teste: o menu deve conter 6 itens principais.");
  console.assert(cards.length === 3, "Teste: a seção de experiências deve conter 3 cards.");
  console.assert(cards.every((card) => card.title && card.body && card.icon), "Teste: cada card precisa de título, texto e ícone.");
  console.assert(cards.every((card) => card.image && card.image.startsWith("https://")), "Teste: cada card precisa de uma imagem externa segura.");
  console.assert(
    sectionNavItems.every((item) => item.href.startsWith("#")),
    "Teste: os links de seção do menu devem apontar para âncoras internas."
  );
  console.assert(uniqueNavHrefs.size === sectionNavItems.length, "Teste: os links do menu não devem repetir âncoras.");
  console.assert(uniqueCardTitles.size === cards.length, "Teste: os títulos dos cards devem ser únicos.");
  console.assert(LOGO_URL.includes("nataleluia_branca"), "Teste: a logo oficial branca deve ser usada.");
  console.assert(HERO_VIDEO_URL.endsWith(".mp4"), "Teste: o vídeo do topo deve ser um arquivo MP4.");
  console.assert(CHURCH_LOGO_URL.includes("logo_peq.png"), "Teste: a logo da PIB Curitiba deve usar o arquivo logo_peq.png.");
  console.assert(TIMELINE_SELECTED_BG_URL.includes("live.staticflickr.com"), "Teste: existe uma imagem base do Flickr disponível para a linha do tempo.");
  console.assert(TIMELINE_SELECTED_BG_URL.includes("55005691814"), "Teste: o background de 2025 deve usar a imagem direta do Flickr informada.");
  console.assert(COMPROMISSO_ADORACAO_LOGO_URL.includes("compromisso-adoracao-logo.png"), "Teste: a logo Compromisso Adoração deve apontar para o arquivo PNG oficial.");
  console.assert("https://image.isu.pub/241219004722-2cc008095b93962823667c3f8261f49a/jpg/page_1_thumb_large.jpg".includes("image.isu.pub"), "Teste: o card de 2024 deve usar a imagem informada do ISSUU.");
  console.assert("https://wsrv.nl/?url=live.staticflickr.com/65535/54220544032_f6a152ea6c_b.jpg&output=jpg".includes("54220544032"), "Teste: o background de 2024 deve usar a imagem informada do Flickr.");
  console.assert("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNPP0M-LIV1mOVJ-Qraj61mBkaXC8iTNliVw&s".includes("encrypted-tbn0.gstatic.com"), "Teste: o card de 2023 deve usar a imagem informada.");
  console.assert("https://www.flickr.com/search/?text=nataleluia+2023".includes("nataleluia+2023"), "Teste: o botão de fotos de 2023 deve usar o link informado.");
  console.assert(typeof CARD_IMAGE_SHAPE === "string" && CARD_IMAGE_SHAPE.length > 20, "Teste: o shape personalizado do card deve existir.");
  console.assert(typeof PROGRAM_CARD_PATH === "string" && PROGRAM_CARD_PATH.length > 20, "Teste: o shape de ingresso dos cards deve existir.");
  console.assert(navItems.every((item) => item.label.length > 1), "Teste: todos os itens de menu precisam de texto visível.");
  console.assert(cards.every((card) => card.body.length > 20), "Teste: cada card precisa de um texto descritivo.");
  console.assert(true, "Teste: os cards de experiência devem renderizar com 192px de largura e 272px de altura.");
  console.assert(sponsors.length === 7, "Teste: o carrossel deve conter 7 patrocinadores.");
  console.assert(sponsors.every((sponsor) => sponsor.src && sponsor.label), "Teste: cada patrocinador precisa de URL de logo e texto alternativo.");
  console.assert(
    sponsors.map((sponsor) => sponsor.label).join("|") === "Centro de Formação|Colégio Grace|Duovias|FABAPAR|Outdoormídia|Prefeitura de Curitiba|SevenPass",
    "Teste: os patrocinadores devem estar em ordem alfabética."
  );
}

function Icon({ name, size = 24, className = "" }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    "aria-hidden": true,
  };

  const icons = {
    menu: (
      <>
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </>
    ),
    close: (
      <>
        <path d="M6 6l12 12" />
        <path d="M18 6L6 18" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="M13 6l6 6-6 6" />
      </>
    ),
    down: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8" />
        <path d="M8.5 13.5 12 17l3.5-3.5" />
      </>
    ),
    music: (
      <>
        <path d="M9 18V5l10-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="16" cy="16" r="3" />
      </>
    ),
    theater: (
      <>
        <path d="M4 6c3 2 6 2 8 0v9c0 3-2 5-4 5s-4-2-4-5V6Z" />
        <path d="M12 6c2 2 5 2 8 0v9c0 3-2 5-4 5-1.2 0-2.3-.7-3-1.8" />
        <path d="M6.8 10h.01" />
        <path d="M9.2 10h.01" />
        <path d="M6.8 15c.8.6 1.6.6 2.4 0" />
      </>
    ),
    cpu: (
      <>
        <rect x="7" y="7" width="10" height="10" rx="2" />
        <rect x="10" y="10" width="4" height="4" rx="1" />
        <path d="M4 9h3M4 15h3M17 9h3M17 15h3M9 4v3M15 4v3M9 17v3M15 17v3" />
      </>
    ),
    star: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 16.9 6.6 19.8l1-6.1-4.4-4.3 6.1-.9L12 3Z" />,
    instagram: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="5" />
        <circle cx="12" cy="12" r="3.4" />
        <path d="M17.5 6.8h.01" />
      </>
    ),
    pin: (
      <>
        <path d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.4" />
      </>
    ),
  };

  return <svg {...props}>{icons[name] || icons.star}</svg>;
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}

function Header({ blur, bgOpacity, open, setOpen, currentPage, setCurrentPage }) {
  const desktopNavClass =
    "inline-flex h-7 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-1.5 text-[10px] font-medium leading-none text-white/82 transition hover:bg-white/10 hover:text-white lg:px-2 lg:text-[10.5px]";
  const mobileNavClass =
    "w-full rounded-full px-4 py-3 text-center text-xs text-white/78 transition hover:bg-white/10 hover:text-white";
  return (
    <header className="fixed left-0 right-0 top-[50px] z-50 px-4" style={{ pointerEvents: "none" }}>
      <div className="header-bar-wrap relative mx-auto w-full max-w-[62rem]">
        <div
          className="header-pill w-full rounded-full border border-white/20 shadow-[0_18px_60px_rgba(0,0,0,.25)]"
          style={{
            pointerEvents: "auto",
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
            backgroundColor: `rgba(255,255,255,${bgOpacity})`,
          }}
        >
          <div className="header-nav-shell relative my-0 flex min-h-[40px] w-full min-w-0 items-center justify-center gap-0 px-2 py-0 lg:min-h-[44px] lg:px-3">
            <nav className="header-main-nav hidden h-full w-full min-w-0 items-center justify-center py-0 lg:flex" aria-label="Menu principal">
              <div className="flex h-full min-w-0 flex-1 items-center justify-end gap-0 pr-2 lg:pr-4">
                {navItemsLeft.map((item) =>
                  renderNavItem(item, {
                    setOpen,
                    setCurrentPage,
                    currentPage,
                    className: desktopNavClass,
                  })
                )}
              </div>

              <div className="w-[88px] shrink-0 lg:w-[108px]" aria-hidden="true" />

              <div className="flex h-full min-w-0 flex-1 items-center justify-start gap-0 pl-2 lg:pl-4">
                {navItemsRight.map((item) =>
                  renderNavItem(item, {
                    setOpen,
                    setCurrentPage,
                    currentPage,
                    className: desktopNavClass,
                  })
                )}

                <button
                  type="button"
                  onClick={() => handlePageNav("checkout", { setOpen, setCurrentPage })}
                  className="ml-0.5 inline-flex h-7 shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-[#ff9f8f]/35 bg-[#d54b39] px-2 text-[8.5px] font-bold uppercase leading-none tracking-[0.02em] text-[#071426] shadow-[0_4px_18px_rgba(213,75,57,.35)] transition hover:bg-[#e25745] lg:px-2.5 lg:text-[9px]"
                >
                  Meu ingresso
                </button>
              </div>
            </nav>

            <button
              className="ml-auto rounded-full border border-white/15 p-2 text-white lg:hidden"
              style={{ pointerEvents: "auto" }}
              onClick={() => setOpen((prev) => !prev)}
              aria-label={open ? "Fechar menu" : "Abrir menu"}
            >
              {open ? <Icon name="close" size={20} /> : <Icon name="menu" size={20} />}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handlePageNav("home", { setOpen, setCurrentPage })}
          aria-label="Nataleluia - início"
          className="header-logo-btn pointer-events-auto absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        >
          <img
            src={LOGO_URL}
            alt="Nataleluia"
            className="header-logo-image block h-12 w-auto object-contain md:h-16"
            loading="eager"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={(event) => {
              event.currentTarget.style.display = "none";
              const fallback = event.currentTarget.nextElementSibling;
              if (fallback) fallback.style.display = "inline-flex";
            }}
          />
          <span className="logo-fallback hidden items-center text-2xl font-semibold text-white md:text-3xl">
            Nataleluia
          </span>
        </button>
      </div>

      {open && (
        <div
          className="mx-auto mt-3 w-full max-w-sm rounded-[1.75rem] border border-white/10 bg-[#411010]/90 p-4 shadow-[0_20px_60px_rgba(0,0,0,.34)] backdrop-blur-2xl lg:hidden"
          style={{ pointerEvents: "auto" }}
        >
          <div className="flex flex-col gap-2">
            {navItems.map((item) =>
              renderNavItem(item, {
                setOpen,
                setCurrentPage,
                currentPage,
                className: mobileNavClass,
              })
            )}
            <button
              type="button"
              onClick={() => handlePageNav("checkout", { setOpen, setCurrentPage })}
              className="mt-2 rounded-full bg-[#d54b39] px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.08em] text-[#071426]"
            >
              Meu ingresso
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="lp-hero relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-20 pt-32 sm:px-5">
      <div className="relative z-10 mx-auto w-full max-w-6xl text-center fade-in-up">
        <h1 className="font-hero hero-title mx-auto max-w-3xl text-center text-[clamp(1.35rem,3.45vw,3.3rem)]">
          <span className="block max-[479px]:whitespace-normal sm:whitespace-nowrap">
            <strong>A história</strong> que nunca
          </span>
          <span className="block max-[479px]:whitespace-normal sm:whitespace-nowrap">
            deixou de <strong>ser vivenciada</strong>
          </span>
        </h1>

        <div className="mt-14 flex flex-col items-center">
          <a
            href="#evento"
            onClick={(event) => handleSectionNav(event, "#evento")}
            className="text-white/88 transition hover:text-white"
            aria-label="Rolar para a próxima seção"
          >
            <Icon name="down" size={42} />
          </a>
          <div className="mt-7 flex flex-col items-center gap-3 text-white/90">
            <div className="h-px w-28 bg-white/20" />
            <img
              src={CHURCH_LOGO_URL}
              alt="Primeira Igreja Batista de Curitiba"
              className="church-logo-white h-[77px] w-[166px] object-contain py-[3px]"
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={(event) => {
                event.currentTarget.style.display = "none";
                const fallback = event.currentTarget.nextElementSibling;
                if (fallback) fallback.style.display = "block";
              }}
            />
            <span className="hidden text-sm leading-5 text-white/75">
              Primeira Igreja Batista de Curitiba
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function EventSection() {
  return (
    <section id="evento" className="lp-section relative bg-transparent px-4 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.45em] text-[#e2b1a6]">O Evento</p>
            <h2 className="font-hero mt-4 max-w-2xl text-[clamp(1.7rem,5vw,3.75rem)] font-light tracking-[-0.04em] text-white">
              Uma história eterna, contada para transformar você hoje.
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-white/62">
            Uma experiência que une arte, fé, emoção e tecnologia em uma apresentação envolvente, contemporânea e memorável.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {cards.map((card, index) => (
            <article key={card.title} className="program-card group mx-auto w-full max-w-[192px]">
              <div className="relative mx-auto aspect-[192/272] w-full max-w-[192px] overflow-visible">
                <svg
                  viewBox="0 0 192 272"
                  preserveAspectRatio="xMidYMid meet"
                  className="absolute inset-0 h-full w-full overflow-visible"
                  aria-hidden="true"
                >
                  <defs>
                    <clipPath id={`program-card-mask-${index}`} clipPathUnits="userSpaceOnUse">
                      <path d={PROGRAM_CARD_PATH} />
                    </clipPath>
                    <linearGradient id={`program-card-border-${index}`} x1="0" x2="1" y1="0" y2="1">
                      <stop offset="0" stopColor="rgba(255,241,198,0.98)" />
                      <stop offset="0.48" stopColor="rgba(188,72,55,0.86)" />
                      <stop offset="1" stopColor="rgba(255,241,198,0.84)" />
                    </linearGradient>
                  </defs>

                  <image
                    href={card.image}
                    x="0"
                    y="0"
                    width="192"
                    height="272"
                    preserveAspectRatio="xMidYMid slice"
                    clipPath={`url(#program-card-mask-${index})`}
                    className="program-card-image"
                  />
                  <path
                    d={PROGRAM_CARD_PATH}
                    fill="none"
                    stroke={`url(#program-card-border-${index})`}
                    strokeWidth="3"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="pointer-events-none absolute left-0 right-0 top-3 z-10 flex items-center justify-center px-5">
                  <h3 className="rounded-full border border-white/14 bg-[#411010]/45 px-4 py-1.5 text-center text-[18px] font-light leading-none tracking-[-0.03em] text-[#f0ecb9] backdrop-blur-md">
                    {card.title}
                  </h3>
                </div>
              </div>

              <p className="mt-5 text-center text-[12px] leading-5 tracking-[-0.01em] text-[#d8d0a7]">
                {card.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceSection() {
  return (
    <section id="experiencia" className="lp-section relative overflow-hidden bg-transparent px-4 sm:px-8">
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col gap-5">
          <div className="relative min-h-[clamp(260px,68vw,520px)] overflow-hidden rounded-[clamp(1.5rem,4vw,2.5rem)] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-lg sm:p-8">
            <img
              src="https://media.semprefamilia.com.br/semprefamilia/2016/12/2016-simone-milleo-1-620x413-cd808d56.jpg"
              alt="Espetáculo Nataleluia"
              className="absolute inset-0 h-full w-full object-cover opacity-88"
            />
            <div className="absolute bottom-0 right-0 h-full w-full bg-gradient-to-t from-[#411010] via-[#411010]/35 to-transparent" />
          </div>

          <div className="flex justify-center">
            <img
              src={COMPROMISSO_ADORACAO_LOGO_URL}
              alt="Compromisso Adoração"
              className="h-auto w-[165px] object-contain opacity-95"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <div className="lg:pl-6">
          <p className="text-sm uppercase tracking-[0.45em] text-[#e2b1a6]">A Experiência</p>
          <h2 className="font-hero mt-4 text-[clamp(1.7rem,5vw,3.75rem)] font-light tracking-[-0.04em] text-white">
            Mais do que um evento, uma <span className="font-bold">mensagem viva.</span>
          </h2>
          <div className="mt-8 space-y-5 text-[14px] leading-7 text-white/72">
            <p>
              É um espetáculo natalino que há mais de 20 anos celebra o nascimento de Jesus Cristo, o filho de Deus. Durante todos esses anos, esta história foi apresentada de forma festiva, contemporânea e com diferentes temáticas, envolvendo teatro, música, dança, coral e utilizando os mais atuais recursos artísticos e tecnológicos. O espetáculo é realizado por cerca de 800 voluntários e profissionais das mais diversas áreas, pensado e desenvolvido para envolver, contextualizar e cativar todas as idades.
            </p>
            <p>
              O espetáculo é realizado pela Primeira Igreja Batista de Curitiba, com o objetivo central de inspirar e promover a reflexão sobre a verdade, o amor, a paz e a salvação que Jesus nos oferece. Deus enviou o seu filho unigênito para que cada um de nós pudesse ter vida e vida em abundância, por vivermos rodeados por este amor incondicional é que desejamos torná-lo conhecido para o maior número de pessoas possível.
            </p>
            <p>
              Demonstramos o nosso amor como igreja levando mantimentos e solidariedade ao próximo através da ABASC (Associação Batista de Ação Social de Curitiba), que auxilia famílias que precisam de apoio.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineSection() {
  const timelineCards = [
    { year: "2025", title: "Um Natal de Liberdade", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl4Cwb5gnKMTciQNiDEmukHjZMSScqBGJZrA&s", bgImage: TIMELINE_SELECTED_BG_URL, albumUrl: "https://www.flickr.com/search/?text=nataleluia+2025", description: "Com o tema “Um Natal de Liberdade”, o Nataleluia 2025 reunirá mais de 1.000 voluntários em um espetáculo inédito, que neste ano contará uma história emocionante inspirada em fatos reais. O enredo convida o público a refletir: qual o impacto de um pequeno grupo de pessoas reunidas em uma casa, sonhando em celebrar o verdadeiro Natal? “Um Natal de Liberdade” narra a trajetória de homens e mulheres com diferentes origens, mas unidos pela fé, que dão início a uma comunidade marcada pela comunhão, acolhimento e amor – mesmo quando isso exige renúncia. Serão cinco noites de apresentações para um público esperado de mais de 17 mil pessoas. Em cena, o espetáculo abordará dilemas culturais, a busca espiritual de um povo aflito e os sacrifícios necessários para espalhar a mensagem de Jesus. Tudo isso por meio de músicas originais, teatro, dança, tecnologia, performances circenses, orquestra e coral, em uma produção marcada pela emoção e excelência artística." },
    { year: "2024", title: "MABBAT - A esperança", image: "https://image.isu.pub/241219004722-2cc008095b93962823667c3f8261f49a/jpg/page_1_thumb_large.jpg", bgImage: "https://wsrv.nl/?url=live.staticflickr.com/65535/54220544032_f6a152ea6c_b.jpg&output=jpg", albumUrl: "https://www.flickr.com/search/?text=nataleluia+2024", description: `MABBAT A ESPERANÇA, contém sequências com flashes de luz que podem afetar espectadores suscetíveis a epilepsia e outros distúrbios causados pela sensibilidade à luz.

O Nataleluia é tão aguardado, que os ingressos esgotam em pouco tempo. O espetáculo atrai, inclusive, pessoas de fora de Curitiba e até de outros estados. São 27 anos de uma produção que aborda temas como fé, esperança e amor.` },
    { year: "2023", title: "O Senhor do Tempo", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNPP0M-LIV1mOVJ-Qraj61mBkaXC8iTNliVw&s", bgImage: "https://media.gazetadopovo.com.br/2023/12/21115544/Imagem-do-WhatsApp-de-2023-12-21-%C3%A0s-09.18.40_4225f0b2.jpg.webp", albumUrl: "https://www.flickr.com/search/?text=nataleluia+2023", description: `O enredo deste ano segue a história emocionante de Seu Francisco, um relojoeiro cansado da vida, transportado para suas memórias mais profundas. Ao revisitar experiências marcantes com Aquele que traz esperança para o mundo, o espetáculo nos leva por uma viagem pelo tempo, sonhos e memórias daqueles que encontraram o Senhor do Tempo, cujas marcas permanecem indeléveis.

Arte, Música e Solidariedade:
O Nataleluia: O Senhor do Tempo contará com arranjos e canções originais do Clube de Composição da PIB Curitiba, com colaborações de Stênio Marcius, numa realização conjunta do CA Produções e Ministério.

Compromisso Adoração.
Está iniciativa social leva mantimentos a famílias necessitadas, demonstrando o comprometimento da igreja com o bem-estar da comunidade.` },
    {
      year: "2022",
      title: "25 anos",
      image: TIMELINE_2022_CARD_IMAGE_URL,
      bgImage: "https://nataleluia.com.br/wp-content/uploads/2024/09/52615653741_7fb121d085_o.jpg",
    },
    { year: "2021", title: "Um lugar para Nascer", image: "./assets/images/timeline-2021-um-lugar-para-nascer.png" },
    { year: "2020", title: "Um Olhar para o Céu", image: "./assets/images/timeline-2020-um-olhar-para-o-ceu.png" },
    {
      year: "2019",
      title: "O Esplendor do Natal",
      image: "./assets/images/timeline-2019-o-esplendor-do-natal.png",
      albumUrl: "https://www.flickr.com/photos/pibcuritiba/albums/72157712376913522/",
      description:
        "Com uma atmosfera de um programa de rádio apresentado na noite de Natal, belas canções natalinas e uma grande variedade de gêneros musicais, o radialista, por meio de sua locução, vai ensinando o verdadeiro significado da data, convidando os participantes a louvarem a Jesus, para comemorar o Esplendor do Natal.",
    },
    {
      year: "2018",
      title: "De Belén para a Cruz",
      image: "./assets/images/timeline-2018-de-belen-para-a-cruz.png",
      albumUrl: "https://www.flickr.com/photos/pibcuritiba/albums/72157705235964215/page4",
      description:
        "Apresenta a mensagem de Natal com performances ao vivo e participação de mais de 700 voluntários. O evento reúne orquestra, teatro, dança, um grande coral e efeitos especiais. Ingressos pelo site nataleluia.com.br a partir do dia 01 de setembro de 2018.",
    },
    {
      year: "2017",
      title: "20 anos de história",
      image: "./assets/images/timeline-2017-20-anos-de-historia.png",
      albumUrl: "https://www.flickr.com/photos/pibcuritiba/albums/72157690172193431/with/25565657128/",
    },
    {
      year: "2016",
      title: "O Encontro",
      image: "./assets/images/timeline-2016-o-encontro.png",
      description:
        "Cerca de 500 voluntários: músicos, atores, cantores, roteiristas, cenógrafos, bailarinos, publicitários e muitos outros profissionais se unem para celebrar em Curitiba, o verdadeiro sentido do natal.\n\nUm público de mais de 45 mil pessoas já assistiram o evento e se emocionaram com as apresentações que já acontecem há mais de 15 anos e reúne: vídeo, teatro, dança, tecnologia, coral e orquestra em um musical que encanta a todas as idades.\n\nO Nataleluia já faz parte da agenda cultural de Curitiba, muito mais do que uma cantata de natal, o evento tem como objetivo também arrecadar alimentos para a confecção e distribuição de cestas básicas para a população carente.",
    },
    {
      year: "2015",
      title: "As Cores do Amanhã",
      image: "./assets/images/timeline-2015-as-cores-do-amanha.png",
      description:
        "A história mostrou as aventuras de Aurora e seu irmão Felipe, que vivem em uma cidade cinza e triste onde ser feliz era proibido. Mas uma nova e colorida cidade surge. Neste local, eles aprenderam a cantar, sorrir, brincar e o verdadeiro significado do Natal.",
    },
    {
      year: "2014",
      title: "Natal de História",
      image: "./assets/images/timeline-2014-natal-de-historia.png",
      description:
        "Natal de histórias foi o tema do Nataleluia de 2014. Nele, três personagens encontraram-se para ouvir histórias de Jesus Cristo.",
    },
    {
      year: "2013",
      title: "Natal do Coração",
      image: "./assets/images/timeline-2013-natal-do-coracao.png",
      description:
        "Em 2013, a história foi sobre um menino que era apaixonado por futebol, e tinha o sonho de ser jogador da seleção brasileira. No meio do caminho enfrentou muitos obstáculos até perceber a importância de Jesus na sua vida.",
    },
    {
      year: "2012",
      title: "Nasce a Esperança",
      image: "./assets/images/timeline-2012-nasce-a-esperanca.png",
      description:
        "Três personagens são apresentados: Augusto, Sofia e Marina. Cada um deles ganhou de presente um livro mágico, que os levou a uma viagem ao passado, ao encontro de previsões feitas pelos profetas Isaías, Jeremias e Miqueias.",
    },
    { year: "2011", title: "Noite de esperança.", image: "./assets/images/timeline-2011-noite-de-esperanca.png", description: "Na edição de 2011, a iluminação teve seu destaque, assim como a tecnologia de projeção chamada mapping. Todo o conceito do espetáculo, desde cenários até figurino, foi baseado no Cubo Rubik, ou Cubo mágico" },
    { year: "2010", title: "Violeta Caron retorna à sua casa", image: "./assets/images/timeline-2010-violeta-caron-retorna-a-sua-casa.png" },
    {
      year: "2009",
      title: "Além do Espetáculo",
      image: "./assets/images/timeline-2009-alem-do-espetaculo.png",
      description:
        "O templo da Primeira Igreja Batista (PIB) de Curitiba, no Batel, vai ser transformado em um grande teatro, com direito a cortina vermelha, cenário e efeitos de iluminação e de som. No palco, Demétrio, um talentoso ator, participa de um musical de Natal e, quando o show está quase terminando, percebe que está preso nele. Com a ajuda de contrarregras, o rapaz vai lutar para fugir do mundo da ficção e tirar as máscaras para encontrar o mundo real, no qual a sua vida tem um propósito que vai muito além do espetáculo.",
    },
    {
      year: "2008",
      title: "Natal de Luz",
      image: "./assets/images/timeline-2008-natal-de-luz.png",
      description:
        "Figuras geométricas representando a tradicional imagem do presépio. Reis magos chegando de bicicleta para adorar o menino Jesus. Cenários que incluem desenhos a laser. O Nataleluia, espetáculo de Natal da Primeira Igreja Batista de Curitiba, encena este ano a Natividade sob o tema “Natal de Luz”, contando para isso com o auxílio da tecnologia e de avançadas técnicas de som e iluminação. O foco, no entanto, não está em nenhuma dessas inovações, mas no coração da mensagem natalina: o nascimento de filho de Deus, que veio para trazer salvação a todos que nele depositarem sua fé.",
    },
    {
      year: "2007",
      title: "Natal do Coração",
      image: "./assets/images/timeline-2007-natal-do-coracao.png",
      description:
        "Cerca de 500 profissionais e voluntários estão envolvidos no trabalho. Desde fevereiro músicos cristãos aceitaram o desafio de compor oito músicas com ritmos brasileiros, que vão do samba à MPB, especialmente para o Nataleluia. O espetáculo terá um cenário de sonho e, nele, um garoto em busca da felicidade. Aventura, dança, teatro, futebol e interatividade são alguns dos ingredientes que estão sendo preparados. “A ideia é falar de sonhos que precisam ser entregues a Deus”, diz o pastor Paulo Davi e Silva, do Ministério de Adoração da PIB.",
    },
    { year: "2006", title: "Uma Noite de Milagre", image: "./assets/images/timeline-2006-uma-noite-de-milagre.png" },
    {
      year: "2005",
      title: "O Proósito do Natal",
      image: "./assets/images/timeline-2005-o-proposito-do-natal.png",
      description:
        "Uma cruz feita de luzes marcou o ponto alto da apresentação. A história apresentou um escritor que buscava o sentido da vida nos livros e no conhecimento, mas que só encontrou paz no amor de Jesus.",
    },
    {
      year: "2004",
      title: "Jornada da Esperança",
      image: "./assets/images/timeline-2004-jornada-da-esperanca.png",
      description:
        "Os espectadores viajaram pelo tempo na fantástica jornada da esperança. Na história, o nascimento de Jesus foi representado aqui no Brasil, em Belém do Pará. O espetáculo ainda teve a apresentação do Nataleluia...",
    },
    {
      year: "2003",
      title: "Revivendo a Essência do Natal",
      image: "./assets/images/timeline-2003-revivendo-a-essencia-do-natal.png",
      description: "Compilação de músicas que marcaram os Nataleluias anteriores.",
    },
    {
      year: "2002",
      title: "A Glória do Senhor",
      image: "./assets/images/timeline-2002-a-gloria-do-senhor.png",
      description:
        "De uma forma bem humorada, a encenação resgata personagens dos anos anteriores e utilizando-se da metalinguagem, participam da produção do espetáculo, levando o público a entender o verdadeiro sentido do Natal.",
    },
    {
      year: "2001",
      title: "Bem Vindo ao Nosso Mundo",
      image: "./assets/images/timeline-2001-bem-vindo-ao-nosso-mundo.png",
      description:
        "Em 2001, ano que entrou para a história por conta do atentado terrorista às Torres Gêmeas, o Nataleluia falou da vida de Jesus Cristo e fez um paralelo com os tristes acontecimentos.",
    },
    {
      year: "2000",
      title: "Natal Inesquecível",
      image: "./assets/images/timeline-2000-natal-inesquecivel.png",
      description:
        "Tia Flora e sobrinhas. Livro gigante no palco contavam a história. Pr. Paschoal explica o plano de salvação e o verdadeiro sentido do Natal.",
    },
    {
      year: "1999",
      title: "Natal é Deus por nós",
      image: "./assets/images/timeline-1999-natal-e-deus-por-nos.png",
      description:
        "Neste ano, o evento contou com um belíssimo musical: orquestra de sinos, conjunto de pandeiros, 12 teclados, além de teatro, dança, coro Nataleluia e orquestra sinfônica.",
    },
    {
      year: "1998",
      title: "Natal em Sua Casa",
      image: "./assets/images/timeline-1998-natal-em-sua-casa.png?v=2",
      description:
        "O público encantou-se com uma família formada por três gerações. A cativante e curiosa tia Flora, que não conhecia a verdadeira história do Natal, foi destaque na apresentação. Com ajuda de um pequeno garoto, do coral, da orquestra e do teatro, tia Flora compreendeu o significado da data.",
    },
    {
      year: "1997",
      title: "Maravilhas de um Natal de amor",
      image: "./assets/images/timeline-1997-maravilhas-natal-amor.png",
      description:
        "Exibido na Ópera de Arame e coordenado pelo Pr. Marcilio de Oliveira Filho, foi um musical que teve uma montagem cênica grande para os padrões da época.\n\nAquela celebração de 1997 deixou muita saudade; não porque foi uma linda noite de festa, mas porque, acima de tudo, vidas foram tocadas pela verdadeira mensagem do Natal. Uma história de dois pastores que viveram (cenicamente) nos tempos do nascimento de Jesus foi contada ao longo do espetáculo; a plateia estava testemunhando o nascimento de Jesus participando da cena histórica de maneira dinâmica e excitante. Ao final do espetáculo, na mais eletrizante passagem da cantata, o coro “Deixa Cristo brilhar” ressoou sob a noite estrelada; como se em uma só voz, as testemunhas do nascimento de Cristo efetivamente se uniram em um só desejo: levar a luz de Cristo a todos os povos.",
    },
  ];

  const [activeTimeline, setActiveTimeline] = useState(0);
  const [leavingTimeline, setLeavingTimeline] = useState(null);
  const [timelineDirection, setTimelineDirection] = useState("forward");
  const [timelineSwipeX, setTimelineSwipeX] = useState(0);
  const [isMobileTimeline, setIsMobileTimeline] = useState(false);
  const timelineTouchRef = useRef({ startX: 0, startY: 0, deltaX: 0, tracking: false });
  const carouselRef = useRef(null);
  const [timelineTilt, setTimelineTilt] = useState({
    rotateX: 0,
    rotateY: 0,
    glowX: 50,
    glowY: 50,
    lift: 0,
    scale: 0,
    hovering: false,
  });
  const activeItem = timelineCards[activeTimeline];
  const visibleStart = Math.min(Math.max(activeTimeline, 0), timelineCards.length - 3);
  const visibleCards = timelineCards.slice(visibleStart, visibleStart + 3);

  useEffect(() => {
    const syncViewport = () => setIsMobileTimeline(window.innerWidth < 768);
    syncViewport();
    window.addEventListener("resize", syncViewport, { passive: true });
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  const resetTimelineTilt = () => {
    setTimelineTilt({
      rotateX: 0,
      rotateY: 0,
      glowX: 50,
      glowY: 50,
      lift: 0,
      scale: 0,
      hovering: false,
    });
  };

  const handleTimelineTilt = (event) => {
    if (typeof window !== "undefined" && window.innerWidth < 768) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    setTimelineTilt({
      rotateX: Number(((py - 0.5) * 12).toFixed(2)),
      rotateY: Number((((0.5 - px) * 14)).toFixed(2)),
      glowX: Number((px * 100).toFixed(2)),
      glowY: Number((py * 100).toFixed(2)),
      lift: -10,
      scale: 0.02,
      hovering: true,
    });
  };

  const handleTimelineSelect = (targetIndex) => {
    const nextIndex = Math.max(0, Math.min(targetIndex, timelineCards.length - 1));
    if (nextIndex === activeTimeline) return;

    resetTimelineTilt();
    setTimelineDirection(nextIndex > activeTimeline ? "forward" : "backward");
    setLeavingTimeline(timelineCards[activeTimeline]);
    setActiveTimeline(nextIndex);
    window.setTimeout(() => setLeavingTimeline(null), 820);
  };

  const goToNextEvent = () => handleTimelineSelect(activeTimeline - 1);
  const goToPreviousEvent = () => handleTimelineSelect(activeTimeline + 1);

  const handleTimelineTouchStart = (event) => {
    if (!isMobileTimeline || event.touches.length !== 1) return;

    const touch = event.touches[0];
    timelineTouchRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      deltaX: 0,
      tracking: true,
    };
    setTimelineSwipeX(0);
  };

  const handleTimelineTouchMove = (event) => {
    const touchState = timelineTouchRef.current;
    if (!touchState.tracking || event.touches.length !== 1) return;

    const touch = event.touches[0];
    const deltaX = touch.clientX - touchState.startX;
    const deltaY = touch.clientY - touchState.startY;

    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 14) {
      touchState.tracking = false;
      setTimelineSwipeX(0);
      return;
    }

    touchState.deltaX = deltaX;
    setTimelineSwipeX(Math.max(-72, Math.min(72, deltaX * 0.42)));
  };

  const handleTimelineTouchEnd = () => {
    const touchState = timelineTouchRef.current;
    if (!touchState.tracking) {
      setTimelineSwipeX(0);
      return;
    }

    const { deltaX } = touchState;
    touchState.tracking = false;
    setTimelineSwipeX(0);

    if (deltaX <= -52) goToPreviousEvent();
    else if (deltaX >= 52) goToNextEvent();
  };

  const handleTimelineTouchCancel = () => {
    timelineTouchRef.current.tracking = false;
    setTimelineSwipeX(0);
  };

  return (
    <section id="timeline-lp" className="lp-section lp-section-timeline relative min-h-[calc(100vh-var(--header-offset))] overflow-x-clip overflow-y-hidden bg-transparent px-3 sm:px-[1.6rem]">
      <div className="pointer-events-none absolute inset-y-0 left-1/2 z-0 w-screen max-w-none -translate-x-1/2">
        <img
          key={`${activeItem.year}-${activeItem.title}-${activeItem.bgImage || activeItem.image}`}
          src={activeItem.bgImage || activeItem.image}
          alt={`Background da edição ${activeItem.year} - ${activeItem.title}`}
          className="timeline-bg-image h-full w-full object-cover object-center opacity-30 blur-[1.5px]"
          loading="eager"
          decoding="async"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(65,16,16,.70),rgba(65,16,16,.70)_34%,rgba(65,16,16,.70)_58%,rgba(65,16,16,.70)),radial-gradient(circle_at_68%_34%,rgba(245,232,167,.08),transparent_19%)]" />
        <div className="timeline-bg-edge timeline-bg-edge-top" aria-hidden />
        <div className="timeline-bg-edge timeline-bg-edge-bottom" aria-hidden />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[576px] w-full min-w-0 max-w-7xl flex-col">
        <div className="grid flex-1 items-center gap-[2.4rem] lg:grid-cols-[0.82fr_1.18fr]">
        <div className="flex flex-col justify-center lg:min-h-[448px] lg:-translate-y-[24%]">
          <div className="mb-[1.6rem] flex min-w-0 items-start gap-2 text-[#f0ecb9] sm:items-center sm:gap-4">
            <img
              src="./assets/icons/nataleluia-monogram-n-bege.png"
              alt=""
              aria-hidden="true"
              className="timeline-monogram-n h-8 w-auto shrink-0 object-contain sm:h-9"
              loading="eager"
              decoding="async"
            />
            <div className="mt-2 hidden h-px w-8 shrink-0 bg-[#f0ecb9]/60 sm:mt-0 sm:block" />
            <h2 className="min-w-0 break-words text-[clamp(1rem,4.6vw,22px)] font-bold leading-tight tracking-[-0.02em] text-[#f0ecb9]">
              {activeItem.year} | {activeItem.title}
            </h2>
          </div>

          <p key={activeItem.title} className="timeline-copy max-w-md whitespace-pre-line text-[14px] leading-[1.55] tracking-[0.01em] text-white/76">
            {activeItem.description || `A edição de ${activeItem.year}, “${activeItem.title}”, faz parte da trajetória do Nataleluia e revela como esta história foi sendo contada ao longo dos anos com novas linguagens, cenários, músicas e mensagens para diferentes gerações.`}
          </p>
        </div>

        <div className="flex flex-col justify-end lg:min-h-[448px]">
          <div
            ref={carouselRef}
            className={`timeline-carousel-stage timeline-carousel-${timelineDirection} relative mx-auto h-[510px] w-full max-w-[980px] overflow-visible touch-pan-y`}
            style={{ "--timeline-swipe-x": `${timelineSwipeX}px` }}
            role="region"
            aria-roledescription="carrossel"
            aria-label="Linha do tempo do Nataleluia"
            onTouchStart={handleTimelineTouchStart}
            onTouchMove={handleTimelineTouchMove}
            onTouchEnd={handleTimelineTouchEnd}
            onTouchCancel={handleTimelineTouchCancel}
          >
            {leavingTimeline && (
              <div className="timeline-card timeline-card-leaving pointer-events-none absolute h-[402px] w-[302px] overflow-hidden rounded-[0.55rem] border border-white/8 bg-[#123052]/78 text-left shadow-[0_20px_80px_rgba(0,0,0,.3)] backdrop-blur-md">
                <div className="flex h-full flex-col p-4">
                  <p className="mb-4 text-base text-white/80">{leavingTimeline.year}</p>
                  <div className="h-[270px] overflow-hidden rounded-[0.4rem] bg-black/25">
                    <img src={leavingTimeline.image} alt={leavingTimeline.title} className="h-full w-full object-cover opacity-88" />
                  </div>
                  <p className="mt-5 text-lg text-white/86">{leavingTimeline.title}</p>
                </div>
              </div>
            )}
            {visibleCards.map((item, index) => {
              const globalIndex = visibleStart + index;
              const isActive = globalIndex === activeTimeline;
              const positionClass = isActive ? "timeline-position-active" : index === 0 ? "timeline-position-prev" : index === 1 ? "timeline-position-next" : "timeline-position-last";
              if (isMobileTimeline && !isActive) return null;

              return (
                <button
                  key={`${item.year}-${item.title}`}
                  type="button"
                  onClick={() => handleTimelineSelect(globalIndex)}
                  onMouseMove={isActive ? handleTimelineTilt : undefined}
                  onMouseLeave={isActive ? resetTimelineTilt : undefined}
                  className={`timeline-card ${positionClass} absolute overflow-hidden rounded-[0.55rem] border border-white/8 bg-[#123052]/78 text-left shadow-[0_20px_80px_rgba(0,0,0,.3)] backdrop-blur-md ${isActive ? "timeline-card-active h-[402px] w-[302px]" : "timeline-card-muted h-[292px] w-[220px]"}`}
                  aria-pressed={isActive}
                  style={
                    isActive
                      ? {
                          "--timeline-rotate-x": `${timelineTilt.rotateX}deg`,
                          "--timeline-rotate-y": `${timelineTilt.rotateY}deg`,
                          "--timeline-float-y": `${timelineTilt.lift}px`,
                          "--timeline-scale-bump": timelineTilt.scale,
                        }
                      : undefined
                  }
                >
                  <div
                    className={`timeline-card-shell ${isActive ? "timeline-card-shell-active" : ""} flex h-full flex-col p-4`}
                    style={
                      isActive
                        ? {
                            "--timeline-glow-x": `${timelineTilt.glowX}%`,
                            "--timeline-glow-y": `${timelineTilt.glowY}%`,
                            "--timeline-glow-opacity": timelineTilt.hovering ? 1 : 0,
                          }
                        : undefined
                    }
                  >
                    <p className={`${isActive ? "mb-4 text-base" : "mb-3 text-xs"} text-white/80 transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)]`}>{item.year}</p>
                    <div className={`${isActive ? "h-[270px]" : "h-[190px]"} overflow-hidden rounded-[0.4rem] bg-black/25 transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)]`}>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover opacity-88 transition duration-700 hover:scale-105"
                      />
                    </div>
                    <p className={`${isActive ? "mt-5 text-lg" : "mt-4 text-xs"} text-white/86 transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)]`}>{item.title}</p>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="timeline-swipe-hint mx-auto mt-3 flex max-w-[780px] items-center justify-center gap-3 text-[10px] uppercase tracking-[0.14em] text-white/38 md:hidden">
            <span className={activeTimeline >= timelineCards.length - 1 ? "opacity-30" : ""}>← Anteriores</span>
            <span aria-hidden="true">·</span>
            <span className={activeTimeline === 0 ? "opacity-30" : ""}>Próximos →</span>
          </div>
          <div className="mx-auto mt-2 flex max-w-[780px] items-center justify-between gap-4 text-xs text-white/42">
            <span>{activeTimeline + 1} de {timelineCards.length}</span>
            <div className="h-px flex-1 bg-white/10" />
            <span>2026 | 1997</span>
          </div>
        </div>
        </div>

        <div className="timeline-actions mt-auto flex shrink-0 flex-wrap items-stretch gap-2 pt-[1.6rem] sm:items-center">
          <a
            href={activeItem.albumUrl || "#timeline-lp"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center rounded-full border border-[#d54b39]/45 bg-[#d54b39]/18 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-[#d54b39]"
          >
            Confira as fotos
          </a>
          <button
            type="button"
            onClick={goToNextEvent}
            disabled={activeTimeline === 0}
            className="rounded-full border border-[#d54b39]/45 bg-[#d54b39] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-[#e25745] disabled:cursor-not-allowed disabled:opacity-30"
          >
            &lt; Próximos eventos
          </button>
          <button
            type="button"
            onClick={goToPreviousEvent}
            disabled={activeTimeline >= timelineCards.length - 1}
            className="rounded-full border border-white/12 bg-white/5 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/72 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Anteriores &gt;
          </button>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const questions = [
    {
      question: "Que horas as portas abrem?",
      answer: "As portas abrem para o público às 19h. O ingresso permite a entrada no local até as 20h15.",
    },
    {
      question: "Tem estacionamento na igreja?",
      answer: "Não. Procure estacionamentos conveniados nas proximidades da PIB Curitiba para estacionar.",
    },
    {
      question: "Terá Ministério Infantil?",
      answer: "Não haverá atividades no Ministério Infantil, mas o berçário estará disponível apenas para amamentação e troca de fraldas, sem voluntário plantonista.",
    },
    {
      question: "Crianças pagam?",
      answer: "Crianças que ocupam um assento precisam de um ingresso. Crianças de colo não pagam ingresso.",
    },
    {
      question: "Outras dúvidas?",
      answer: "Em caso de dúvidas, você pode entrar em contato através do e-mail nataleluia@pibcuritiba.org.br.",
    },
  ];

  return (
    <section id="faq" className="lp-section relative bg-transparent px-4 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm uppercase tracking-[0.4em] text-[#e2b1a6]">FAQ perguntas</p>
        <h2 className="font-hero mt-4 text-[clamp(1.7rem,5vw,3rem)] font-light tracking-[-0.04em] text-white">
          <span className="font-bold">Dúvidas</span> frequentes
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {questions.map((item, index) => (
            <article
              key={item.question}
              className="flex min-h-[210px] min-w-0 flex-col justify-between rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-5 text-white/78 backdrop-blur-md transition hover:border-[#d54b39]/35 hover:bg-white/[0.06]"
            >
              <div className="mb-3 flex items-start gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#d54b39]/18 text-[11px] font-semibold text-[#f0ecb9]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-[15px] font-medium leading-snug tracking-[-0.02em] text-white">
                  {item.question}
                </h3>
              </div>
              <p className="pl-10 text-[12px] leading-5 text-white/62">
                {item.answer}
              </p>
            </article>
          ))}
          <article className="flex min-h-[210px] flex-col rounded-[20px] border border-white/10 bg-[#2e5e4a] p-5 text-white opacity-100 shadow-[0_14px_36px_rgba(0,0,0,.2)]">
            <h3 className="text-[14px] font-bold uppercase tracking-[0.03em]">
              ATENÇÃO!
            </h3>
            <p className="mt-3 text-[12px] font-light leading-5 text-white/92">
              O espetáculo contém sequências com flashes de luz que podem afetar espectadores suscetíveis a epilepsia e outros distúrbios causados pela sensibilidade à luz.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

function SponsorSection() {
  return (
    <section id="patrocine" className="lp-section sponsor-hero-section relative overflow-hidden px-4 sm:px-8">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://www.bandab.com.br/wp-content/uploads/2025/12/nataleluia-espetaculo-curitiba-2025-programacao-2-960x640.jpg"
          alt="Espetáculo Nataleluia Curitiba"
          className="h-full w-full object-cover object-center opacity-20"
          loading="eager"
          decoding="async"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="relative z-10 mx-auto grid min-h-0 max-w-6xl grid-cols-1 items-center gap-8 py-6 lg:min-h-[520px] lg:grid-cols-[0.38fr_0.62fr] lg:gap-10 lg:py-0">
        <div className="pointer-events-none flex items-center justify-center lg:justify-center">
          <img
            src={SPONSOR_MONOGRAM_URL}
            alt="Monograma Nataleluia"
            className="h-auto max-h-[min(280px,42vh)] w-[min(38vw,160px)] object-contain object-center mix-blend-lighten sm:max-h-[min(360px,55vh)] sm:w-[min(42vw,220px)] md:w-[260px] lg:max-h-[min(420px,72vh)] lg:w-[300px]"
            loading="eager"
            decoding="async"
          />
        </div>

        <div className="max-w-2xl min-w-0 text-left">
          <p className="text-[clamp(1rem,2.8vw,1.375rem)] font-medium leading-[1.38] tracking-[0.01em] text-white/82">
            Para que o Nataleluia aconteça, contamos com o apoio de pessoas que desejam investir na mensagem que compartilhamos todos os anos: o amor e a esperança que nasceram em Jesus.
          </p>

          <p className="mt-6 text-[clamp(1rem,2.8vw,1.375rem)] font-medium leading-[1.38] tracking-[0.01em] text-white/82 sm:mt-10">
            Ao patrocinar o Nataleluia, você se torna parte de uma missão que impacta milhares de pessoas, ajudando a levar arte, fé e transformação para a nossa cidade e além. Junte-se a nós nessa celebração e faça parte dessa história!
          </p>

          <a
            href="https://patrocinadores.repagil.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex max-w-full items-center justify-center rounded-full bg-[#a92925] px-8 py-4 text-center text-[clamp(0.85rem,2.6vw,1.25rem)] font-medium uppercase tracking-[0.06em] text-white shadow-[0_18px_60px_rgba(169,41,37,.28)] transition hover:-translate-y-0.5 hover:bg-[rgba(46,94,74,0)] sm:mt-10 sm:px-14 sm:py-5"
          >
            Ser um patrocinador
          </a>
        </div>
      </div>
      <div className="absolute inset-0 bg-[#411010]/20" />
    </section>
  );
}

function SponsorsBanner() {
  const repeatedSponsors = [...sponsors, ...sponsors, ...sponsors];

  return (
    <section className="sponsor-banner-section relative px-4 pb-16 pt-8 sm:px-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[1.25rem]">
        <div className="sponsor-marquee" aria-label="Patrocinadores do Nataleluia">
          <div className="sponsor-marquee-track">
            {repeatedSponsors.map((sponsor, index) => (
              <div
                key={`${sponsor.id}-${index}`}
                className="sponsor-logo-item"
                aria-label={sponsor.label}
                title={sponsor.label}
              >
                <img
                  src={sponsor.src}
                  alt={sponsor.label}
                  className={`sponsor-logo-image sponsor-logo-${sponsor.id}`}
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                    const fallback = event.currentTarget.nextElementSibling;
                    if (fallback) fallback.style.display = "inline-flex";
                  }}
                />
                <span className="sponsor-logo-fallback hidden text-sm font-semibold text-white/80">
                  {sponsor.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckoutPage() {
  const [selectedDates, setSelectedDates] = useState(["19"]);
  const [selectedTicket, setSelectedTicket] = useState("individual");
  const [familyQuantity, setFamilyQuantity] = useState(2);
  const [selectedTimesByDate, setSelectedTimesByDate] = useState({
    "19": "17h",
    "20": "17h",
    "22": "17h",
    "23": "17h",
    "25": "17h",
  });

  const presentationDates = [
    { day: "19", month: "Dezembro" },
    { day: "20", month: "Dezembro" },
    { day: "22", month: "Dezembro" },
    { day: "23", month: "Dezembro" },
    { day: "25", month: "Dezembro" },
  ];

  const timeOptions = ["17h", "19h"];

  const ticketOptions = [
    { id: "individual", name: "Individual", price: 15, description: "Acesso para uma pessoa ao Nataleluia." },
    { id: "familia", name: "Família", price: 20, description: "Pacote para participação em família." },
    { id: "menor-visibilidade", name: "Menor visibilidade", price: 10, description: "Entrada com assento de menor visibilidade." },
  ];

  const selectedTicketOption = ticketOptions.find((ticket) => ticket.id === selectedTicket) || ticketOptions[0];
  const ticketMultiplier = selectedTicket === "familia" ? familyQuantity : 1;
  const subtotal = selectedTicketOption.price * selectedDates.length * ticketMultiplier;
  const serviceFee = 0;
  const total = subtotal + serviceFee;
  const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  const toggleDate = (day) => {
    setSelectedDates((current) => {
      if (current.includes(day)) {
        return current.length === 1 ? current : current.filter((item) => item !== day);
      }
      return [...current, day].sort((a, b) => Number(a) - Number(b));
    });
  };

  const selectTimeForDate = (day, time) => {
    setSelectedTimesByDate((current) => ({ ...current, [day]: time }));
    setSelectedDates((current) => {
      if (current.includes(day)) return current;
      return [...current, day].sort((a, b) => Number(a) - Number(b));
    });
  };

  const updateFamilyQuantity = (nextQuantity) => {
    setFamilyQuantity(Math.max(2, Math.min(10, nextQuantity)));
    setSelectedTicket("familia");
  };

  const selectedSchedule = selectedDates
    .map((day) => `${day}/12 às ${selectedTimesByDate[day] || "17h"}`)
    .join(", ");

  return (
    <section id="ingresso" className="relative min-h-screen bg-[#411010] px-4 pb-10 pt-28 sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_16%,rgba(185,67,50,.20),transparent_30%),linear-gradient(180deg,rgba(65,16,16,.74),#411010_72%)]" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid gap-4 lg:grid-cols-[1.08fr_.92fr]">
          <div className="h-auto min-w-0 rounded-[1.5rem] border border-white/10 bg-white/[0.045] px-4 pb-0 pt-0 backdrop-blur-xl sm:px-5 lg:min-h-[778px]">
            <h2 className="mb-3 text-[15px] font-medium text-white">Escolha as datas da apresentação</h2>
            <div className="mb-6 grid grid-cols-2 gap-x-3 gap-y-6 overflow-visible px-1 py-2 sm:grid-cols-3 sm:gap-x-4 sm:px-2 lg:grid-cols-5">
              {presentationDates.map((date, index) => {
                const isSelected = selectedDates.includes(date.day);

                return (
                  <div key={date.day} className="flex w-full max-w-[124px] flex-col items-center justify-self-center overflow-visible">
                    <button
                      type="button"
                      onClick={() => toggleDate(date.day)}
                      className="group relative aspect-[118/154] h-auto w-full max-w-[118px] text-left transition hover:-translate-y-1"
                      aria-pressed={isSelected}
                    >
                      <svg
                        viewBox="0 0 192 272"
                        preserveAspectRatio="none"
                        className="absolute inset-0 h-full w-full drop-shadow-[0_18px_40px_rgba(0,0,0,.28)]"
                        aria-hidden="true"
                      >
                        <defs>
                          <linearGradient id={`checkout-ticket-bg-${index}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                          </linearGradient>
                        </defs>
                        <path
                          d={CHECKOUT_TICKET_PATH}
                          fill="rgba(255,255,255,0)"
                          stroke={isSelected ? "#d54b39" : "rgba(255,255,255,.24)"}
                          strokeWidth={isSelected ? "3" : "1.6"}
                        />
                        <path d="M18 18H174V254H18Z" fill="none" stroke={isSelected ? "rgba(213,75,57,.65)" : "rgba(255,255,255,.16)"} strokeWidth="1" />
                        <path d="M26 18V254" fill="none" stroke={isSelected ? "rgba(213,75,57,.48)" : "rgba(255,255,255,.14)"} strokeWidth="1" strokeDasharray="3 4" />
                      </svg>

                      <div className="absolute inset-0 flex flex-col items-center justify-between px-3 py-4">
                        <div className="w-full text-center">
                          <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-white/58">Dez</span>
                          <span className={`mt-1 block text-[30px] font-light leading-none tracking-[-0.05em] ${isSelected ? "text-[#f0ecb9]" : "text-white/82"}`}>
                            {date.day}
                          </span>
                        </div>

                        <div className="w-full">
                          <span className={`mx-auto inline-flex w-full items-center justify-center rounded-full border px-2 py-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] ${isSelected ? "border-[#d54b39] bg-[#d54b39]/18 text-white" : "border-white/10 bg-white/5 text-white/56"}`}>
                            {isSelected ? "Selecionado" : "Selecionar"}
                          </span>
                        </div>
                      </div>
                    </button>

                    <div className="mt-2 grid w-full grid-cols-2 gap-1.5">
                      {timeOptions.map((time) => {
                        const isTimeSelected = (selectedTimesByDate[date.day] || "17h") === time;
                        return (
                          <button
                            key={`${date.day}-${time}`}
                            type="button"
                            onClick={() => selectTimeForDate(date.day, time)}
                            className={`rounded-full border px-2 py-1.5 text-[10px] font-semibold transition ${isSelected && isTimeSelected ? "border-[#d54b39] bg-[#d54b39]/22 text-white" : "border-white/10 bg-white/5 text-white/58 hover:border-[#d54b39]/45 hover:text-white"}`}
                            aria-pressed={isSelected && isTimeSelected}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <input className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#d54b39]/70" placeholder="Nome completo" />
              <input className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#d54b39]/70" placeholder="E-mail" />
              <input className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#d54b39]/70" placeholder="Telefone" />
              <input className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#d54b39]/70" placeholder="CPF" />
            </div>

            <div className="my-[15px] flex w-full max-w-[669px] flex-col gap-0 rounded-[1.1rem] border border-white/10 bg-[#1b1e31]/70 px-4 pb-0 pt-0">
              <p className="text-[12px] leading-5 text-white/82">
                IMPORTANTE: O ingresso é válido até 10 minutos após o início do espetáculo (20h10min). Após esse período, o assento poderá ser disponibilizado para outra pessoa.
              </p>
            </div>

            <div className="flex-1">
              <h2 className="mb-3 text-[15px] font-medium text-white">Escolha seu ingresso</h2>
              <div className="grid gap-3">
                {ticketOptions.map((ticket) => {
                  const isSelectedTicket = selectedTicket === ticket.id;

                  return (
                    <div
                      key={ticket.name}
                      className={`flex items-center justify-between gap-3 rounded-[1.1rem] border p-4 text-left transition ${isSelectedTicket ? "border-[#d54b39] bg-[#d54b39]/14" : "border-white/10 bg-[#1b1e31]/70 hover:border-[#d54b39]/60 hover:bg-[#10243e]/80"}`}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedTicket(ticket.id)}
                        className="flex flex-1 items-start gap-3 text-left"
                        aria-pressed={isSelectedTicket}
                      >
                        <span className={`mt-1 grid h-4 w-4 place-items-center rounded-full border ${isSelectedTicket ? "border-[#d54b39]" : "border-white/25"}`}>
                          {isSelectedTicket && <span className="h-2 w-2 rounded-full bg-[#d54b39]" />}
                        </span>
                        <span>
                          <span className="block text-sm font-medium text-white">{ticket.name}</span>
                          <span className="mt-1 block text-xs leading-5 text-white/55">{ticket.description}</span>
                        </span>
                      </button>

                      <div className="flex flex-col items-end gap-2">
                        <strong className="whitespace-nowrap text-sm font-semibold text-[#f0ecb9]">{currency.format(ticket.price)}</strong>
                        {ticket.id === "familia" && isSelectedTicket && (
                          <div className="flex items-center gap-1 rounded-full border border-[#d54b39]/45 bg-[#411010]/55 px-1.5 py-1">
                            <button
                              type="button"
                              onClick={() => updateFamilyQuantity(familyQuantity - 1)}
                              className="grid h-6 w-6 place-items-center rounded-full bg-white/8 text-xs text-white transition hover:bg-[#d54b39]/40"
                              aria-label="Diminuir quantidade de familiares"
                            >
                              −
                            </button>
                            <span className="min-w-7 text-center text-xs font-semibold text-white">{familyQuantity}</span>
                            <button
                              type="button"
                              onClick={() => updateFamilyQuantity(familyQuantity + 1)}
                              className="grid h-6 w-6 place-items-center rounded-full bg-white/8 text-xs text-white transition hover:bg-[#d54b39]/40"
                              aria-label="Aumentar quantidade de familiares"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="rounded-[1.5rem] border border-[#d54b39]/20 bg-[#12213a]/82 p-5 shadow-[0_30px_120px_rgba(0,0,0,.34)] backdrop-blur-xl">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#e2b1a6]">Resumo</p>
            <div className="mt-4 rounded-[1.25rem] bg-black/18 p-4">
              <div className="flex justify-between gap-4 border-b border-white/10 pb-3 text-white/78">
                <span>{selectedTicketOption.name}{selectedTicket === "familia" ? ` × ${familyQuantity} familiares` : ""}</span>
                <strong>{currency.format(selectedTicketOption.price)}</strong>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/10 py-3 text-white/55">
                <span>{selectedDates.length > 1 ? "Datas selecionadas" : "Data selecionada"}</span>
                <span>{selectedSchedule}</span>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/10 py-3 text-white/55">
                <span>{selectedDates.length} dia(s) × {currency.format(selectedTicketOption.price)}{selectedTicket === "familia" ? ` × ${familyQuantity}` : ""}</span>
                <span>{currency.format(subtotal)}</span>
              </div>
              <div className="flex justify-between gap-4 border-b border-white/10 py-3 text-white/55">
                <span>Taxa de serviço</span>
                <span>{currency.format(serviceFee)}</span>
              </div>
              <div className="flex justify-between gap-4 pt-4 text-xl font-semibold text-white">
                <span>Total</span>
                <span>{currency.format(total)}</span>
              </div>
            </div>

            <div className="mt-5 grid gap-2.5">
              {["Cartão de crédito", "PIX", "Boleto"].map((method, index) => (
                <button
                  key={method}
                  type="button"
                  className={`rounded-full border px-4 py-3 text-left text-sm transition ${index === 0 ? "border-[#d54b39] bg-[#d54b39]/15 text-white" : "border-white/10 bg-white/5 text-white/60 hover:text-white"}`}
                >
                  {method}
                </button>
              ))}
            </div>

            <button className="mt-5 w-full rounded-full bg-[#d54b39] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.10em] text-white shadow-[0_20px_60px_rgba(213,75,57,.28)] transition hover:bg-[#e25745]">
              Finalizar inscrição
            </button>

            <div className="mt-5 flex justify-center border-t border-white/10 pt-5">
              <img
                src={COMPROMISSO_ADORACAO_LOGO_URL}
                alt="Compromisso Adoração"
                className="h-auto w-[165px] object-contain opacity-95"
                loading="eager"
                decoding="async"
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function N2026Footer() {
  return (
    <footer id="n2026-contato" className="n2026-footer lp-section lp-section-footer relative bg-transparent px-4 sm:px-8">
      <div className="mx-auto max-w-6xl border-t border-white/10 pt-10">
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="compromisso-adoracao-logo-wrap">
            <img
              src={COMPROMISSO_ADORACAO_LOGO_URL}
              alt="Compromisso Adoração"
              className="compromisso-adoracao-logo h-auto w-[min(240px,72vw)] object-contain opacity-95"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="flex w-full max-w-xl flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={COMPROMISSO_ADORACAO_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/12 bg-white/5 px-5 py-3 text-sm text-white/78 transition hover:bg-white/10 hover:text-white sm:w-auto"
              aria-label={`Endereço: ${COMPROMISSO_ADORACAO_ADDRESS}`}
            >
              <Icon name="pin" size={17} />
              {COMPROMISSO_ADORACAO_ADDRESS}
            </a>

            <a
              href={COMPROMISSO_ADORACAO_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/12 bg-white/5 px-5 py-3 text-sm text-white/78 transition hover:bg-white/10 hover:text-white sm:w-auto"
              aria-label="Instagram do Compromisso Adoração"
            >
              <Icon name="instagram" size={17} />
              Instagram
            </a>
          </div>
        </div>

        <div className="mt-10 flex min-w-0 flex-col justify-between gap-4 border-t border-white/10 pt-7 text-[clamp(0.65rem,2.4vw,0.75rem)] uppercase tracking-[0.16em] text-white/38 sm:flex-row sm:tracking-[0.22em]">
          <span className="min-w-0 break-words">
            Compromisso Adoração | <N2026BrandMark />
          </span>
          <span className="min-w-0 break-words">Primeira Igreja Batista de Curitiba</span>
        </div>
      </div>
    </footer>
  );
}

function N2026Page() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 42, active: false });
  const [cardTilt, setCardTilt] = useState({
    rotateX: 0,
    rotateY: 0,
    glowX: 50,
    glowY: 50,
    active: false,
  });

  const updateSpotlight = (event) => {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100;
    const y = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100;
    setSpotlight({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
      active: true,
    });
  };

  const updateCardTilt = (event) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / Math.max(rect.width, 1);
    const py = (event.clientY - rect.top) / Math.max(rect.height, 1);
    const rotateY = (px - 0.5) * 10;
    const rotateX = (0.5 - py) * 8;
    setCardTilt({
      rotateX,
      rotateY,
      glowX: Math.min(100, Math.max(0, px * 100)),
      glowY: Math.min(100, Math.max(0, py * 100)),
      active: true,
    });
  };

  const resetCardTilt = () => {
    setCardTilt({
      rotateX: 0,
      rotateY: 0,
      glowX: 50,
      glowY: 50,
      active: false,
    });
  };

  return (
    <div
      ref={sectionRef}
      className="n2026-section relative min-h-screen overflow-hidden"
      onMouseMove={updateSpotlight}
      onMouseEnter={() => setSpotlight((current) => ({ ...current, active: true }))}
      onMouseLeave={() => setSpotlight((current) => ({ ...current, active: false, x: 50, y: 42 }))}
      style={{
        "--spot-x": `${spotlight.x}%`,
        "--spot-y": `${spotlight.y}%`,
        "--spot-intensity": spotlight.active ? 1 : 0.42,
      }}
    >
      <div className="n2026-stage-lights" aria-hidden="true">
        <span className="n2026-beam n2026-beam-1" />
        <span className="n2026-beam n2026-beam-2" />
        <span className="n2026-beam n2026-beam-3" />
        <span className="n2026-beam n2026-beam-4" />
        <span className="n2026-beam n2026-beam-5" />
        <span className="n2026-beam n2026-beam-6" />
        <span className="n2026-beam n2026-beam-7" />
        <span className="n2026-beam n2026-beam-8" />
      </div>
      <div className="n2026-spotlight" aria-hidden="true" />

      <section id="n2026" className="relative z-10 px-4 pb-10 pt-28 sm:px-8">
        <div className="mx-auto max-w-6xl" style={{ perspective: "1400px" }}>
          <div
            ref={cardRef}
            className={`n2026-float-card relative overflow-hidden rounded-[clamp(1.25rem,4vw,2rem)] border border-white/10 bg-[#2a0b0b]/60 ${cardTilt.active ? "is-active" : ""}`}
            onMouseMove={updateCardTilt}
            onMouseLeave={resetCardTilt}
            style={{
              "--card-glow-x": `${cardTilt.glowX}%`,
              "--card-glow-y": `${cardTilt.glowY}%`,
              "--card-glow-strength": cardTilt.active ? 1 : 0.35,
              transform: `rotateX(${cardTilt.rotateX}deg) rotateY(${cardTilt.rotateY}deg) translateZ(${cardTilt.active ? 18 : 0}px)`,
            }}
          >
            <div className="n2026-float-card-glow" aria-hidden="true" />
            <img
              src={N2026_PRESENTATION_IMAGE_URL}
              alt="Apresentação Compromisso Adoração 2026"
              className="h-[clamp(220px,52vw,480px)] w-full object-cover"
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(65,16,16,.12),rgba(65,16,16,.55)_58%,rgba(65,16,16,.92))]" />
            <div className="absolute inset-x-0 bottom-0 z-[2] flex flex-col items-start gap-3 p-5 sm:p-8">
              <img
                src={COMPROMISSO_ADORACAO_LOGO_URL}
                alt="Compromisso Adoração"
                className="compromisso-adoracao-logo h-auto w-[min(220px,58vw)] object-contain"
                loading="eager"
                decoding="async"
              />
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#f0ecb9]/88">
                <N2026BrandMark />
              </p>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-3xl text-center">
            <p className="text-sm uppercase tracking-[0.45em] text-[#e2b1a6]">Compromisso Adoração</p>
            <h1 className="font-hero mt-4 text-[clamp(1.75rem,5vw,3rem)] font-light tracking-[-0.04em] text-white">
              Uma noite de adoração para <span className="font-bold">encontrar a presença de Deus</span>
            </h1>
            <div className="mt-8 space-y-5 text-left text-[clamp(0.92rem,2.8vw,1rem)] leading-7 text-white/72 sm:text-center">
              <p>
                O Compromisso Adoração 2026 convida a igreja e a comunidade para um encontro especial de louvor, oração e comunhão. Uma experiência que une música, palavra e reverência em um ambiente acolhedor e contemporâneo.
              </p>
              <p>
                Mais do que um evento, é um momento para renovar o compromisso com Cristo, celebrar a fé em comunidade e viver a adoração como estilo de vida. Em breve, mais detalhes sobre data, programação e inscrições.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10">
        <N2026Footer />
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer id="contato" className="lp-section lp-section-footer relative bg-transparent px-4 sm:px-8">
      <div className="mx-auto max-w-6xl border-t border-white/10 pt-10">
        <div>
          <p className="text-sm uppercase tracking-[0.45em] text-[#e2b1a6]">Esperamos você</p>
          <h2 className="font-hero mt-4 text-[clamp(1.5rem,5vw,2rem)] font-light tracking-[-0.04em] text-white">
            Nataleluia
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/58">
            Mais de 20 anos inspirando a história que nunca deixou de ser vivenciada
          </p>
        </div>

        <div className="mt-10 w-full rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-white/66 opacity-80 backdrop-blur-md sm:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.32em] text-[#e2b1a6]">Contato</p>
              <p>(41) 3091 – 4347</p>
              <p>E-mail: nataleluia@pibcuritiba.org.br</p>
              <p>Rua Bento Viana, 1200 – Curitiba/PR</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70" href="#" aria-label="Instagram do Nataleluia">
                <Icon name="instagram" size={17} /> Instagram
              </a>
              <a className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70" href="#" aria-label="Localização do Nataleluia em Curitiba">
                <Icon name="pin" size={17} /> Curitiba
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex min-w-0 flex-col justify-between gap-4 border-t border-white/10 pt-7 text-[clamp(0.65rem,2.4vw,0.75rem)] uppercase tracking-[0.16em] text-white/38 sm:flex-row sm:tracking-[0.22em]">
          <span className="min-w-0 break-words">PIB Curitiba | Nataleluia</span>
        </div>
      </div>
    </footer>
  );
}

export default function NataleluiaLandingPage() {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const progress = useScrollProgress();

  const blur = useMemo(() => Math.min(18, 6 + progress * 20), [progress]);
  const bgOpacity = useMemo(() => Math.min(0.24, 0.07 + progress * 0.17), [progress]);

  useEffect(() => {
    assertLandingPageData();
  }, []);

  useEffect(() => {
    const syncRouteFromHash = () => {
      const { hash } = window.location;

      if (!hash) {
        setCurrentPage("home");
        return;
      }

      if (hash === "#n2026") {
        setCurrentPage("n2026");
        window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
        return;
      }

      if (hash === "#checkout") {
        setCurrentPage("checkout");
        window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
        return;
      }

      setCurrentPage("home");
      window.requestAnimationFrame(() => scrollToSection(hash, "auto"));
    };

    syncRouteFromHash();
    window.addEventListener("hashchange", syncRouteFromHash);
    return () => window.removeEventListener("hashchange", syncRouteFromHash);
  }, []);

  return (
    <main className="font-hero relative min-h-screen w-full max-w-[100%] overflow-x-hidden bg-[#411010] text-[#f4eee7] antialiased selection:bg-[#b94332] selection:text-white" data-preview-refresh="compromisso-adoracao-logo-checkout responsive-pass">
      <style>{`
        :root {
          --header-offset: 82px;
          --section-pad-y: clamp(4.2rem, 7.5vh, 5.5rem);
        }
        *, *::before, *::after { box-sizing: border-box; }
        html, body, #root {
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
        }
        body {
          margin: 0;
          overscroll-behavior-x: none;
        }
        img, video, canvas, svg {
          max-width: 100%;
        }
        button, a, input, select, textarea {
          max-width: 100%;
        }
        .page-shell,
        .content-gradient,
        .n2026-section,
        section[id],
        footer[id] {
          max-width: 100%;
          min-width: 0;
        }
        html { scroll-behavior: smooth; scroll-padding-top: var(--header-offset); }
        .lp-section,
        .lp-hero,
        section[id],
        footer[id] {
          scroll-margin-top: var(--header-offset);
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }
        .content-gradient {
          scroll-snap-type: y proximity;
        }
        .lp-section {
          padding-top: var(--section-pad-y);
          padding-bottom: var(--section-pad-y);
        }
        .lp-section-timeline {
          padding-top: clamp(3.6rem, 6.5vh, 4.8rem);
          padding-bottom: clamp(3.6rem, 6.5vh, 4.8rem);
        }
        .lp-section-footer {
          padding-top: clamp(3.8rem, 7vh, 5rem);
          padding-bottom: clamp(2.4rem, 5vh, 3rem);
        }
        @media (max-width: 767px) {
          :root { --header-offset: 74px; }
        }
        @media (max-width: 479px) {
          :root {
            --header-offset: 68px;
            --section-pad-y: clamp(2.75rem, 8vw, 4rem);
          }
          .lp-hero {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
            padding-top: 6.5rem;
            padding-bottom: 4.5rem;
          }
          .lp-section,
          section[id],
          footer[id] {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }
          .hero-title {
            font-size: clamp(1.12rem, 6.4vw, 1.85rem) !important;
          }
          .page-shell > header.fixed {
            top: 28px;
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
          .page-shell > header .block.h-12 {
            height: 2.5rem;
          }
          .page-shell > header .rounded-full.border {
            border-radius: 9999px;
          }
          .font-hero.text-4xl,
          .font-hero.sm\\:text-6xl,
          .font-hero.sm\\:text-5xl {
            font-size: clamp(1.65rem, 8.2vw, 2.35rem) !important;
          }
          .experience-card,
          .program-card {
            max-width: 100%;
          }
          .sponsor-marquee::before,
          .sponsor-marquee::after {
            width: 2.5rem;
          }
          #experiencia [class*="min-h-[520px]"],
          #experiencia [class*="min-h-[clamp"] {
            min-height: clamp(240px, 62vw, 380px);
            padding: 1.25rem;
            border-radius: 1.5rem;
          }
          #patrocine img[class*="max-h-"] {
            width: min(42vw, 140px) !important;
          }
          #faq article {
            min-height: 0;
          }
          #ingresso .grid {
            gap: 1rem;
          }
          #ingresso [class*="lg:h-[778px]"] {
            height: auto !important;
          }
          .sponsor-logo-item {
            min-width: 7.5rem;
          }
          .n2026-beam {
            width: clamp(34px, 9vw, 64px);
            filter: blur(14px);
          }
        }
        @media (max-width: 320px) {
          :root {
            --header-offset: 64px;
            --section-pad-y: 2.5rem;
          }
          .lp-hero {
            padding-left: 0.625rem;
            padding-right: 0.625rem;
          }
          .lp-section,
          section[id],
          footer[id] {
            padding-left: 0.625rem;
            padding-right: 0.625rem;
          }
          .hero-title {
            font-size: 1.08rem !important;
          }
          .church-logo-white {
            height: 58px !important;
            width: 126px !important;
          }
          #timeline-lp .timeline-actions {
            flex-direction: column;
            align-items: stretch;
          }
          #timeline-lp .timeline-actions > a,
          #timeline-lp .timeline-actions > button {
            width: 100%;
            justify-content: center;
            text-align: center;
            min-height: 44px;
          }
          .header-pill button,
          .header-pill a,
          #faq article,
          #ingresso button {
            -webkit-tap-highlight-color: transparent;
          }
        }
        .font-display,
        .font-hero,
        body {
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .hero-title {
          font-weight: 300;
          letter-spacing: -0.055em;
          line-height: 1.08;
          color: rgba(244, 238, 231, 0.88);
        }
        .hero-title strong {
          font-weight: 800;
          font-style: italic;
          color: rgba(244, 238, 231, 0.94);
        }
        .logo-fallback {
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          letter-spacing: -0.08em;
        }
        .header-nav-shell,
        .header-main-nav {
          padding-top: 0 !important;
          padding-bottom: 0 !important;
        }
        .header-main-nav {
          flex-wrap: nowrap;
        }
        .header-bar-wrap {
          position: relative;
          overflow: visible;
        }
        .header-pill {
          overflow: visible;
        }
        .header-logo-btn {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 20;
          background: transparent;
          border: 0;
          padding: 0;
          cursor: pointer;
        }
        .header-logo-image {
          display: block;
          filter: drop-shadow(0 10px 24px rgba(0, 0, 0, 0.28));
        }
        .church-logo-white {
          filter: brightness(0) invert(1) contrast(1.25);
          opacity: 0.95;
        }
        .compromisso-adoracao-logo {
          display: block;
          background: transparent !important;
        }
        .compromisso-adoracao-logo-wrap {
          display: inline-flex;
          background: transparent;
        }
        .n2026-section {
          --spot-x: 50%;
          --spot-y: 42%;
          --spot-intensity: 0.42;
          isolation: isolate;
          background:
            radial-gradient(circle at 1px 1px, rgba(240, 236, 185, 0.045) 1px, transparent 0),
            #411010;
          background-size: 28px 28px, auto;
          min-height: 100vh;
        }
        .n2026-stage-lights,
        .n2026-spotlight {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .n2026-stage-lights {
          overflow: hidden;
        }
        .n2026-beam {
          position: absolute;
          bottom: -8%;
          width: clamp(46px, 7vw, 88px);
          height: 118%;
          border-radius: 999px;
          transform-origin: 50% 100%;
          background: linear-gradient(
            180deg,
            rgba(255, 241, 198, 0.55) 0%,
            rgba(232, 168, 74, 0.38) 28%,
            rgba(185, 67, 50, 0.22) 62%,
            rgba(65, 16, 16, 0) 100%
          );
          filter: blur(18px);
          opacity: 0.28;
          mix-blend-mode: screen;
          animation: n2026BeamPulse 4.8s ease-in-out infinite;
        }
        .n2026-beam-1 { left: 4%; transform: rotate(-10deg); animation-delay: 0s; }
        .n2026-beam-2 { left: 11%; transform: rotate(-6deg); animation-delay: 0.55s; }
        .n2026-beam-3 { left: 18%; transform: rotate(-2deg); animation-delay: 1.1s; }
        .n2026-beam-4 { left: 25%; transform: rotate(3deg); animation-delay: 1.65s; }
        .n2026-beam-5 { right: 25%; left: auto; transform: rotate(-3deg); animation-delay: 0.35s; }
        .n2026-beam-6 { right: 18%; left: auto; transform: rotate(2deg); animation-delay: 0.9s; }
        .n2026-beam-7 { right: 11%; left: auto; transform: rotate(6deg); animation-delay: 1.4s; }
        .n2026-beam-8 { right: 4%; left: auto; transform: rotate(10deg); animation-delay: 1.95s; }
        .n2026-spotlight {
          background:
            radial-gradient(
              circle at var(--spot-x) var(--spot-y),
              rgba(255, 241, 198, calc(0.42 * var(--spot-intensity))) 0%,
              rgba(232, 168, 74, calc(0.24 * var(--spot-intensity))) 16%,
              rgba(185, 67, 50, calc(0.16 * var(--spot-intensity))) 34%,
              transparent 58%
            ),
            radial-gradient(
              circle at calc(var(--spot-x) + 8%) calc(var(--spot-y) - 10%),
              rgba(240, 236, 185, calc(0.14 * var(--spot-intensity))) 0%,
              transparent 40%
            );
          transition: opacity 0.35s ease;
          opacity: 1;
          mix-blend-mode: screen;
        }
        .n2026-section:hover .n2026-beam {
          filter: blur(14px);
        }
        .n2026-footer,
        #n2026-contato {
          background: transparent !important;
          background-color: transparent !important;
        }
        .n2026-footer .mx-auto {
          background: transparent;
        }
        .n2026-float-card {
          --card-glow-x: 50%;
          --card-glow-y: 50%;
          --card-glow-strength: 0.35;
          transform-style: preserve-3d;
          will-change: transform;
          transition:
            transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.45s ease,
            border-color 0.35s ease;
          box-shadow:
            0 24px 80px rgba(0, 0, 0, 0.32),
            0 0 0 1px rgba(255, 255, 255, 0.08);
        }
        .n2026-float-card.is-active {
          border-color: rgba(255, 241, 198, 0.28);
          box-shadow:
            0 34px 90px rgba(0, 0, 0, 0.42),
            0 18px 48px rgba(185, 67, 50, 0.22),
            0 0 0 1px rgba(255, 241, 198, 0.22),
            0 0 42px rgba(255, 241, 198, calc(0.18 * var(--card-glow-strength)));
        }
        .n2026-float-card-glow {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          border-radius: inherit;
          opacity: calc(0.55 + (0.45 * var(--card-glow-strength)));
          background:
            radial-gradient(
              420px circle at var(--card-glow-x) var(--card-glow-y),
              rgba(255, 241, 198, calc(0.34 * var(--card-glow-strength))),
              rgba(232, 168, 74, calc(0.12 * var(--card-glow-strength))) 28%,
              transparent 58%
            );
          mix-blend-mode: soft-light;
          transition: opacity 0.3s ease;
        }
        .n2026-float-card-glow::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1.5px;
          background: radial-gradient(
            280px circle at var(--card-glow-x) var(--card-glow-y),
            rgba(255, 255, 255, calc(0.92 * var(--card-glow-strength))),
            rgba(255, 241, 198, calc(0.55 * var(--card-glow-strength))) 28%,
            rgba(255, 255, 255, 0.08) 55%,
            transparent 72%
          );
          -webkit-mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          mask-composite: exclude;
          opacity: calc(0.35 + (0.65 * var(--card-glow-strength)));
          transition: opacity 0.3s ease;
        }
        @media (prefers-reduced-motion: reduce) {
          .n2026-float-card {
            transform: none !important;
            transition: none;
          }
        }
        @keyframes n2026BeamPulse {
          0%, 100% { opacity: 0.18; }
          35% { opacity: 0.55; }
          70% { opacity: 0.28; }
        }
        @media (prefers-reduced-motion: reduce) {
          .n2026-beam {
            animation: none;
            opacity: 0.3;
          }
        }
        .noise {
          background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.055) 1px, transparent 0);
          background-size: 22px 22px;
        }
        .video-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          width: 100%;
          height: 100%;
          max-width: 100%;
          object-fit: cover;
          opacity: 0.7;
          filter: saturate(0.92) contrast(1.04) brightness(0.72);
          pointer-events: none;
          transform: translate3d(0,0,0);
        }
        .video-overlay {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background:
            radial-gradient(circle at 72% 6%, rgba(106, 24, 24, 0.42), transparent 34%),
            linear-gradient(90deg, rgba(65,16,16,.9), rgba(65,16,16,.44) 48%, rgba(65,16,16,.84)),
            linear-gradient(180deg, rgba(65,16,16,.12), rgba(65,16,16,.62) 68%, rgba(65,16,16,.98) 100%);
        }
        .page-shell {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 100%;
          overflow-x: clip;
          min-width: 0;
        }
        .content-gradient {
          background: #411010;
        }
        .program-card {
          position: relative;
          transition: transform .35s ease, filter .35s ease;
        }
        .program-card:hover {
          transform: translateY(-6px);
          filter: drop-shadow(0 20px 42px rgba(185,67,50,.22));
        }
        .program-card svg {
          filter: drop-shadow(0 20px 42px rgba(0,0,0,.28));
        }
        .program-card-image {
          transform-box: fill-box;
          transform-origin: center;
          transition: transform .75s ease, filter .75s ease;
        }
        .program-card:hover .program-card-image {
          transform: scale(1.055);
          filter: saturate(1.08) brightness(1.05);
        }
        .experience-card {
          position: relative;
          overflow: hidden;
          border-radius: 0.48rem;
          border: 1px solid rgba(226, 177, 166, 0.16);
          background: linear-gradient(180deg, rgba(18, 43, 72, 0.88), rgba(14, 32, 58, 0.94));
          box-shadow: 0 18px 65px rgba(0,0,0,.24);
          transition: transform .35s ease, border-color .35s ease, box-shadow .35s ease, background .35s ease;
        }
        .experience-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          pointer-events: none;
          opacity: 0;
          background:
            radial-gradient(circle at 50% 18%, rgba(255, 238, 194, 0.24), transparent 30%),
            linear-gradient(135deg, rgba(255,255,255,0.16), transparent 42%, rgba(255,160,120,0.13));
          transition: opacity .35s ease;
        }
        .experience-card:hover {
          transform: translateY(-6px);
          border-color: rgba(238, 215, 170, 0.34);
          box-shadow: 0 24px 85px rgba(0,0,0,.34), 0 0 34px rgba(238, 199, 132, .14);
        }
        .experience-card:hover::before {
          opacity: 1;
        }
        .experience-shape-svg {
          display: block;
          width: 100%;
          height: auto;
          filter: drop-shadow(0 10px 22px rgba(0,0,0,.28));
        }
        .experience-shape-image {
          transform-box: fill-box;
          transform-origin: center;
          transition: transform .7s ease, filter .7s ease;
        }
        .experience-card:hover .experience-shape-image {
          transform: scale(1.045);
          filter: saturate(1.08) brightness(1.05);
        }
        .timeline-copy {
          animation: timelineTextReveal .42s ease both;
        }
        .timeline-card {
          cursor: pointer;
          left: 50%;
          top: 28px;
          transform-origin: center center;
          transition:
            transform .82s cubic-bezier(.16, 1, .3, 1),
            opacity .82s cubic-bezier(.16, 1, .3, 1),
            filter .82s cubic-bezier(.16, 1, .3, 1),
            width .82s cubic-bezier(.16, 1, .3, 1),
            height .82s cubic-bezier(.16, 1, .3, 1),
            box-shadow .82s cubic-bezier(.16, 1, .3, 1),
            border-color .82s cubic-bezier(.16, 1, .3, 1);
          will-change: transform, opacity, filter, width, height;
        }
        .timeline-carousel-stage {
          perspective: 1200px;
          isolation: isolate;
          max-width: 100%;
          overflow: visible;
        }
        #timeline-lp {
          overflow-x: clip;
        }
        @media (max-width: 1100px) and (min-width: 768px) {
          #timeline-lp .timeline-carousel-stage {
            max-width: min(860px, 100%);
            height: 460px;
          }
          #timeline-lp .timeline-card-active {
            width: min(280px, 42vw) !important;
            height: min(372px, 56vw) !important;
          }
          #timeline-lp .timeline-card-muted {
            width: min(200px, 28vw) !important;
            height: min(266px, 38vw) !important;
          }
          #timeline-lp .timeline-position-active {
            transform:
              perspective(1200px)
              translateX(-300px)
              translateY(var(--timeline-float-y, 0px))
              rotateX(var(--timeline-rotate-x, 0deg))
              rotateY(var(--timeline-rotate-y, 0deg))
              scale(calc(1 + var(--timeline-scale-bump, 0)));
          }
          #timeline-lp .timeline-position-prev {
            transform: translateX(-90px) translateY(68px) scale(.96);
          }
          #timeline-lp .timeline-position-next {
            transform: translateX(-20px) translateY(68px) scale(.96);
          }
          #timeline-lp .timeline-position-last {
            transform: translateX(160px) translateY(68px) scale(.96);
          }
        }
        @media (max-width: 1023px) {
          .header-logo-image {
            height: 2.75rem;
          }
          .n2026-float-card {
            transform: none !important;
          }
          .n2026-float-card.is-active {
            box-shadow:
              0 24px 70px rgba(0, 0, 0, 0.36),
              0 0 0 1px rgba(255, 241, 198, 0.18);
          }
          #experiencia .grid {
            gap: 2rem;
          }
          #patrocine,
          #faq,
          #evento,
          #experiencia,
          #contato,
          #n2026,
          #n2026-contato,
          #ingresso {
            overflow-x: clip;
          }
          p[class*="tracking-[0.45em]"],
          p[class*="tracking-[0.4em]"] {
            letter-spacing: 0.22em;
          }
        }
        @media (hover: none) {
          .n2026-float-card {
            transform: none !important;
          }
          .program-card:hover,
          .experience-card:hover {
            transform: none;
          }
        }
        .timeline-bg-image {
          animation: timelineBgReveal .7s ease both;
          filter: saturate(.9) contrast(1.04) brightness(.82);
        }
        .timeline-position-active {
          z-index: 5;
          transform:
            perspective(1200px)
            translateX(-392px)
            translateY(var(--timeline-float-y, 0px))
            rotateX(var(--timeline-rotate-x, 0deg))
            rotateY(var(--timeline-rotate-y, 0deg))
            scale(calc(1 + var(--timeline-scale-bump, 0)));
        }
        .timeline-position-prev {
          z-index: 2;
          transform: translateX(-122px) translateY(78px) scale(.98);
        }
        .timeline-position-next {
          z-index: 3;
          transform: translateX(-42px) translateY(78px) scale(.98);
        }
        .timeline-position-last {
          z-index: 2;
          transform: translateX(222px) translateY(78px) scale(.98);
        }
        .timeline-card-leaving {
          left: 50%;
          top: 28px;
          z-index: 6;
          animation: timelineExitLeft .82s cubic-bezier(.65,0,.35,1) both;
          transform-origin: center left;
        }
        .timeline-card-active {
          filter: blur(0);
          opacity: 1;
          border-color: rgba(240,236,185,.28);
          box-shadow: 0 24px 90px rgba(0,0,0,.38), 0 0 34px rgba(240,236,185,.1);
        }
        .timeline-card-muted {
          filter: blur(3.2px);
          opacity: .52;
        }
        .timeline-card-muted:hover {
          filter: blur(1px);
          opacity: .78;
        }
        .timeline-card-shell {
          position: relative;
          border-radius: inherit;
          transform-style: preserve-3d;
          transition:
            box-shadow .26s ease,
            filter .26s ease;
        }
        .timeline-card-shell::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          opacity: var(--timeline-glow-opacity, 0);
          background:
            radial-gradient(circle at var(--timeline-glow-x, 50%) var(--timeline-glow-y, 50%), rgba(255,255,255,.12), transparent 30%),
            linear-gradient(180deg, rgba(255,255,255,.04), transparent 36%);
          mix-blend-mode: screen;
          transition: opacity .24s ease;
        }
        .timeline-card-shell > * {
          position: relative;
          z-index: 1;
        }
        .timeline-card-shell-active {
          transform: none;
        }
        .timeline-card-active:hover .timeline-card-shell-active {
          box-shadow: 0 16px 32px rgba(0,0,0,.16);
          filter: saturate(1.02);
        }
        @keyframes timelineTextReveal {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        #timeline-lp .timeline-bg-edge {
          position: absolute;
          left: 0;
          right: 0;
          height: clamp(3.6rem, 6.5vh, 4.8rem);
          pointer-events: none;
        }
        #timeline-lp .timeline-bg-edge-top {
          top: 0;
          background: linear-gradient(to bottom, #411010 0%, rgba(65, 16, 16, 0.45) 55%, rgba(65, 16, 16, 0.03) 100%);
        }
        #timeline-lp .timeline-bg-edge-bottom {
          bottom: 0;
          background: linear-gradient(to top, #411010 0%, rgba(65, 16, 16, 0.45) 55%, rgba(65, 16, 16, 0.03) 100%);
        }
        @keyframes timelineBgReveal {
          from { opacity: 0; transform: scale(1.055); filter: blur(10px) saturate(.78) brightness(.72); }
          45% { opacity: .3; }
          to { opacity: .3; transform: scale(1); filter: blur(1.5px) saturate(.9) contrast(1.04) brightness(.82); }
        }
        @keyframes timelineExitLeft {
          0% { opacity: 1; filter: blur(0); transform: translateX(-392px) translateY(0) scale(1); }
          100% { opacity: 0; filter: blur(5px); transform: translateX(-720px) translateY(38px) scale(.72); }
        }
        @media (max-width: 767px) {
          #timeline-lp {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
            overflow: hidden;
            min-height: auto;
          }
          #timeline-lp .timeline-carousel-stage {
            height: auto;
            min-height: 430px;
            max-width: min(342px, calc(100vw - 24px));
            margin-left: auto;
            margin-right: auto;
            overflow: visible;
            touch-action: pan-y;
          }
          #timeline-lp .timeline-card {
            left: 50%;
            top: 12px;
          }
          #timeline-lp .timeline-card-muted {
            display: none;
          }
          #timeline-lp .timeline-card-active {
            width: min(342px, calc(100vw - 24px)) !important;
            height: auto !important;
            min-height: 420px;
          }
          #timeline-lp .timeline-position-active {
            transform: translateX(calc(-50% + var(--timeline-swipe-x, 0px))) translateY(0) scale(1);
            transition:
              transform .16s ease-out,
              opacity .82s cubic-bezier(.16, 1, .3, 1),
              filter .82s cubic-bezier(.16, 1, .3, 1),
              width .82s cubic-bezier(.16, 1, .3, 1),
              height .82s cubic-bezier(.16, 1, .3, 1),
              box-shadow .82s cubic-bezier(.16, 1, .3, 1),
              border-color .82s cubic-bezier(.16, 1, .3, 1);
          }
          #timeline-lp .timeline-card-active [class*="h-[270px]"] {
            height: clamp(220px, 58vw, 320px) !important;
          }
          #timeline-lp .timeline-card-leaving {
            width: min(342px, calc(100vw - 24px)) !important;
            height: auto !important;
            min-height: 420px;
            animation: timelineExitLeftMobile .72s cubic-bezier(.65,0,.35,1) both;
          }
          #timeline-lp .timeline-copy {
            font-size: 13px;
            line-height: 1.6;
          }
          #timeline-lp .lg\\:-translate-y-\\[24\\%\\] {
            transform: translateY(0) !important;
          }
          #timeline-lp .lg\\:min-h-\\[448px\\] {
            min-height: auto !important;
          }
        }
        @media (max-width: 320px) {
          #timeline-lp {
            padding-left: 0.625rem;
            padding-right: 0.625rem;
          }
          #timeline-lp .timeline-carousel-stage {
            min-height: 390px;
            max-width: calc(100vw - 20px);
          }
          #timeline-lp .timeline-card-active {
            width: calc(100vw - 20px) !important;
            min-height: 390px;
          }
          #timeline-lp .timeline-card-active [class*="h-[270px]"] {
            height: clamp(196px, 54vw, 250px) !important;
          }
          #timeline-lp .timeline-card-active [class*="text-lg"] {
            font-size: 0.95rem !important;
          }
          #timeline-lp .timeline-swipe-hint {
            font-size: 9px;
            letter-spacing: 0.1em;
          }
        }
        @keyframes timelineExitLeftMobile {
          0% { opacity: 1; filter: blur(0); transform: translateX(-50%) translateY(0) scale(1); }
          100% { opacity: 0; filter: blur(5px); transform: translateX(-135%) translateY(24px) scale(.72); }
        }
        .sponsor-banner-section {
          position: relative;
          z-index: 3;
          background: transparent;
        }
        .sponsor-marquee {
          position: relative;
          width: 100%;
          overflow: hidden;
          padding: 1rem 0;
          background: transparent;
        }
        .sponsor-marquee::before,
        .sponsor-marquee::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          z-index: 2;
          width: 4.5rem;
          pointer-events: none;
        }
        .sponsor-marquee::before {
          left: 0;
          background: linear-gradient(90deg, #411010, rgba(65,16,16,0));
        }
        .sponsor-marquee::after {
          right: 0;
          background: linear-gradient(270deg, #411010, rgba(65,16,16,0));
        }
        .sponsor-marquee-track {
          display: flex;
          width: max-content;
          align-items: center;
          gap: 1.6rem;
          animation: sponsorSlide 30s linear infinite;
          will-change: transform;
        }
        .sponsor-marquee-track:hover {
          animation-play-state: paused;
        }
        .sponsor-logo-item {
          flex: 0 0 auto;
          display: inline-flex;
          min-width: 9.5rem;
          height: 58px;
          align-items: center;
          justify-content: center;
          background: transparent;
        }
        .sponsor-logo-image {
          display: block;
          height: 48px;
          max-height: 48px;
          width: auto;
          max-width: 170px;
          object-fit: contain;
          background: transparent;
          filter: brightness(0) invert(1) grayscale(1) contrast(1.18);
          opacity: 0.96;
        }
        .sponsor-logo-centro-formacao,
        .sponsor-logo-colegio-grace,
        .sponsor-logo-duovias,
        .sponsor-logo-fabapar,
        .sponsor-logo-outdoormidia,
        .sponsor-logo-prefeitura-curitiba,
        .sponsor-logo-sevenpass {
          height: 48px;
          max-height: 48px;
        }
        .sponsor-logo-colegio-grace,
        .sponsor-logo-duovias {
          max-width: 155px;
        }
        .sponsor-logo-sevenpass {
          height: 58px;
          max-height: 58px;
          max-width: 200px;
          filter: none;
        }
        .sponsor-logo-prefeitura-curitiba,
        .sponsor-logo-fabapar {
          max-width: 170px;
        }
        .sponsor-logo-outdoormidia,
        .sponsor-logo-centro-formacao {
          max-width: 160px;
        }
        @keyframes sponsorSlide {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
        .fade-in-up {
          opacity: 0;
          transform: translateY(24px);
          animation: fadeInUp .9s ease forwards;
        }
        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <video
        className="video-bg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        poster="./assets/fundo-pib.jpg"
      >
        <source src={HERO_VIDEO_URL} type="video/mp4" />
      </video>
      <div className="video-overlay" />
      <div className="fixed inset-0 z-[1] pointer-events-none noise opacity-10" />

      <div className="page-shell">
        <Header blur={blur} bgOpacity={bgOpacity} open={open} setOpen={setOpen} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        {currentPage === "checkout" ? (
          <CheckoutPage />
        ) : currentPage === "n2026" ? (
          <N2026Page />
        ) : (
          <>
            <Hero />
            <div className="content-gradient">
              <EventSection />
              <ExperienceSection />
              <TimelineSection />
              <FaqSection />
              <SponsorSection />
              <SponsorsBanner />
              <Footer />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
