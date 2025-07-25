interface HeaderAttributes {
  title: string;
}

class HeaderComponent extends HTMLElement {
  private shadow: ShadowRoot;
  private componentAttributes: HeaderAttributes = {
    title: "Admin Panel",
  };

  static get observedAttributes(): string[] {
    return ["title"];
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.initializeAttributes();
  }

  attributeChangedCallback(
    name: string,
    _oldValue: string | null,
    newValue: string | null
  ): void {
    if (!newValue) return;

    if (name === "title") {
      this.componentAttributes.title = newValue;
      this.render();
    }
  }

  connectedCallback(): void {
    this.render();
  }

  private initializeAttributes(): void {
    const titleAttr = this.getAttribute("title");
    if (titleAttr) {
      this.componentAttributes.title = titleAttr;
    }
  }

  private getStyles(): string {
    return `
      <style>
        header {
          color: #f0f0f0;
          padding: 0.5rem;
        }

        nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      </style>
    `;
  }

  private render(): void {
    this.shadow.innerHTML = `
      ${this.getStyles()}
      <header>
        <nav>
          <title-component title="${this.componentAttributes.title}"></title-component>
          <menu-component></menu-component>
        </nav>
      </header>
    `;
  }
}

customElements.define("header-component", HeaderComponent);
