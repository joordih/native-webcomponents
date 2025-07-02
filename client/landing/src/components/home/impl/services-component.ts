import css from './services-component.css?inline';

class ServicesComponent extends HTMLElement {
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.loadStyles();
  }

  private loadStyles(): void {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    this.shadow.adoptedStyleSheets = [sheet];
  }
  connectedCallback() {
    this.render();
  }

  render() {
    this.shadow.innerHTML = /* html */ `
    <div class="container">
      <div class="item">
        <h2>Telegram bot</h2>
        <p>Telegram bots development</p>
      </div>
      <div class="item">2</div>
      <div class="item">3</div>
      <div class="item">4</div>
      <div class="item">5</div>
      <div class="item">6</div>
      <div class="item">7</div>
      <div class="item">8</div>
      <div class="item">9</div>
    </div>
    `;
  }
} 

customElements.define('services-component', ServicesComponent);