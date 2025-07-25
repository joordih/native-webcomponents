import { store } from "@redux/store";
import createIcon from "@icons/create-icon.svg?raw";
import deleteIcon from "@icons/delete-icon.svg?raw";
import saveIcon from "@icons/save-icon.svg?raw";

interface FormField {
  id: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "select"
    | "textarea"
    | "date";
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: (value: string) => string | null;
}

interface FormTab {
  id: string;
  label: string;
  icon?: string;
  fields: FormField[];
}

interface GenericFormsConfig {
  title: string;
  tabs: FormTab[];
  apiEndpoint: string;
  entityName: string;
  reduxSlice?: {
    selector: (state: any) => any;
    actions: {
      setCurrentTab: (tab: string) => any;
      addElement: (element: { id: string; element: any }) => any;
      incrementCount: () => any;
      setQueuedUpdate: (value: boolean) => any;
    };
  };
}

interface FormData {
  [key: string]: string;
}

class GenericForms extends HTMLElement {
  private shadow: ShadowRoot;
  private config!: GenericFormsConfig;
  private currentTab = "";
  private formData: FormData = {};
  private isEditMode = false;
  private unsubscribe?: () => void;
  private errors: Record<string, string> = {};

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  static get observedAttributes(): string[] {
    return ["config", "data", "mode"];
  }

  attributeChangedCallback(
    name: string,
    _oldValue: string | null,
    newValue: string | null
  ): void {
    if (!newValue) return;

    try {
      switch (name) {
        case "config":
          this.config = JSON.parse(newValue);
          if (this.config.tabs.length > 0 && !this.currentTab) {
            this.currentTab = this.config.tabs[0].id;
          }
          this.setupReduxSubscription();
          this.render();
          break;
        case "data":
          this.formData = JSON.parse(newValue);
          this.render();
          break;
        case "mode":
          this.isEditMode = newValue === "edit";
          this.render();
          break;
      }
    } catch (error) {
      console.error(`Error parsing ${name}:`, error);
    }
  }

  public setConfig(config: GenericFormsConfig): void {
    this.config = config;
    if (this.config.tabs.length > 0 && !this.currentTab) {
      this.currentTab = this.config.tabs[0].id;
    }
    this.setupReduxSubscription();
    this.render();
  }

  connectedCallback(): void {
    this.setupStyles();
  }

