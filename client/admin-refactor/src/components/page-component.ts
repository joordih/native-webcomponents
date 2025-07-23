type RouteMap = Record<string, string>;
type CssModule = { default: string };

class PageComponent extends HTMLElement {
  private readonly shadowRootRef = this.attachShadow({ mode: "open" });
  private routes: RouteMap = {};
  private basePath = "/admin";
  private controller?: AbortController;

  static get observedAttributes() {
    return ["base-path", "routes-endpoint"];
  }

  attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null
  ): void {
    if (!value) return;
    if (name === "base-path") this.basePath = value;
    if (name === "routes-endpoint") this.loadRoutes(value);
  }

  connectedCallback(): void {
    window.addEventListener("popstate", this.render);
    this.loadRoutes(
      this.getAttribute("routes-endpoint") ??
        "http://localhost:8080/api/admin/routes"
    );
  }

  disconnectedCallback(): void {
    window.removeEventListener("popstate", this.render);
    this.controller?.abort();
  }

  private loadRoutes = async (endpoint: string): Promise<void> => {
    this.controller?.abort();
    this.controller = new AbortController();
    const res = await fetch(endpoint, { signal: this.controller.signal }).catch(
      () => undefined
    );
    if (!res?.ok) {
      const err = (await res?.json().catch(() => undefined)) as
        | { redirection?: string }
        | undefined;
      if (err?.redirection) window.location.href = err.redirection;
      return;
    }
    this.routes = (await res.json()) as RouteMap;
    this.render();
  };

  private render = (): void => {
    const path = window.location.pathname.replace(this.basePath, "") || "/";
    const pageKey = this.routes[path] ?? "404";
    this.updateTitle(pageKey);
    this.mountPage(pageKey).catch(console.error);
  };

  private updateTitle(page: string): void {
    const name = page.charAt(0).toUpperCase() + page.slice(1);
    document.title = `${name} | AUTH`;
  }

  private mountPage = async (page: string): Promise<void> => {
    const [html, css, rootCss] = await Promise.all([
      fetch(`./src/components/${page}/${page}-component.html`).then((r) =>
        r.text()
      ),
      import(`./${page}/${page}-component.css?raw`) as Promise<CssModule>,
      import(`../assets/root.css?inline`) as Promise<CssModule>,
    ]);

    this.applyStyles(rootCss.default);
    this.applyStyles(css.default);
    import(`./${page}/${page}-component.ts`).catch((err) =>
      console.error(`Error loading ${page} component`, err)
    );

    const update = () => {
      this.shadowRootRef.innerHTML = html;
      document.documentElement.scrollTop = 0;
    };

    const doc = document as Document as {
      startViewTransition?: (cb: () => void) => void;
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    doc.startViewTransition ? doc.startViewTransition(update) : update();
  };

  private applyStyles(css: string): void {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    this.shadowRootRef.adoptedStyleSheets = [sheet];
  }
}

customElements.define("page-component", PageComponent);
