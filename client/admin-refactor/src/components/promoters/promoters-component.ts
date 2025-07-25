import { promotersTableConfig, promotersFormConfig } from "./promoters-config";

class PromotersComponent extends HTMLElement {
  private shadow: ShadowRoot;
  private currentView: "table" | "form" = "table";
  private formMode: "create" | "edit" = "create";
  private selectedPromoter: any = null;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback(): void {
    this.setupStyles();
    this.render();
    this.setupEventListeners();
  }

  private async setupStyles(): Promise<void> {
    const styles = `
      :host {
        display: block;
        padding: 1rem;
        background: var(--bg-primary, #ffffff);
        min-height: 100vh;
      }

      @media (prefers-color-scheme: dark) {
        :host {
          background: var(--bg-primary-dark, #121212);
          color: var(--text-primary-dark, #ffffff);
        }
      }

      .promoters-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border-color, #dee2e6);
      }

      @media (prefers-color-scheme: dark) {
        .promoters-header {
          border-bottom-color: var(--border-color-dark, #404040);
        }
      }

      .promoters-header h2 {
        margin: 0;
        font-size: 1.75rem;
        font-weight: 600;
        color: var(--text-primary, #333);
      }

      @media (prefers-color-scheme: dark) {
        .promoters-header h2 {
          color: var(--text-primary-dark, #ffffff);
        }
      }

      .header-actions {
        display: flex;
        gap: 1rem;
      }

      .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
      }

      .btn-primary {
        background: var(--accent-color, #007bff);
        color: white;
      }

      .btn-primary:hover {
        background: var(--accent-color-hover, #0056b3);
      }

      .btn-secondary {
        background: var(--secondary-color, #6c757d);
        color: white;
      }

      .btn-secondary:hover {
        background: var(--secondary-color-hover, #545b62);
      }

      .btn-icon {
        width: 16px;
        height: 16px;
        fill: currentColor;
      }

      .promoters-content {
        background: var(--bg-primary, #ffffff);
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        overflow: hidden;
      }

      @media (prefers-color-scheme: dark) {
        .promoters-content {
          background: var(--bg-primary-dark, #1a1a1a);
          box-shadow: 0 2px 4px rgba(255,255,255,0.1);
        }
      }

      .view-hidden {
        display: none;
      }

      .view-visible {
        display: block;
      }
    `;

    const sheet = new CSSStyleSheet();
    sheet.replaceSync(styles);
    this.shadow.adoptedStyleSheets = [sheet];
  }

  private render(): void {
    this.shadow.innerHTML = `
      <div class="promoters-header">
        <h2>Promoters Management</h2>
        <div class="header-actions">
          <button class="btn btn-secondary back-btn ${this.currentView === "table" ? "view-hidden" : "view-visible"}">
            <svg class="btn-icon" viewBox="0 0 24 24">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Back to List
          </button>
          <button class="btn btn-primary create-btn ${this.currentView === "form" ? "view-hidden" : "view-visible"}">
            <svg class="btn-icon" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Create Promoter
          </button>
        </div>
      </div>
      
      <div class="promoters-content">
        <generic-datatable 
          class="${this.currentView === "table" ? "view-visible" : "view-hidden"}"
          config='${JSON.stringify(promotersTableConfig)}'
        ></generic-datatable>
        
        <generic-forms 
          class="${this.currentView === "form" ? "view-visible" : "view-hidden"}"
          config='${JSON.stringify(promotersFormConfig)}'
          mode="${this.formMode}"
          ${this.selectedPromoter ? `data='${JSON.stringify(this.selectedPromoter)}'` : ""}
        ></generic-forms>
      </div>
    `;
  }

  private setupEventListeners(): void {
    // Create button
    const createBtn = this.shadow.querySelector(".create-btn");
    if (createBtn) {
      createBtn.addEventListener("click", () => {
        this.showCreateForm();
      });
    }

    // Back button
    const backBtn = this.shadow.querySelector(".back-btn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        this.showTable();
      });
    }

    // Listen for datatable events
    const datatable = this.shadow.querySelector("generic-datatable");
    if (datatable) {
      datatable.addEventListener("row-action", (e: any) => {
        const { action, data } = e.detail;

        switch (action) {
          case "edit":
            this.showEditForm(data);
            break;
          case "delete":
            this.handleDelete(data);
            break;
        }
      });
    }

    // Listen for form events
    const forms = this.shadow.querySelector("generic-forms");
    if (forms) {
      forms.addEventListener("form-success", () => {
        this.showTable();
        // Refresh the datatable
        const datatable = this.shadow.querySelector("generic-datatable");
        if (datatable && typeof (datatable as any).refresh === "function") {
          (datatable as any).refresh();
        }
      });

      forms.addEventListener("form-cancel", () => {
        this.showTable();
      });
    }
  }

  private showTable(): void {
    this.currentView = "table";
    this.selectedPromoter = null;
    this.render();
    this.setupEventListeners();
  }

  private showCreateForm(): void {
    this.currentView = "form";
    this.formMode = "create";
    this.selectedPromoter = null;
    this.render();
    this.setupEventListeners();
  }

  private showEditForm(promoter: any): void {
    this.currentView = "form";
    this.formMode = "edit";
    this.selectedPromoter = promoter;
    this.render();
    this.setupEventListeners();
  }

  private async handleDelete(promoter: any): Promise<void> {
    if (
      !confirm(`Are you sure you want to delete promoter ${promoter.name}?`)
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${promotersTableConfig.apiEndpoint}/${promoter.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Refresh the datatable
        const datatable = this.shadow.querySelector("generic-datatable");
        if (datatable && typeof (datatable as any).refresh === "function") {
          (datatable as any).refresh();
        }
      } else {
        throw new Error("Failed to delete promoter");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete promoter. Please try again.");
    }
  }
}

customElements.define("promoters-component", PromotersComponent);

export default PromotersComponent;
