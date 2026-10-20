import React, { useEffect, useRef, useState } from "react";
import "./accessibility.css";

const A11Y_DEFAULTS = { size: 100, readable: false, contrast: false, dark: false, invert: false, cursor: false, links: false, focus: true, language: "pt", rate: 1, voice: "" };
const A11Y_LANGUAGES = [["pt", "Português", "pt-BR"], ["en", "English", "en-US"], ["de", "Deutsch", "de-DE"], ["es", "Español", "es-ES"], ["it", "Italiano", "it-IT"], ["ja", "日本語", "ja-JP"]];
const a11yRead = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; } };
const a11ySave = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Private browsing or storage quota. */ } };

const A11Y_MESSAGES = {
  "en": {
    "Acessibilidade": "Accessibility",
    "Fonte e texto": "Font and text",
    "Fonte legível": "Readable font",
    "Alto contraste": "High contrast",
    "Modo escuro": "Dark mode",
    "Inverter cores": "Invert colors",
    "Cursor ampliado": "Large cursor",
    "Destacar links": "Highlight links",
    "Foco do teclado": "Keyboard focus",
    "Leitura em voz alta": "Read aloud",
    "Velocidade": "Speed",
    "Voz": "Voice",
    "Idioma": "Language",
    "Restaurar padrão": "Reset defaults",
    "Restaurar fonte": "Reset font",
    "Diminuir fonte": "Decrease font size",
    "Aumentar fonte": "Increase font size",
    "Fechar opções de acessibilidade": "Close accessibility options",
    "Automática para o idioma": "Automatic for language",
    "▶ Ler": "▶ Read",
    "Pausar": "Pause",
    "Retomar": "Resume",
    "■ Parar": "■ Stop",
    "Parado": "Stopped",
    "Lendo": "Reading",
    "Pausado": "Paused",
    "Concluído": "Finished",
    "Nenhum texto disponível": "No text available",
    "Leitura em voz alta indisponível neste navegador.": "Read aloud is unavailable in this browser.",
    "Tradução automática via MyMemory. Requer internet e está sujeita à cota do serviço.": "Automatic translation by MyMemory. Internet access required; service quota applies."
  },
  "de": {
    "Acessibilidade": "Barrierefreiheit",
    "Fonte e texto": "Schrift und Text",
    "Fonte legível": "Gut lesbare Schrift",
    "Alto contraste": "Hoher Kontrast",
    "Modo escuro": "Dunkelmodus",
    "Inverter cores": "Farben umkehren",
    "Cursor ampliado": "Großer Mauszeiger",
    "Destacar links": "Links hervorheben",
    "Foco do teclado": "Tastaturfokus",
    "Leitura em voz alta": "Vorlesen",
    "Velocidade": "Geschwindigkeit",
    "Voz": "Stimme",
    "Idioma": "Sprache",
    "Restaurar padrão": "Zurücksetzen",
    "Restaurar fonte": "Schrift zurücksetzen",
    "Diminuir fonte": "Schrift verkleinern",
    "Aumentar fonte": "Schrift vergrößern",
    "Fechar opções de acessibilidade": "Barrierefreiheitsoptionen schließen",
    "Automática para o idioma": "Automatisch für die Sprache",
    "▶ Ler": "▶ Vorlesen",
    "Pausar": "Pausieren",
    "Retomar": "Fortsetzen",
    "■ Parar": "■ Stoppen",
    "Parado": "Gestoppt",
    "Lendo": "Wird vorgelesen",
    "Pausado": "Pausiert",
    "Concluído": "Abgeschlossen",
    "Nenhum texto disponível": "Kein Text verfügbar",
    "Leitura em voz alta indisponível neste navegador.": "Vorlesen ist in diesem Browser nicht verfügbar.",
    "Tradução automática via MyMemory. Requer internet e está sujeita à cota do serviço.": "Automatische Übersetzung mit MyMemory. Internet erforderlich; Nutzungslimit des Dienstes gilt."
  },
  "es": {
    "Acessibilidade": "Accesibilidad",
    "Fonte e texto": "Fuente y texto",
    "Fonte legível": "Fuente legible",
    "Alto contraste": "Alto contraste",
    "Modo escuro": "Modo oscuro",
    "Inverter cores": "Invertir colores",
    "Cursor ampliado": "Cursor ampliado",
    "Destacar links": "Resaltar enlaces",
    "Foco do teclado": "Foco del teclado",
    "Leitura em voz alta": "Lectura en voz alta",
    "Velocidade": "Velocidad",
    "Voz": "Voz",
    "Idioma": "Idioma",
    "Restaurar padrão": "Restaurar valores",
    "Restaurar fonte": "Restaurar fuente",
    "Diminuir fonte": "Reducir fuente",
    "Aumentar fonte": "Aumentar fuente",
    "Fechar opções de acessibilidade": "Cerrar opciones de accesibilidad",
    "Automática para o idioma": "Automática según el idioma",
    "▶ Ler": "▶ Leer",
    "Pausar": "Pausar",
    "Retomar": "Reanudar",
    "■ Parar": "■ Detener",
    "Parado": "Detenido",
    "Lendo": "Leyendo",
    "Pausado": "En pausa",
    "Concluído": "Finalizado",
    "Nenhum texto disponível": "No hay texto disponible",
    "Leitura em voz alta indisponível neste navegador.": "La lectura no está disponible en este navegador.",
    "Tradução automática via MyMemory. Requer internet e está sujeita à cota do serviço.": "Traducción automática con MyMemory. Requiere internet y está sujeta a la cuota del servicio."
  },
  "it": {
    "Acessibilidade": "Accessibilità",
    "Fonte e texto": "Carattere e testo",
    "Fonte legível": "Carattere leggibile",
    "Alto contraste": "Contrasto elevato",
    "Modo escuro": "Modalità scura",
    "Inverter cores": "Inverti colori",
    "Cursor ampliado": "Cursore grande",
    "Destacar links": "Evidenzia collegamenti",
    "Foco do teclado": "Focus da tastiera",
    "Leitura em voz alta": "Lettura ad alta voce",
    "Velocidade": "Velocità",
    "Voz": "Voce",
    "Idioma": "Lingua",
    "Restaurar padrão": "Ripristina impostazioni",
    "Restaurar fonte": "Ripristina carattere",
    "Diminuir fonte": "Riduci carattere",
    "Aumentar fonte": "Ingrandisci carattere",
    "Fechar opções de acessibilidade": "Chiudi opzioni di accessibilità",
    "Automática para o idioma": "Automatica per la lingua",
    "▶ Ler": "▶ Leggi",
    "Pausar": "Pausa",
    "Retomar": "Riprendi",
    "■ Parar": "■ Interrompi",
    "Parado": "Interrotto",
    "Lendo": "Lettura in corso",
    "Pausado": "In pausa",
    "Concluído": "Completato",
    "Nenhum texto disponível": "Nessun testo disponibile",
    "Leitura em voz alta indisponível neste navegador.": "La lettura non è disponibile in questo browser.",
    "Tradução automática via MyMemory. Requer internet e está sujeita à cota do serviço.": "Traduzione automatica con MyMemory. Richiede internet ed è soggetta alla quota del servizio."
  },
  "ja": {
    "Acessibilidade": "アクセシビリティ",
    "Fonte e texto": "文字とフォント",
    "Fonte legível": "読みやすいフォント",
    "Alto contraste": "ハイコントラスト",
    "Modo escuro": "ダークモード",
    "Inverter cores": "色を反転",
    "Cursor ampliado": "大きいカーソル",
    "Destacar links": "リンクを強調",
    "Foco do teclado": "キーボードフォーカス",
    "Leitura em voz alta": "読み上げ",
    "Velocidade": "速度",
    "Voz": "音声",
    "Idioma": "言語",
    "Restaurar padrão": "初期設定に戻す",
    "Restaurar fonte": "文字サイズを戻す",
    "Diminuir fonte": "文字を小さくする",
    "Aumentar fonte": "文字を大きくする",
    "Fechar opções de acessibilidade": "アクセシビリティ設定を閉じる",
    "Automática para o idioma": "言語に合わせて自動選択",
    "▶ Ler": "▶ 読み上げ",
    "Pausar": "一時停止",
    "Retomar": "再開",
    "■ Parar": "■ 停止",
    "Parado": "停止中",
    "Lendo": "読み上げ中",
    "Pausado": "一時停止中",
    "Concluído": "完了",
    "Nenhum texto disponível": "読み上げるテキストがありません",
    "Leitura em voz alta indisponível neste navegador.": "このブラウザーは読み上げに対応していません。",
    "Tradução automática via MyMemory. Requer internet e está sujeita à cota do serviço.": "MyMemoryによる自動翻訳。インターネット接続が必要です。利用上限があります。"
  }
};

