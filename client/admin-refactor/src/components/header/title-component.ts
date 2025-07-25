interface TitleAttributes {
  title: string;
}

class TitleComponent extends HTMLElement {
  private shadow: ShadowRoot;
  private componentAttributes: TitleAttributes = {
    title: "",
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
        h1 {
          font-family: "Geist", sans-serif;
          font-weight: 700;
          font-size: 2.3rem;
          color: #f0f0f0;
          margin: 0;
        }
      </style>
    `;
  }

  private render(): void {
    this.shadow.innerHTML = `
      ${this.getStyles()}
      <h1>${this.componentAttributes.title}</h1>
    `;
  }
}

customElements.define("title-component", TitleComponent);
