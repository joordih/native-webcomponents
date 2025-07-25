export interface FieldTemplate {
  type: string;
  label: string;
  icon: string;
  defaultProps: Partial<FormField>;
}

export interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  submitUrl?: string;
  method?: "GET" | "POST";
}

export interface PanelState {
  selectedField: FormField | null;
  showProperties: boolean;
}

export class VisualFormBuilder extends HTMLElement {
  #state: {
    schema: FormSchema;
    panelState: PanelState;
  } = {
    schema: {
      id: "form-1",
      title: "New Form",
      fields: [],
      method: "POST",
    },
    panelState: {
      selectedField: null,
      showProperties: false,
    },
  };

  #fieldTemplates: FieldTemplate[] = [
    {
      type: "text",
      label: "Text Input",
      icon: "📝",
      defaultProps: {
        type: "text",
        label: "Text Field",
        placeholder: "Enter text...",
        required: false,
      },
    },
    {
      type: "email",
      label: "Email",
      icon: "📧",
      defaultProps: {
        type: "email",
        label: "Email Address",
        placeholder: "Enter email...",
        required: true,
      },
    },
    {
      type: "password",
      label: "Password",
      icon: "🔒",
      defaultProps: {
        type: "password",
        label: "Password",
        placeholder: "Enter password...",
        required: true,
      },
    },
    {
      type: "textarea",
      label: "Textarea",
      icon: "📄",
      defaultProps: {
        type: "textarea",
        label: "Message",
        placeholder: "Enter your message...",
        required: false,
      },
    },
    {
      type: "select",
      label: "Select",
      icon: "📋",
      defaultProps: {
        type: "select",
        label: "Choose Option",
        required: false,
        options: ["Option 1", "Option 2", "Option 3"],
      },
    },
    {
      type: "radio",
      label: "Radio Group",
      icon: "🔘",
      defaultProps: {
        type: "radio",
        label: "Select One",
        required: false,
        options: ["Option A", "Option B", "Option C"],
      },
    },
    {
      type: "checkbox",
      label: "Checkbox",
      icon: "☑️",
      defaultProps: {
        type: "checkbox",
        label: "Check this box",
        required: false,
      },
    },
    {
      type: "number",
      label: "Number",
      icon: "🔢",
      defaultProps: {
        type: "number",
        label: "Number Field",
        placeholder: "Enter number...",
        required: false,
      },
    },
    {
      type: "date",
      label: "Date",
      icon: "📅",
      defaultProps: {
        type: "date",
        label: "Select Date",
        required: false,
      },
    },
    {
      type: "file",
      label: "File Upload",
      icon: "📎",
      defaultProps: {
        type: "file",
        label: "Upload File",
        required: false,
      },
    },
  ];

  constructor() {
    super();
  }

  connectedCallback(): void {
    this.render();
    this.#setupEventListeners();
  }

  disconnectedCallback(): void {
    this.#cleanupEventListeners();
  }

  get schema(): FormSchema {
    return this.#state.schema;
  }

  set schema(value: FormSchema) {
    this.#state.schema = value;
    this.render();
  }

  #setupEventListeners(): void {
    this.addEventListener("click", this.#handleClick.bind(this));
    this.addEventListener("dragstart", this.#handleDragStart.bind(this));
    this.addEventListener("dragover", this.#handleDragOver.bind(this));
    this.addEventListener("drop", this.#handleDrop.bind(this));
    this.addEventListener("input", this.#handleInput.bind(this));
  }

  #cleanupEventListeners(): void {
    this.removeEventListener("click", this.#handleClick.bind(this));
    this.removeEventListener("dragstart", this.#handleDragStart.bind(this));
    this.removeEventListener("dragover", this.#handleDragOver.bind(this));
    this.removeEventListener("drop", this.#handleDrop.bind(this));
    this.removeEventListener("input", this.#handleInput.bind(this));
  }

  #handleClick(event: Event): void {
    const target = event.target as HTMLElement;

    if (target.closest(".field-template")) {
      const template = target.closest(".field-template") as HTMLElement;
      const type = template.dataset.type;
      if (type) {
        this.#addField(type);
      }
    }

    if (target.closest(".form-field")) {
      const field = target.closest(".form-field") as HTMLElement;
      const fieldId = field.dataset.fieldId;
      if (fieldId) {
        this.#selectField(fieldId);
      }
    }

    if (target.closest(".control-btn")) {
      const btn = target.closest(".control-btn") as HTMLElement;
      const action = btn.dataset.action;
      const fieldId = btn.closest(".form-field")?.getAttribute("data-field-id");

      if (action && fieldId) {
        this.#handleFieldAction(action, fieldId);
      }
    }
  }

  #handleDragStart(event: DragEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest(".field-template")) {
      const template = target.closest(".field-template") as HTMLElement;
      const type = template.dataset.type;
      if (type && event.dataTransfer) {
        event.dataTransfer.setData("text/plain", type);
        event.dataTransfer.effectAllowed = "copy";
      }
    }
  }

  #handleDragOver(event: DragEvent): void {
    event.preventDefault();
    const target = event.target as HTMLElement;
    const dropZone = target.closest(".form-fields, .form-field");

    if (dropZone) {
      event.dataTransfer!.dropEffect = "copy";
      dropZone.classList.add("drag-over");
    }
  }

  #handleDrop(event: DragEvent): void {
    event.preventDefault();
    const target = event.target as HTMLElement;
    const dropZone = target.closest(".form-fields, .form-field");

    if (dropZone && event.dataTransfer) {
      dropZone.classList.remove("drag-over");
      const fieldType = event.dataTransfer.getData("text/plain");

      if (fieldType) {
        let insertIndex = this.#state.schema.fields.length;

        if (dropZone.classList.contains("form-field")) {
          const fieldId = dropZone.getAttribute("data-field-id");
          if (fieldId) {
            insertIndex =
              this.#state.schema.fields.findIndex((f) => f.id === fieldId) + 1;
          }
        }

        this.#addField(fieldType, insertIndex);
      }
    }
  }

  #handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;

    if (target.closest(".properties-panel")) {
      this.#updateFieldProperty(target);
    }
  }

  #addField(type: string, index?: number): void {
    const template = this.#fieldTemplates.find((t) => t.type === type);
    if (!template) return;

    const newField: FormField = {
      id: `field-${Date.now()}`,
      ...template.defaultProps,
    } as FormField;

    if (index !== undefined) {
      this.#state.schema.fields.splice(index, 0, newField);
    } else {
      this.#state.schema.fields.push(newField);
    }

    this.#state.panelState.selectedField = newField;
    this.#state.panelState.showProperties = true;

    this.render();
    this.#dispatchChange();
  }

  #selectField(fieldId: string): void {
    const field = this.#state.schema.fields.find((f) => f.id === fieldId);
    if (field) {
      this.#state.panelState.selectedField = field;
      this.#state.panelState.showProperties = true;
      this.render();
    }
  }

  #handleFieldAction(action: string, fieldId: string): void {
    const fieldIndex = this.#state.schema.fields.findIndex(
      (f) => f.id === fieldId
    );
    if (fieldIndex === -1) return;

    switch (action) {
      case "delete":
        this.#state.schema.fields.splice(fieldIndex, 1);
        if (this.#state.panelState.selectedField?.id === fieldId) {
          this.#state.panelState.selectedField = null;
          this.#state.panelState.showProperties = false;
        }
        break;
      case "duplicate": {
        const field = this.#state.schema.fields[fieldIndex];
        const duplicated = {
          ...field,
          id: `field-${Date.now()}`,
          label: `${field.label} (Copy)`,
        };
        this.#state.schema.fields.splice(fieldIndex + 1, 0, duplicated);
        break;
      }
      case "move-up":
        if (fieldIndex > 0) {
          [
            this.#state.schema.fields[fieldIndex],
            this.#state.schema.fields[fieldIndex - 1],
          ] = [
            this.#state.schema.fields[fieldIndex - 1],
            this.#state.schema.fields[fieldIndex],
          ];
        }
        break;
      case "move-down":
        if (fieldIndex < this.#state.schema.fields.length - 1) {
          [
            this.#state.schema.fields[fieldIndex],
            this.#state.schema.fields[fieldIndex + 1],
          ] = [
            this.#state.schema.fields[fieldIndex + 1],
            this.#state.schema.fields[fieldIndex],
          ];
        }
        break;
    }

    this.render();
    this.#dispatchChange();
  }

  #updateFieldProperty(input: HTMLInputElement): void {
    if (!this.#state.panelState.selectedField) return;

    const property = input.name;
    const value = input.type === "checkbox" ? input.checked : input.value;

    if (property === "options") {
      if (typeof value === "string") {
        this.#state.panelState.selectedField.options = value
          .split("\n")
          .filter(Boolean);
      }
    } else {
      (this.#state.panelState.selectedField as any)[property] = value;
    }

    this.render();
    this.#dispatchChange();
  }

  #dispatchChange(): void {
    this.dispatchEvent(
      new CustomEvent("schema-change", {
        detail: { schema: this.#state.schema },
        bubbles: true,
      })
    );
  }

  render(): void {
    this.innerHTML = `
      <div class="form-builder">
        <div class="toolbar">
          <div class="toolbar-section">
            <h3 class="toolbar-title">Field Types</h3>
            <div class="field-templates">
              ${this.#fieldTemplates
                .map(
                  (template) => `
                <div class="field-template" data-type="${template.type}" draggable="true">
                  <span class="field-icon">${template.icon}</span>
                  <span class="field-label">${template.label}</span>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        </div>
        
        <div class="canvas">
          ${this.#renderFormPreview()}
        </div>
        
        ${this.#state.panelState.showProperties ? this.#renderPropertiesPanel() : ""}
      </div>
    `;
  }

  #renderFormPreview(): string {
    if (this.#state.schema.fields.length === 0) {
      return `
        <div class="empty-canvas">
          <div class="empty-icon">📝</div>
          <h3 class="empty-title">Start Building Your Form</h3>
          <p class="empty-description">
            Drag field types from the toolbar or click to add them to your form.
          </p>
        </div>
      `;
    }

    return `
      <div class="form-preview">
        <h2 class="form-title">${this.#state.schema.title}</h2>
        <div class="form-fields">
          ${this.#state.schema.fields.map((field) => this.#renderField(field)).join("")}
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-secondary">Preview</button>
          <button type="button" class="btn btn-primary">Save Form</button>
        </div>
      </div>
    `;
  }

  #renderField(field: FormField): string {
    const isSelected = this.#state.panelState.selectedField?.id === field.id;

    return `
      <div class="form-field ${isSelected ? "selected" : ""}" data-field-id="${field.id}">
        <div class="field-controls">
          <button class="control-btn" data-action="move-up" title="Move Up">
            <svg viewBox="0 0 24 24"><path d="M7 14l5-5 5 5z"/></svg>
          </button>
          <button class="control-btn" data-action="move-down" title="Move Down">
            <svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
          </button>
          <button class="control-btn" data-action="duplicate" title="Duplicate">
            <svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
          </button>
          <button class="control-btn" data-action="delete" title="Delete">
            <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
        
        <label class="field-label">${field.label}${field.required ? " *" : ""}</label>
        ${this.#renderFieldInput(field)}
      </div>
    `;
  }

  #renderFieldInput(field: FormField): string {
    switch (field.type) {
      case "textarea":
        return `<textarea class="field-input" placeholder="${field.placeholder || ""}" ${field.required ? "required" : ""}></textarea>`;

      case "select":
        return `
          <select class="field-input" ${field.required ? "required" : ""}>
            <option value="">Choose an option</option>
            ${field.options?.map((option) => `<option value="${option}">${option}</option>`).join("") || ""}
          </select>
        `;

      case "radio":
        return `
          <div class="radio-group">
            ${
              field.options
                ?.map(
                  (option, _index) => `
              <label class="radio-option">
                <input type="radio" name="${field.id}" value="${option}" ${field.required ? "required" : ""}>
                <span>${option}</span>
              </label>
            `
                )
                .join("") || ""
            }
          </div>
        `;

      case "checkbox":
        return `
          <label class="checkbox-group">
            <input type="checkbox" class="checkbox-input" ${field.required ? "required" : ""}>
            <span>${field.label}</span>
          </label>
        `;

      default:
        return `<input type="${field.type}" class="field-input" placeholder="${field.placeholder || ""}" ${field.required ? "required" : ""}>`;
    }
  }

  #renderPropertiesPanel(): string {
    const field = this.#state.panelState.selectedField;
    if (!field) return "";

    return `
      <div class="properties-panel">
        <h3 class="properties-title">Field Properties</h3>
        
        <div class="property-group">
          <label class="property-label">Label</label>
          <input type="text" class="property-input" name="label" value="${field.label}">
        </div>
        
        <div class="property-group">
          <label class="property-label">Placeholder</label>
          <input type="text" class="property-input" name="placeholder" value="${field.placeholder || ""}">
        </div>
        
        <div class="property-group">
          <label class="checkbox-group">
            <input type="checkbox" class="checkbox-input" name="required" ${field.required ? "checked" : ""}>
            <span>Required Field</span>
          </label>
        </div>
        
        ${
          field.options
            ? `
          <div class="property-group">
            <label class="property-label">Options (one per line)</label>
            <textarea class="property-input" name="options" rows="4">${field.options.join("\n")}</textarea>
          </div>
        `
            : ""
        }
        
        ${
          field.validation
            ? `
          <div class="property-group">
            <label class="property-label">Validation Message</label>
            <input type="text" class="property-input" name="validation.message" value="${field.validation.message || ""}">
          </div>
        `
            : ""
        }
      </div>
    `;
  }
}

if (!customElements.get("visual-form-builder")) {
  customElements.define("visual-form-builder", VisualFormBuilder);
}