  disconnectedCallback(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  private async setupStyles(): Promise<void> {
    const styles = `
      :host {
        display: block;
        background: var(--bg-primary, #ffffff);
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        overflow: hidden;
      }

      @media (prefers-color-scheme: dark) {
        :host {
          background: var(--bg-primary-dark, #1a1a1a);
          color: var(--text-primary-dark, #ffffff);
        }
      }

      .forms-header {
        background: var(--bg-secondary, #f8f9fa);
        padding: 1rem;
        border-bottom: 1px solid var(--border-color, #dee2e6);
      }

      @media (prefers-color-scheme: dark) {
        .forms-header {
          background: var(--bg-secondary-dark, #2d2d2d);
          border-bottom-color: var(--border-color-dark, #404040);
        }
      }

      .forms-header h3 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-primary, #333);
      }

      @media (prefers-color-scheme: dark) {
        .forms-header h3 {
          color: var(--text-primary-dark, #ffffff);
        }
      }

      .header {
        display: flex;
        background: var(--bg-secondary, #f8f9fa);
        border-bottom: 1px solid var(--border-color, #dee2e6);
      }

      @media (prefers-color-scheme: dark) {
        .header {
          background: var(--bg-secondary-dark, #2d2d2d);
          border-bottom-color: var(--border-color-dark, #404040);
        }
      }

      .tab {
        flex: 1;
        border-right: 1px solid var(--border-color, #dee2e6);
      }

      @media (prefers-color-scheme: dark) {
        .tab {
          border-right-color: var(--border-color-dark, #404040);
        }
      }

      .tab:last-child {
        border-right: none;
      }

      .tab a {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 1rem;
        text-decoration: none;
        color: var(--text-secondary, #666);
        font-weight: 500;
        transition: all 0.2s;
        background: transparent;
        border: none;
        width: 100%;
        cursor: pointer;
      }

      @media (prefers-color-scheme: dark) {
        .tab a {
          color: var(--text-secondary-dark, #cccccc);
        }
      }

      .tab a:hover {
        background: var(--bg-hover, #e9ecef);
        color: var(--text-primary, #333);
      }

      @media (prefers-color-scheme: dark) {
        .tab a:hover {
          background: var(--bg-hover-dark, #404040);
          color: var(--text-primary-dark, #ffffff);
        }
      }

      .tab a.active {
        background: var(--bg-primary, #ffffff);
        color: var(--accent-color, #007bff);
        border-bottom: 2px solid var(--accent-color, #007bff);
      }

      @media (prefers-color-scheme: dark) {
        .tab a.active {
          background: var(--bg-primary-dark, #1a1a1a);
          color: var(--accent-color, #007bff);
        }
      }

      .tab-icon {
        width: 16px;
        height: 16px;
        fill: currentColor;
      }

      .tab-content {
        padding: 2rem;
      }

      .tab-panel {
        display: none;
      }

      .tab-panel.active {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
      }

      .form-group label {
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: var(--text-primary, #333);
        font-size: 0.875rem;
      }

      @media (prefers-color-scheme: dark) {
        .form-group label {
          color: var(--text-primary-dark, #ffffff);
        }
      }

      .form-group label.required::after {
        content: ' *';
        color: var(--error-color, #dc3545);
      }

      .form-group input,
      .form-group select,
      .form-group textarea {
        padding: 0.75rem;
        border: 1px solid var(--border-color, #ddd);
        border-radius: 4px;
        font-size: 0.875rem;
        background: var(--bg-primary, #ffffff);
        color: var(--text-primary, #333);
        transition: border-color 0.2s, box-shadow 0.2s;
      }

      @media (prefers-color-scheme: dark) {
        .form-group input,
        .form-group select,
        .form-group textarea {
          background: var(--bg-primary-dark, #1a1a1a);
          color: var(--text-primary-dark, #ffffff);
          border-color: var(--border-color-dark, #404040);
        }
      }

      .form-group input:focus,
      .form-group select:focus,
      .form-group textarea:focus {
        outline: none;
        border-color: var(--accent-color, #007bff);
        box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
      }

      .form-group textarea {
        resize: vertical;
        min-height: 100px;
      }

      .form-group.error input,
      .form-group.error select,
      .form-group.error textarea {
        border-color: var(--error-color, #dc3545);
      }

      .error-message {
        color: var(--error-color, #dc3545);
        font-size: 0.75rem;
        margin-top: 0.25rem;
      }

      .success-message {
        color: var(--success-color, #28a745);
        font-size: 0.75rem;
        margin-top: 0.25rem;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        padding: 1.5rem 2rem;
        border-top: 1px solid var(--border-color, #dee2e6);
        background: var(--bg-secondary, #f8f9fa);
      }

      @media (prefers-color-scheme: dark) {
        .form-actions {
          background: var(--bg-secondary-dark, #2d2d2d);
          border-top-color: var(--border-color-dark, #404040);
        }
      }

      .form-actions button {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .save-button {
        background: var(--success-color, #28a745);
        color: white;
      }

      .save-button:hover {
        background: var(--success-color-hover, #218838);
      }

      .save-button:disabled {
        background: var(--disabled-color, #6c757d);
        cursor: not-allowed;
      }

      .cancel-button {
        background: var(--secondary-color, #6c757d);
        color: white;
      }

      .cancel-button:hover {
        background: var(--secondary-color-hover, #545b62);
      }

      .create-button {
        background: var(--accent-color, #007bff);
        color: white;
      }

      .create-button:hover {
        background: var(--accent-color-hover, #0056b3);
      }

      .button-icon {
        width: 16px;
        height: 16px;
        fill: currentColor;
      }

      .loading {
        opacity: 0.6;
        pointer-events: none;
      }

      .loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin: -10px 0 0 -10px;
        border: 2px solid transparent;
        border-top: 2px solid var(--accent-color, #007bff);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;

    const sheet = new CSSStyleSheet();
    sheet.replaceSync(styles);
    this.shadow.adoptedStyleSheets = [sheet];
  }

  private setupReduxSubscription(): void {
    if (!this.config.reduxSlice) return;

    this.unsubscribe = store.subscribe(() => {
      const state = this.config.reduxSlice!.selector(store.getState());
      this.updateInputValues(state.inputs || {});
      this.updateTabVisibility(state.currentTab || this.currentTab);
    });
  }

  private updateInputValues(inputs: Record<string, any>): void {
    for (const [id, input] of Object.entries(inputs)) {
      const element = this.shadow.querySelector(`#${id}`) as HTMLInputElement;
      if (element) {
        element.value = input.value || "";
      }
    }
  }

