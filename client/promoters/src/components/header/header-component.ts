class Header extends HTMLElement {
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.title = this.getAttribute("title") || "Admin Panel";
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadow.innerHTML = `
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

    <header>
      <nav>
        <title-component title="${this.title}"></title-component>
        <menu-component></menu-component>
      </nav>
    </header>
    `;
  }
}

customElements.define("header-component", Header);
