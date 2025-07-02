import UIkit from "uikit";

import css from "./navbar-component.css?raw";
import logo from "./svgs/icon.svg?raw";

class NavbarComponent extends HTMLElement {
  private shadow: ShadowRoot;

  static get observedAttributes() {
    return [];
  }

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.loadStyles();
  }

  private loadStyles(): void {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    this.shadow.adoptedStyleSheets = [sheet];
  }

  public connectedCallback() {
    this.render();
  }

  public attributeChangedCallback() { }
  public updateAttributes() { }

  public render() {
    this.shadow.innerHTML = /* html */ `
      <header id="header">
        <div class="uk-transition-toggle uk-inline-clip" tabindex="0">
          <nav class="uk-position-z-index uk-transition-slide-top-sm" data-uk-sticky="start: !#header; offset: 0;">
            <a href="">
              ${logo}
              <span class="uk-navbar-brand-text">Landing</span>
            </a>
            <a href="">Home</a>
            <a href="">Land</a>
          </nav>
        </div>
      </header>
    `;

    UIkit.sticky(this.shadow.querySelector("nav"), {
      start: "!#header",
      animation: "uk-animation-slide-top",
      offset: 0,
      clsActive: "uk-navbar-sticky",
      clsInactive: "uk-navbar-static",
      top: 0,
    });
  }
}

customElements.define("navbar-component", NavbarComponent);
