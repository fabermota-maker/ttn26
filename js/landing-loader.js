function showLandingPageError(error) {
  hideLpBootScreen();
  const root = document.getElementById("root");
  root.innerHTML = `
    <div class="lp-error">
      <div class="lp-box">
        <h1 style="margin-top:0">Falha ao carregar a landing page</h1>
        <p>Nao foi possivel montar a pagina a partir do JSX.</p>
        <pre>${String(error && error.stack ? error.stack : error)}</pre>
      </div>
    </div>
  `;
  console.error(error);
}

window.addEventListener("error", (event) => {
  showLandingPageError(event.error || event.message);
});

window.addEventListener("unhandledrejection", (event) => {
  showLandingPageError(event.reason || "Promise rejeitada ao carregar a LP.");
});

async function startLandingPage() {
  try {
    const response = await fetch(`./src/lp_nataleluia_landing_page.jsx?t=${Date.now()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Nao foi possivel carregar o arquivo da landing page.");
    }

    let source = await response.text();

    source = source.replace(
      /^import React, \{ useEffect, useMemo, useRef, useState \} from "react";\s*/m,
      "const { useEffect, useMemo, useRef, useState } = React;\n\n"
    );

    source = source.replace(
      /export default function NataleluiaLandingPage\(\)/,
      "function NataleluiaLandingPage()"
    );

    source +=
      "\n\nconst root = ReactDOM.createRoot(document.getElementById('root'));\nroot.render(<NataleluiaLandingPage />);\n";

    const compiled = Babel.transform(source, {
      presets: [["react", { runtime: "classic" }]],
    }).code;

    const executable =
      "const React = window.React; const ReactDOM = window.ReactDOM;\n" +
      compiled;

    new Function(executable)();
    revealLandingWhenReady();
  } catch (error) {
    showLandingPageError(error);
  }
}

startLandingPage();