const A11Y_STATUS_MESSAGES = {
  "en": {
    "Traduzindo…": "Translating…",
    "Tradução automática concluída.": "Automatic translation complete.",
    "Serviço de tradução indisponível.": "Translation service unavailable.",
    "Tradução indisponível ou cota diária atingida. Alguns textos permanecem em português.": "Translation unavailable or daily quota reached. Some text remains in Portuguese.",
    "Não foi possível traduzir. Tente novamente mais tarde.": "Unable to translate. Please try again later.",
    "Não foi possível iniciar a voz. Verifique as vozes do navegador.": "Unable to start speech. Check the browser voices."
  },
  "de": {
    "Traduzindo…": "Übersetzung läuft…",
    "Tradução automática concluída.": "Automatische Übersetzung abgeschlossen.",
    "Serviço de tradução indisponível.": "Übersetzungsdienst nicht verfügbar.",
    "Tradução indisponível ou cota diária atingida. Alguns textos permanecem em português.": "Übersetzung nicht verfügbar oder Tageslimit erreicht. Einige Texte bleiben auf Portugiesisch.",
    "Não foi possível traduzir. Tente novamente mais tarde.": "Übersetzung nicht möglich. Bitte später erneut versuchen.",
    "Não foi possível iniciar a voz. Verifique as vozes do navegador.": "Sprachausgabe konnte nicht gestartet werden. Bitte die Browserstimmen prüfen."
  },
  "es": {
    "Traduzindo…": "Traduciendo…",
    "Tradução automática concluída.": "Traducción automática completada.",
    "Serviço de tradução indisponível.": "Servicio de traducción no disponible.",
    "Tradução indisponível ou cota diária atingida. Alguns textos permanecem em português.": "Traducción no disponible o cuota diaria alcanzada. Algunos textos siguen en portugués.",
    "Não foi possível traduzir. Tente novamente mais tarde.": "No se pudo traducir. Inténtelo más tarde.",
    "Não foi possível iniciar a voz. Verifique as vozes do navegador.": "No se pudo iniciar la voz. Revise las voces del navegador."
  },
  "it": {
    "Traduzindo…": "Traduzione in corso…",
    "Tradução automática concluída.": "Traduzione automatica completata.",
    "Serviço de tradução indisponível.": "Servizio di traduzione non disponibile.",
    "Tradução indisponível ou cota diária atingida. Alguns textos permanecem em português.": "Traduzione non disponibile o quota giornaliera raggiunta. Alcuni testi restano in portoghese.",
    "Não foi possível traduzir. Tente novamente mais tarde.": "Impossibile tradurre. Riprova più tardi.",
    "Não foi possível iniciar a voz. Verifique as vozes do navegador.": "Impossibile avviare la voce. Controlla le voci del browser."
  },
  "ja": {
    "Traduzindo…": "翻訳中…",
    "Tradução automática concluída.": "自動翻訳が完了しました。",
    "Serviço de tradução indisponível.": "翻訳サービスを利用できません。",
    "Tradução indisponível ou cota diária atingida. Alguns textos permanecem em português.": "翻訳サービスが利用できないか、1日の利用上限に達しました。一部の文章はポルトガル語のままです。",
    "Não foi possível traduzir. Tente novamente mais tarde.": "翻訳できませんでした。しばらくしてから再度お試しください。",
    "Não foi possível iniciar a voz. Verifique as vozes do navegador.": "読み上げを開始できませんでした。ブラウザーの音声を確認してください。"
  }
};

