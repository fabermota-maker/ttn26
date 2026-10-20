function showPreviewError(error) {
  const root = document.getElementById("root");
  root.innerHTML = `
    <div class="preview-error">
      <div class="preview-box">
        <h1 style="margin-top:0">Falha ao abrir o preview</h1>
        <p>O Cursor nao conseguiu montar a pagina a partir do JSX original.</p>
        <pre>${String(error && error.stack ? error.stack : error)}</pre>
      </div>
    </div>
  `;
  console.error(error);
}

async function startPreview() {
  try {
    const response = await fetch("./src/lp_nataleluia_landing_page.jsx", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Nao foi possivel carregar o arquivo JSX original.");
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

    source += "\n\nconst root = ReactDOM.createRoot(document.getElementById('root'));\nroot.render(<NataleluiaLandingPage />);\n";

    const compiled = Babel.transform(source, {
      presets: [["react", { runtime: "classic" }]],
    }).code;

    const executable =
      "const React = window.React; const ReactDOM = window.ReactDOM;\n" +
      compiled;

    new Function(executable)();
  } catch (error) {
    showPreviewError(error);
  }
}

startPreview();
