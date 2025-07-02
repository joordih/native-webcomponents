class PageComponent extends HTMLElement {
  private shadow: ShadowRoot;
  private routes: { [key: string]: string } = {};

  static get observedAttributes() {
    return ['base-path'];
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  public async connectedCallback(): Promise<void> {
    await this.getRoutes();
    this.render();
    window.onpopstate = () => this.render();
  }

  public handleRouteChange(): void {
    this.render();
  }

  public async getRoutes(): Promise<void> {
    const response = await fetch('http://localhost:8080/api/landing/routes');

    if (response.ok) {
      const routes = await response.json();
      this.routes = routes;
    } else {
      const error = await response.json();

      if (error.redirection) {
        window.location.href = error.redirection;
      }
    }
  }

  public render(): void {
    const path: string = window.location.pathname;
    window.console.log(path);
    this.getTemplate(path);
  }

  public getTemplate(path: string): void {
    const pagePath = path.replace('/landing', '') || '/';

    const route = this.routes[pagePath];
    const pageTitle = route ? route.charAt(0).toUpperCase() + route.slice(1) : '404';

    document.title = pageTitle + ' | LANDING' || '404';

    this.loadPage(route || '404');
  }

  public async loadPage(fileName: string): Promise<void> {
    window.console.log(fileName);
    const htmlResponse = await fetch('./src/components/' + fileName + '/' + fileName + '-component.html');

    const css = await import(`./${fileName}/${fileName}-component.css?raw`);
    this.setupStyles(css.default);

    await import(`./${fileName}/${fileName}-component.ts`)
      .catch(err => console.error(`Error loading ${fileName} component JS:`, err));

    const html = await htmlResponse.text();

    if (!document.startViewTransition) {
      this.shadow.innerHTML = html;
      document.documentElement.scrollTop = 0;
      return;
    }

    document.startViewTransition(() => {
      this.shadow.innerHTML = html;
      document.documentElement.scrollTop = 0;
    });
  }

  public async setupStyles(css: string): Promise<void> {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    this.shadow.adoptedStyleSheets = [sheet];
  }
}

customElements.define('page-component', PageComponent);