const A11Y_CONTENT_MESSAGES = {
  "en": {
    "A história": "The story",
    "que nunca": "that has never",
    "deixou de": "stopped",
    "ser contada": "being told",
    "Meu ingresso": "My ticket",
    "Ingressos": "Tickets",
    "O Evento": "The event",
    "A Experiência": "The experience",
    "Linha do tempo": "Timeline",
    "FAQ perguntas": "FAQ",
    "Seja um patrocinador": "Become a sponsor",
    "Ser um patrocinador": "Become a sponsor",
    "Dúvidas": "Frequently",
    "frequentes": "asked questions",
    "Confira as fotos": "View photos",
    "Contato": "Contact",
    "Música": "Music",
    "Teatro": "Theater",
    "Tecnologia": "Technology",
    "Acessibilidade": "Accessibility"
  },
  "de": {
    "A história": "Die Geschichte,",
    "que nunca": "die niemals",
    "deixou de": "aufhörte,",
    "ser contada": "erzählt zu werden",
    "Meu ingresso": "Mein Ticket",
    "Ingressos": "Tickets",
    "O Evento": "Die Veranstaltung",
    "A Experiência": "Das Erlebnis",
    "Linha do tempo": "Zeitleiste",
    "FAQ perguntas": "Häufige Fragen",
    "Seja um patrocinador": "Sponsor werden",
    "Ser um patrocinador": "Sponsor werden",
    "Dúvidas": "Häufige",
    "frequentes": "Fragen",
    "Confira as fotos": "Fotos ansehen",
    "Contato": "Kontakt",
    "Música": "Musik",
    "Teatro": "Theater",
    "Tecnologia": "Technologie",
    "Acessibilidade": "Barrierefreiheit"
  },
  "es": {
    "A história": "La historia",
    "que nunca": "que nunca",
    "deixou de": "dejó de",
    "ser contada": "ser contada",
    "Meu ingresso": "Mi entrada",
    "Ingressos": "Entradas",
    "O Evento": "El evento",
    "A Experiência": "La experiencia",
    "Linha do tempo": "Cronología",
    "FAQ perguntas": "Preguntas frecuentes",
    "Seja um patrocinador": "Sé patrocinador",
    "Ser um patrocinador": "Sé patrocinador",
    "Dúvidas": "Preguntas",
    "frequentes": "frecuentes",
    "Confira as fotos": "Ver fotos",
    "Contato": "Contacto",
    "Música": "Música",
    "Teatro": "Teatro",
    "Tecnologia": "Tecnología",
    "Acessibilidade": "Accesibilidad"
  },
  "it": {
    "A história": "La storia",
    "que nunca": "che non ha mai",
    "deixou de": "smesso di",
    "ser contada": "essere raccontata",
    "Meu ingresso": "Il mio biglietto",
    "Ingressos": "Biglietti",
    "O Evento": "L’evento",
    "A Experiência": "L’esperienza",
    "Linha do tempo": "Cronologia",
    "FAQ perguntas": "Domande frequenti",
    "Seja um patrocinador": "Diventa sponsor",
    "Ser um patrocinador": "Diventa sponsor",
    "Dúvidas": "Domande",
    "frequentes": "frequenti",
    "Confira as fotos": "Guarda le foto",
    "Contato": "Contatti",
    "Música": "Musica",
    "Teatro": "Teatro",
    "Tecnologia": "Tecnologia",
    "Acessibilidade": "Accessibilità"
  },
  "ja": {
    "A história": "この物語は",
    "que nunca": "今もなお",
    "deixou de": "語り継がれて",
    "ser contada": "います",
    "Meu ingresso": "マイチケット",
    "Ingressos": "チケット",
    "O Evento": "イベント",
    "A Experiência": "体験",
    "Linha do tempo": "年表",
    "FAQ perguntas": "よくある質問",
    "Seja um patrocinador": "スポンサーになる",
    "Ser um patrocinador": "スポンサーになる",
    "Dúvidas": "よくある",
    "frequentes": "質問",
    "Confira as fotos": "写真を見る",
    "Contato": "お問い合わせ",
    "Música": "音楽",
    "Teatro": "演劇",
    "Tecnologia": "テクノロジー",
    "Acessibilidade": "アクセシビリティ"
  }
};

