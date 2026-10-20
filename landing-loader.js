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
    const filenames = ["AccessibilityWidget.jsx", "BorderGlow.jsx", "lp_nataleluia_landing_page.jsx"];
    const sources = await Promise.all(filenames.map(async (filename) => {
      const response = await fetch(`./src/${filename}?t=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error(`Não foi possível carregar ${filename}.`);
      return response.text();
    }));

    // Parse ES modules before running the classic preview. This also handles
    // CRLF, BOM, multiline imports and formatting changes made during upload.
    const previewModules = () => ({
      visitor: {
        ImportDeclaration(path) {
          const name = path.node.source.value;
          if (name !== "react" && !["./BorderGlow.jsx", "./AccessibilityWidget.jsx"].includes(name) && !name.endsWith(".css")) {
            throw path.buildCodeFrameError(`Import não suportado no preview: ${name}`);
          }
          path.remove();
        },
        ExportNamedDeclaration(path) {
          if (path.node.declaration) path.replaceWith(path.node.declaration);
          else path.remove();
        },
        ExportDefaultDeclaration(path) {
          const declaration = path.node.declaration;
          if (declaration.type === "FunctionDeclaration" || declaration.type === "ClassDeclaration") path.replaceWith(declaration);
          else path.remove();
        },
      },
    });
    const compiled = "const { useCallback, useEffect, useMemo, useRef, useState } = React;\n" + sources.map((source, index) => Babel.transform(source, {
      filename: filenames[index],
      sourceType: "module",
      plugins: [previewModules],
      presets: [["react", { runtime: "classic" }]],
    }).code).join("\n") +
      "\nconst root = ReactDOM.createRoot(document.getElementById('root'));\nroot.render(React.createElement(NataleluiaLandingPage));\n";

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
