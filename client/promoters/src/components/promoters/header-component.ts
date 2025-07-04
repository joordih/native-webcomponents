import css from "../../assets/components/promoters/promoters.css?raw";

class HeaderComponent extends HTMLElement {
  private shadow: ShadowRoot;

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

  connectedCallback(): void {
    this.render();
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    const filterToggle = this.shadow.querySelector("#filter-toggle");
    filterToggle?.addEventListener("click", () => {
      const filtersComponent = document.querySelector("filters-component");
      (filtersComponent as any)?.toggle();
    });

    const addButton = this.shadow.querySelector("#add-promoter");
    addButton?.addEventListener("click", () => {
      const formsComponent = document.querySelector("forms-component");
      (formsComponent as any)?.showCreateForm();
    });
  }

  private render(): void {
    this.shadow.innerHTML = `
      <div class="promoters-container">
        <div class="promoters-header">
          <h1 class="promoters-title">Gestión de Promoters</h1>
          <div class="promoters-actions">
            <button class="action-button secondary" id="filter-toggle">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon>
              </svg>
              Filtros
            </button>
            <button class="action-button primary" id="add-promoter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Agregar Promoter
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("header-component", HeaderComponent);

export default HeaderComponent;
