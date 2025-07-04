import css from "./promoters-component.css?raw";
import "./header-component";
import "./datatable-component";
import "./filters-component";
import "./forms-component";
import "./overview-component";

interface PromoterComponentMethods {
  applyFilters: (filters: Record<string, unknown>) => void;
  refreshData: () => void;
  showEditForm: (promoter: Record<string, unknown>) => void;
  showCreateForm: () => void;
  refreshStats: () => void;
  toggle: () => void;
}

interface PromoterEventDetail {
  filters?: Record<string, unknown>;
  promoter?: Record<string, unknown>;
}

class PromotersComponent extends HTMLElement {
  private shadow: ShadowRoot;
  private filtersComponent:
    | (HTMLElement & Partial<PromoterComponentMethods>)
    | null = null;
  private formsComponent:
    | (HTMLElement & Partial<PromoterComponentMethods>)
    | null = null;
  private datatableComponent:
    | (HTMLElement & Partial<PromoterComponentMethods>)
    | null = null;
  private overviewComponent:
    | (HTMLElement & Partial<PromoterComponentMethods>)
    | null = null;

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
    this.setupComponents();
    this.setupEventListeners();
  }

  private setupComponents(): void {
    setTimeout(() => {
      this.filtersComponent = document.querySelector("filters-component");
      this.formsComponent = document.querySelector("forms-component");
      this.datatableComponent = document.querySelector("datatable-component");
      this.overviewComponent = document.querySelector("overview-component");
    }, 0);
  }

  private setupEventListeners(): void {
    setTimeout(() => {
      this.filtersComponent?.addEventListener(
        "filtersChanged",
        (event: Event) => {
          const customEvent = event as CustomEvent<PromoterEventDetail>;
          this.datatableComponent?.applyFilters?.(
            customEvent.detail.filters || {}
          );
        }
      );

      this.datatableComponent?.addEventListener(
        "editPromoter",
        (event: Event) => {
          const customEvent = event as CustomEvent<PromoterEventDetail>;
          this.formsComponent?.showEditForm?.(
            customEvent.detail.promoter || {}
          );
        }
      );

      this.datatableComponent?.addEventListener(
        "deletePromoter",
        (event: Event) => {
          const customEvent = event as CustomEvent<PromoterEventDetail>;
          this.handleDeletePromoter(customEvent.detail.promoter || {});
        }
      );

      this.formsComponent?.addEventListener("promoterSaved", () => {
        this.datatableComponent?.refreshData?.();
        this.overviewComponent?.refreshStats?.();
      });
    }, 100);
  }

  private async handleDeletePromoter(
    promoter: Record<string, unknown>
  ): Promise<void> {
    const confirmed = confirm(
      `¿Estás seguro de que quieres eliminar al promoter "${promoter.name}"?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/promoters/${promoter.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        this.datatableComponent?.refreshData?.();
        this.overviewComponent?.refreshStats?.();
        this.showSuccessMessage("Promoter eliminado exitosamente");
      } else {
        throw new Error("Error al eliminar el promoter");
      }
    } catch (error) {
      console.error("Error deleting promoter:", error);
      this.showErrorMessage(
        "Error al eliminar el promoter. Inténtalo de nuevo."
      );
    }
  }

  private showSuccessMessage(message: string): void {
    this.showMessage(message, "success");
  }

  private showErrorMessage(message: string): void {
    this.showMessage(message, "error");
  }

  private showMessage(message: string, type: "success" | "error"): void {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 16px;
      border-radius: 6px;
      z-index: 10000;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      ${
        type === "success"
          ? "background: #10b981; color: white;"
          : "background: #ef4444; color: white;"
      }
    `;

    document.body.appendChild(messageDiv);

    setTimeout(() => {
      messageDiv.remove();
    }, 5000);
  }

  private render(): void {
    this.shadow.innerHTML = `<slot></slot>`;
  }
}

customElements.define("promoters-component", PromotersComponent);