export function AccessibilitySymbol() {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="6.5" r="1" /><path d="m6 10 6 1 6-1M12 11v5m0-2-3 5m3-5 3 5" /></svg>;
}

// Keep text nodes in place so React's event handlers, links and form state survive translation.
function usePageTranslation(language, route, setStatus) {
  const originals = useRef(new Map());
  const cache = useRef(a11yRead("nataleluia-translations-v1", {}));
  useEffect(() => {
    const controller = new AbortController();
    let timer;
    let working = false;
    let dirty = false;
    const records = originals.current;
    const observe = () => observer.observe(document.getElementById("root"), { subtree: true, childList: true, characterData: true });
    const scan = async () => {
      if (working) { dirty = true; return; }
      working = true;
      dirty = false;
      observer.disconnect();
      for (const [node] of records) if (!node.isConnected) records.delete(node);
      const walker = document.createTreeWalker(document.getElementById("root"), NodeFilter.SHOW_TEXT);
      let node;
      const tasks = [];
      while ((node = walker.nextNode())) {
        const parent = node.parentElement;
        if (!parent || parent.closest("script,style,svg,textarea,option,[translate=no],[data-a11y-status]")) continue;
        const text = node.nodeValue;
        if (!text.trim() || !/[\p{L}]/u.test(text)) continue;
        let record = records.get(node);
        if (!record || (text !== record.last && text !== record.original)) {
          record = { original: text, last: text };
          records.set(node, record);
        }
        tasks.push([node, record]);
      }
      if (language === "pt") {
        for (const [textNode, record] of records) if (textNode.isConnected) {
          textNode.nodeValue = record.original;
          record.last = record.original;
        }
        document.documentElement.lang = "pt-BR";
        setStatus("");
        working = false;
        observe();
        return;
      }
      document.documentElement.lang = A11Y_LANGUAGES.find(([code]) => code === language)[2];
      setStatus("Traduzindo…");
      observe();
      try {
        for (const [textNode, record] of tasks) {
          if (controller.signal.aborted) break;
          const source = record.original.trim();
          const key = `${language}:${source}`;
          let translated = A11Y_CONTENT_MESSAGES[language]?.[source] || cache.current[key];
          if (!translated) {
            // MyMemory accepts at most 500 UTF-8 bytes per segment.
            const segments = [];
            let segment = "";
            for (const word of source.split(/\s+/)) {
              if (new TextEncoder().encode(`${segment} ${word}`).length > 450 && segment) { segments.push(segment); segment = ""; }
              segment += (segment ? " " : "") + word;
            }
            if (segment) segments.push(segment);
            const results = [];
            for (const part of segments) {
              const url = `https://api.mymemory.translated.net/get?${new URLSearchParams({ q: part, langpair: `pt|${language}` })}`;
              const response = await fetch(url, { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]), referrerPolicy: "no-referrer" });
              if (!response.ok) throw new Error("Serviço de tradução indisponível.");
              const data = await response.json();
              if (Number(data.responseStatus) !== 200 || data.quotaFinished || !data.responseData?.translatedText) throw new Error("Tradução indisponível ou cota diária atingida. Alguns textos permanecem em português.");
              const decoded = document.createElement("textarea");
              decoded.innerHTML = data.responseData.translatedText;
              results.push(decoded.value);
            }
            translated = results.join(" ");
            cache.current[key] = translated;
          }
          if (controller.signal.aborted) break;
          if (textNode.isConnected && (textNode.nodeValue === record.last || textNode.nodeValue === record.original)) {
            observer.disconnect();
            textNode.nodeValue = record.original.replace(record.original.trim(), translated);
            record.last = textNode.nodeValue;
            observe();
          }
        }
        if (!controller.signal.aborted) setStatus("Tradução automática concluída.");
      } catch (error) {
        if (!controller.signal.aborted) setStatus(error.message || "Não foi possível traduzir. Tente novamente mais tarde.");
      } finally {
        a11ySave("nataleluia-translations-v1", cache.current);
        working = false;
        if (dirty && !controller.signal.aborted) timer = window.setTimeout(scan, 250);
      }
    };
    const observer = new MutationObserver((mutations) => {
      if (mutations.every((mutation) => (mutation.target.nodeType === Node.TEXT_NODE ? mutation.target.parentElement : mutation.target).closest?.("[translate=no]"))) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(scan, 250);
    });
    scan();
    return () => { controller.abort(); observer.disconnect(); window.clearTimeout(timer); };
  }, [language, route]);
}

