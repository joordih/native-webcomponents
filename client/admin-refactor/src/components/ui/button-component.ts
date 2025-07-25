interface ButtonAttributes {
  text?: string;
  background: string;
  "background-hover": string;
  "text-color": string;
  "border-radius": string;
  padding: string;
  "margin-left": string;
  "reverse-side": boolean;
}

class ButtonComponent extends HTMLElement {
  private shadow: ShadowRoot;
  private componentAttributes: ButtonAttributes = {
    text: undefined,
    background: "#4CAF50",
    "background-hover": "#45a049",
    "text-color": "#4CAF50",
    "border-radius": "0.375rem",
    padding: "0.5rem",
    "margin-left": "0",
    "reverse-side": false,
  };

  static get observedAttributes(): string[] {
    return [
      "text",
      "background",
      "background-hover",
      "text-color",
      "border-radius",
      "padding",
      "margin-left",
      "reverse-side",
    ];
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.initAttributes();
  }

  attributeChangedCallback(
    name: string,
    _oldValue: string | null,
    newValue: string | null
  ): void {
    if (newValue === null) return;

    if (name === "reverse-side") {
      this.componentAttributes[name] = newValue === "true";
    } else {
      (this.componentAttributes as any)[name] = newValue;
    }

    if (this.isConnected) {
      this.render();
    }
  }

  connectedCallback(): void {
    this.render();
  }

  private initAttributes(): void {
    Object.keys(this.componentAttributes).forEach((attr) => {
      const value = this.getAttribute(attr);
      if (value !== null) {
        if (attr === "reverse-side") {
          this.componentAttributes[attr] = value === "true";
        } else {
          (this.componentAttributes as any)[attr] = value;
        }
      }
    });
  }

  private getStyles(): string {
    return `
      <style>
        .button {
          display: flex;
          align-items: center;
          cursor: pointer;
          background-color: ${this.componentAttributes.background};
          padding: ${this.componentAttributes.padding};
          width: 100%;
          border-radius: ${this.componentAttributes["border-radius"]};
          transition: background-color 0.1s ease;
          border: none;
          margin-left: ${this.componentAttributes["margin-left"]};
          border: 1px transparent solid;
        }

        .button:hover {
          background-color: ${this.componentAttributes["background-hover"]};
        }

        .button:active {
          border: 1px solid ${this.componentAttributes["text-color"]};
        }

        .button-text {
          font-size: 0.875rem;
          color: ${this.componentAttributes["text-color"]};
          font-weight: bold;
        }

        ::slotted(svg) {
          fill: ${this.componentAttributes["text-color"]};
          ${this.getIconMargin()}
        }
      </style>
    `;
  }

  private getIconMargin(): string {
    if (!this.componentAttributes.text) return "";
    return this.componentAttributes["reverse-side"]
      ? "margin-left: 0.5rem;"
      : "margin-right: 0.5rem;";
  }

  private getButtonContent(): string {
    const text = this.componentAttributes.text
      ? `<span class="button-text">${this.componentAttributes.text}</span>`
      : "";

    return this.componentAttributes["reverse-side"]
      ? `${text}<slot></slot>`
      : `<slot></slot>${text}`;
  }

  private render(): void {
    this.shadow.innerHTML = `
      ${this.getStyles()}
      <button 
        title="${this.componentAttributes.text || ""}" 
        class="button">
        ${this.getButtonContent()}
      </button>
    `;
  }
}

customElements.define("button-component", ButtonComponent);