  private updateTabVisibility(currentTab: string): void {
    this.currentTab = currentTab;

    // Update tab buttons
    this.shadow.querySelectorAll(".tab a").forEach((button) => {
      const tabId = button.getAttribute("href")?.replace("#", "");
      if (tabId === currentTab) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });

    // Update tab panels
    this.shadow.querySelectorAll(".tab-panel").forEach((panel) => {
      const panelId = panel.getAttribute("data-tab");
      if (panelId === currentTab) {
        panel.classList.add("active");
      } else {
        panel.classList.remove("active");
      }
    });
  }

  private validateField(field: FormField, value: string): string | null {
    if (field.required && !value.trim()) {
      return `${field.label} is required`;
    }

    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address";
      }
    }

    if (field.validation) {
      return field.validation(value);
    }

    return null;
  }

  private validateForm(): boolean {
    this.errors = {};
    let isValid = true;

    const currentTabConfig = this.config.tabs.find(
      (tab) => tab.id === this.currentTab
    );
    if (!currentTabConfig) return false;

    currentTabConfig.fields.forEach((field) => {
      const element = this.shadow.querySelector(
        `#${field.id}`
      ) as HTMLInputElement;
      if (element) {
        const error = this.validateField(field, element.value);
        if (error) {
          this.errors[field.id] = error;
          isValid = false;
        }
      }
    });

    this.updateErrorDisplay();
    return isValid;
  }

  private updateErrorDisplay(): void {
    Object.keys(this.errors).forEach((fieldId) => {
      const formGroup = this.shadow
        .querySelector(`#${fieldId}`)
        ?.closest(".form-group");
      if (formGroup) {
        formGroup.classList.add("error");

        let errorElement = formGroup.querySelector(".error-message");
        if (!errorElement) {
          errorElement = document.createElement("div");
          errorElement.className = "error-message";
          formGroup.appendChild(errorElement);
        }
        errorElement.textContent = this.errors[fieldId];
      }
    });

    // Clear errors for valid fields
    this.shadow.querySelectorAll(".form-group").forEach((group) => {
      const input = group.querySelector(
        "input, select, textarea"
      ) as HTMLInputElement;
      if (input && !this.errors[input.id]) {
        group.classList.remove("error");
        const errorElement = group.querySelector(".error-message");
        if (errorElement) {
          errorElement.remove();
        }
      }
    });
  }

  private getFormData(): FormData {
    const formData: FormData = {};
    const currentTabConfig = this.config.tabs.find(
      (tab) => tab.id === this.currentTab
    );

    if (currentTabConfig) {
      currentTabConfig.fields.forEach((field) => {
        const element = this.shadow.querySelector(
          `#${field.id}`
        ) as HTMLInputElement;
        if (element) {
          formData[field.id] = element.value;
        }
      });
    }

    return formData;
  }

  private async handleSubmit(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    const formData = this.getFormData();
    const method = this.isEditMode ? "PUT" : "POST";
    const url = this.isEditMode
      ? `${this.config.apiEndpoint}/${formData.id}`
      : this.config.apiEndpoint;

    try {
      this.setLoading(true);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        if (this.config.reduxSlice) {
          if (!this.isEditMode) {
            store.dispatch(this.config.reduxSlice.actions.incrementCount());
          }
          store.dispatch(this.config.reduxSlice.actions.setQueuedUpdate(true));
        }

        this.clearForm();
        this.showSuccessMessage(
          `${this.config.entityName} ${this.isEditMode ? "updated" : "created"} successfully`
        );

        // Emit success event
        this.dispatchEvent(
          new CustomEvent("form-success", {
            detail: {
              data: formData,
              mode: this.isEditMode ? "edit" : "create",
            },
            bubbles: true,
          })
        );
      } else {
        throw new Error(
          `Failed to ${this.isEditMode ? "update" : "create"} ${this.config.entityName}`
        );
      }
    } catch (error) {
      console.error("Form submission error:", error);
      this.showErrorMessage(
        `Failed to ${this.isEditMode ? "update" : "create"} ${this.config.entityName}`
      );
    } finally {
      this.setLoading(false);
    }
  }

  private clearForm(): void {
    this.shadow
      .querySelectorAll("input, select, textarea")
      .forEach((element) => {
        const input = element as HTMLInputElement;
        input.value = "";

        if (this.config.reduxSlice) {
          store.dispatch(
            this.config.reduxSlice.actions.addElement({
              id: input.id,
              element: {
                value: "",
                type: input.type || undefined,
                placeholder: input.placeholder,
              },
            })
          );
        }
      });

    this.errors = {};
    this.updateErrorDisplay();
  }

  private setLoading(loading: boolean): void {
    const container = this.shadow.querySelector(".tab-content");
    if (container) {
      if (loading) {
        container.classList.add("loading");
      } else {
        container.classList.remove("loading");
      }
    }
  }

  private showSuccessMessage(message: string): void {
    // Remove existing messages
    this.shadow
      .querySelectorAll(".success-message, .error-message")
      .forEach((el) => {
        if (el.parentElement?.classList.contains("form-actions")) {
          el.remove();
        }
      });

    const actionsContainer = this.shadow.querySelector(".form-actions");
    if (actionsContainer) {
      const messageElement = document.createElement("div");
      messageElement.className = "success-message";
      messageElement.textContent = message;
      actionsContainer.insertBefore(
        messageElement,
        actionsContainer.firstChild
      );

      setTimeout(() => messageElement.remove(), 3000);
    }
  }

  private showErrorMessage(message: string): void {
    // Remove existing messages
    this.shadow
      .querySelectorAll(".success-message, .error-message")
      .forEach((el) => {
        if (el.parentElement?.classList.contains("form-actions")) {
          el.remove();
        }
      });

    const actionsContainer = this.shadow.querySelector(".form-actions");
    if (actionsContainer) {
      const messageElement = document.createElement("div");
      messageElement.className = "error-message";
      messageElement.textContent = message;
      actionsContainer.insertBefore(
        messageElement,
        actionsContainer.firstChild
      );

      setTimeout(() => messageElement.remove(), 5000);
    }
  }

  private render(): void {
    if (!this.config) return;

    this.shadow.innerHTML = `
      <div class="forms-header">
        <h3>${this.config.title}</h3>
      </div>
      
      <div class="header">
        ${this.config.tabs
          .map(
            (tab) => `
          <div class="tab">
            <a href="#${tab.id}" class="${this.currentTab === tab.id ? "active" : ""}">
              ${tab.icon ? `<div class="tab-icon">${tab.icon}</div>` : ""}
              ${tab.label}
            </a>
          </div>
        `
          )
          .join("")}
      </div>
      
      <div class="tab-content">
        ${this.config.tabs
          .map(
            (tab) => `
          <div class="tab-panel ${this.currentTab === tab.id ? "active" : ""}" data-tab="${tab.id}">
            ${tab.fields.map((field) => this.renderField(field)).join("")}
          </div>
        `
          )
          .join("")}
      </div>
      
      <div class="form-actions">
        <button type="button" class="cancel-button">
          <div class="button-icon">${deleteIcon}</div>
          Cancel
        </button>
        <button type="button" class="save-button">
          <div class="button-icon">${this.isEditMode ? saveIcon : createIcon}</div>
          ${this.isEditMode ? "Update" : "Create"} ${this.config.entityName}
        </button>
      </div>
    `;

    this.setupEventListeners();
  }

  private renderField(field: FormField): string {
    const value = this.formData[field.id] || "";
    const hasError = this.errors[field.id];

    let inputHtml = "";

    switch (field.type) {
      case "select":
        inputHtml = `
          <select id="${field.id}" ${field.required ? "required" : ""}>
            <option value="">Select ${field.label}</option>
            ${
              field.options
                ?.map(
                  (option) => `
              <option value="${option.value}" ${value === option.value ? "selected" : ""}>
                ${option.label}
              </option>
            `
                )
                .join("") || ""
            }
          </select>
        `;
        break;
      case "textarea":
        inputHtml = `
          <textarea 
            id="${field.id}" 
            placeholder="${field.placeholder || ""}"
            ${field.required ? "required" : ""}
          >${value}</textarea>
        `;
        break;
      default:
        inputHtml = `
          <input 
            type="${field.type}" 
            id="${field.id}" 
            value="${value}"
            placeholder="${field.placeholder || ""}"
            ${field.required ? "required" : ""}
          >
        `;
    }

    return `
      <div class="form-group ${hasError ? "error" : ""}">
        <label for="${field.id}" class="${field.required ? "required" : ""}">
          ${field.label}
        </label>
        ${inputHtml}
        ${hasError ? `<div class="error-message">${this.errors[field.id]}</div>` : ""}
      </div>
    `;
  }

  private setupEventListeners(): void {
    // Tab navigation
    this.shadow.querySelectorAll(".tab a").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = e.target as HTMLElement;
        const href = target.closest("a")?.getAttribute("href");
        if (href) {
          const tabId = href.replace("#", "");
          this.currentTab = tabId;

          if (this.config.reduxSlice) {
            store.dispatch(this.config.reduxSlice.actions.setCurrentTab(tabId));
          }

          this.updateTabVisibility(tabId);
        }
      });
    });

    // Form submission
    const saveButton = this.shadow.querySelector(".save-button");
    if (saveButton) {
      saveButton.addEventListener("click", () => {
        this.handleSubmit();
      });
    }

    // Cancel button
    const cancelButton = this.shadow.querySelector(".cancel-button");
    if (cancelButton) {
      cancelButton.addEventListener("click", () => {
        this.clearForm();
        this.dispatchEvent(
          new CustomEvent("form-cancel", {
            bubbles: true,
          })
        );
      });
    }

    // Input validation on change
    this.shadow
      .querySelectorAll("input, select, textarea")
      .forEach((element) => {
        element.addEventListener("change", (e) => {
          const target = e.target as HTMLInputElement;
          const fieldConfig = this.config.tabs
            .flatMap((tab) => tab.fields)
            .find((field) => field.id === target.id);

          if (fieldConfig) {
            const error = this.validateField(fieldConfig, target.value);
            if (error) {
              this.errors[target.id] = error;
            } else {
              delete this.errors[target.id];
            }
            this.updateErrorDisplay();
          }

          // Update Redux state if configured
          if (this.config.reduxSlice) {
            store.dispatch(
              this.config.reduxSlice.actions.addElement({
                id: target.id,
                element: {
                  value: target.value,
                  type: target.type || undefined,
                  placeholder: target.placeholder,
                },
              })
            );
          }
        });
      });
  }

  // Public methods
  public setData(data: FormData): void {
    this.formData = { ...data };
    this.render();
  }

  public setMode(mode: "create" | "edit"): void {
    this.isEditMode = mode === "edit";
    this.render();
  }

  public setTab(tabId: string): void {
    if (this.config.tabs.some((tab) => tab.id === tabId)) {
      this.currentTab = tabId;
      this.updateTabVisibility(tabId);
    }
  }

  public reset(): void {
    this.clearForm();
    this.isEditMode = false;
    this.formData = {};
    this.render();
  }
}

customElements.define("generic-forms", GenericForms);

export default GenericForms;
