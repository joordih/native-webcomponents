class NotFoundComponent extends HTMLElement {
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  private render() {
    this.shadow.innerHTML = `
      <section>
        <h1>404</h1>
        <p>Page not found</p>
      </section>
    `;
  }
}

customElements.define("notfound-component", NotFoundComponent);