export default function AccessibilityWidget({ currentPage }) {
  const [preferences, setPreferences] = useState(() => {
    const stored = a11yRead("nataleluia-accessibility-v1", {});
    return { ...A11Y_DEFAULTS, ...stored, size: Math.max(80, Math.min(150, Number(stored.size) || 100)), language: A11Y_LANGUAGES.some(([code]) => code === stored.language) ? stored.language : "pt" };
  });
  const t = (text) => A11Y_MESSAGES[preferences.language]?.[text] || A11Y_STATUS_MESSAGES[preferences.language]?.[text] || text;
  const [open, setOpen] = useState(false);
  const [translationStatus, setTranslationStatus] = useState("");
  const [reading, setReading] = useState("Parado");
  const [voices, setVoices] = useState([]);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const speechId = useRef(0);
  const utteranceRef = useRef(null);
  const supported = typeof window.speechSynthesis !== "undefined" && typeof window.SpeechSynthesisUtterance !== "undefined";
  const update = (key, value) => setPreferences((previous) => ({ ...previous, [key]: value }));
  const stop = () => { speechId.current += 1; if (supported) window.speechSynthesis.cancel(); utteranceRef.current = null; setReading("Parado"); };
  usePageTranslation(preferences.language, `${currentPage}:${open}`, setTranslationStatus);

  useEffect(() => {
    const handle = () => setOpen(true);
    window.addEventListener("open-accessibility", handle);
    return () => window.removeEventListener("open-accessibility", handle);
  }, []);
  useEffect(() => {
    const labels = { pt: "Opções de acessibilidade", en: "Accessibility options", de: "Barrierefreiheitsoptionen", es: "Opciones de accesibilidad", it: "Opzioni di accessibilità", ja: "アクセシビリティ設定" };
    document.querySelectorAll(".a11y-trigger").forEach((trigger) => {
      trigger.setAttribute("aria-label", labels[preferences.language]);
      trigger.setAttribute("title", labels[preferences.language]);
      trigger.setAttribute("aria-expanded", String(open));
      trigger.setAttribute("aria-controls", "a11y-panel");
    });
  }, [preferences.language, open, currentPage]);
  useEffect(() => {
    a11ySave("nataleluia-accessibility-v1", preferences);
    const root = document.documentElement;
    for (const name of ["readable", "contrast", "dark", "invert", "cursor", "links", "focus"]) root.classList.toggle(`a11y-${name}`, !!preferences[name]);
  }, [preferences]);
  useEffect(() => {
    const shell = document.querySelector(".page-shell");
    if (!shell) return;
    const saved = new Map();
    const apply = () => {
      for (const [element, original] of saved) element.style.fontSize = original.inline;
      const elements = [...shell.querySelectorAll("h1,h2,h3,h4,p,li,a,button,label,span,summary,input,select,textarea")];
      elements.forEach((element) => {
        if (element.closest("svg,[aria-hidden=true]")) return;
        if (!saved.has(element)) saved.set(element, { inline: element.style.fontSize, base: parseFloat(getComputedStyle(element).fontSize) });
        else saved.get(element).base = parseFloat(getComputedStyle(element).fontSize);
      });
      for (const [element, original] of saved) if (preferences.size !== 100) element.style.fontSize = `${original.base * preferences.size / 100}px`;
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(shell, { childList: true, subtree: true });
    window.addEventListener("resize", apply);
    return () => { observer.disconnect(); window.removeEventListener("resize", apply); for (const [element, original] of saved) element.style.fontSize = original.inline; };
  }, [preferences.size, currentPage]);
  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement;
    dialogRef.current.showModal();
    return () => { if (dialogRef.current?.open) dialogRef.current.close(); };
  }, [open]);
  useEffect(() => {
    if (!supported) return;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => { window.speechSynthesis.removeEventListener("voiceschanged", load); window.speechSynthesis.cancel(); };
  }, []);
  useEffect(() => { stop(); }, [currentPage, preferences.language, preferences.rate, preferences.voice]);

  const read = () => {
    stop();
    if (!supported) return;
    const shell = document.querySelector(".page-shell");
    const walker = document.createTreeWalker(shell, NodeFilter.SHOW_TEXT);
    const parts = [];
    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent || parent.closest("header,nav,footer,button,script,style,svg,dialog,[hidden],[aria-hidden=true]")) continue;
      if (!parent.getClientRects().length || getComputedStyle(parent).visibility === "hidden") continue;
      if (node.nodeValue.trim()) parts.push(node.nodeValue.trim());
    }
    const text = parts.join(". ");
    if (!text) { setReading("Nenhum texto disponível"); return; }
    const chunks = text.match(/.{1,180}(?:\s|$)|\S{1,180}/g) || [text];
    const id = speechId.current;
    const language = A11Y_LANGUAGES.find(([code]) => code === preferences.language)[2];
    const voice = voices.find((item) => item.voiceURI === preferences.voice && item.lang.startsWith(preferences.language)) || voices.find((item) => item.lang.toLowerCase() === language.toLowerCase()) || voices.find((item) => item.lang.startsWith(preferences.language));
    let index = 0;
    const next = () => {
      if (id !== speechId.current) return;
      if (index >= chunks.length) { setReading("Concluído"); return; }
      const utterance = new SpeechSynthesisUtterance(chunks[index++]);
      utteranceRef.current = utterance;
      utterance.lang = language;
      utterance.rate = preferences.rate;
      if (voice) utterance.voice = voice;
      utterance.onend = next;
      utterance.onerror = (event) => { if (id === speechId.current && event.error !== "canceled" && event.error !== "interrupted") setReading("Não foi possível iniciar a voz. Verifique as vozes do navegador."); };
      window.speechSynthesis.speak(utterance);
    };
    setReading("Lendo");
    next();
  };
  const close = () => { dialogRef.current.close(); };
  const toggle = (key, title, icon) => <button type="button" className="a11y-card" aria-pressed={preferences[key]} onClick={() => update(key, !preferences[key])}><i className={`bi bi-${({ text: "type", eye: "eye", moon: "moon", sun: "circle-half", cursor: "cursor", link: "link-45deg" })[icon]}`} aria-hidden="true" /><span>{t(title)}</span><span className="a11y-state" aria-hidden="true">{preferences[key] ? "✓" : "+"}</span></button>;
  return (
    <dialog id="a11y-panel" ref={dialogRef} className="a11y-panel" translate="no" aria-labelledby="a11y-title" onClose={() => { setOpen(false); triggerRef.current?.focus(); }} onClick={(event) => { if (event.target === dialogRef.current) { const rect = dialogRef.current.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close(); } }}>
      <div className="a11y-heading"><h2 id="a11y-title"><AccessibilitySymbol />{t("Acessibilidade")}</h2><button type="button" onClick={close} aria-label={t("Fechar opções de acessibilidade")}>×</button></div>
      <section aria-label={t("Fonte e texto")}><h3>{t("Fonte e texto")}</h3><div className="a11y-font"><button type="button" aria-label={t("Diminuir fonte")} disabled={preferences.size <= 80} onClick={() => update("size", Math.max(80, preferences.size - 10))}>A−</button><output aria-live="polite">{preferences.size}%</output><button type="button" aria-label={t("Aumentar fonte")} disabled={preferences.size >= 150} onClick={() => update("size", Math.min(150, preferences.size + 10))}>A+</button><button type="button" onClick={() => update("size", 100)}>{t("Restaurar fonte")}</button></div></section>
      <div className="a11y-grid">{toggle("readable", "Fonte legível", "text")}{toggle("contrast", "Alto contraste", "eye")}{toggle("dark", "Modo escuro", "moon")}{toggle("invert", "Inverter cores", "sun")}{toggle("cursor", "Cursor ampliado", "cursor")}{toggle("links", "Destacar links", "link")}{toggle("focus", "Foco do teclado", "eye")}</div>
      <section className="a11y-reading"><h3>{t("Leitura em voz alta")}</h3>{supported ? <><div className="a11y-speech"><button type="button" onClick={read}>{t("▶ Ler")}</button><button type="button" disabled={reading !== "Lendo" && reading !== "Pausado"} onClick={() => { if (reading === "Pausado") { window.speechSynthesis.resume(); setReading("Lendo"); } else { window.speechSynthesis.pause(); setReading("Pausado"); } }}>{t(reading === "Pausado" ? "Retomar" : "Pausar")}</button><button type="button" onClick={stop}>{t("■ Parar")}</button></div><label>{t("Velocidade")}<output>{preferences.rate}×</output><input type="range" min="0.5" max="2" step="0.1" value={preferences.rate} onChange={(event) => update("rate", Number(event.target.value))} /></label><label>{t("Voz")}<select value={preferences.voice} onChange={(event) => update("voice", event.target.value)}><option value="">{t("Automática para o idioma")}</option>{voices.filter((voice) => voice.lang.startsWith(preferences.language)).map((voice) => <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name} ({voice.lang})</option>)}</select></label><p role="status">{t(reading)}</p></> : <p role="status">{t("Leitura em voz alta indisponível neste navegador.")}</p>}</section>
      <section className="a11y-language"><label>{t("Idioma")}<select value={preferences.language} onChange={(event) => { update("language", event.target.value); update("voice", ""); }}>{A11Y_LANGUAGES.map(([code, label]) => <option key={code} value={code}>{label}</option>)}</select></label><p className="a11y-note">{t("Tradução automática via MyMemory. Requer internet e está sujeita à cota do serviço.")}</p><p role="status" data-a11y-status translate="no">{t(translationStatus)}</p></section>
      <button type="button" className="a11y-reset" onClick={() => { stop(); setPreferences({ ...A11Y_DEFAULTS }); }}>{t("Restaurar padrão")}</button>
    </dialog>
  );
}
