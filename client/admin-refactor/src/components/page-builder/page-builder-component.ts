export interface ComponentTemplate {
  type: string;
  label: string;
  icon: string;
  category: string;
  defaultProps: Partial<PageComponent>;
}

export interface PageComponent {
  id: string;
  type: string;
  tag: string;
  content: string;
  styles: Record<string, string>;
  attributes: Record<string, string>;
  children?: PageComponent[];
}

export interface PageSchema {
  id: string;
  title: string;
  description?: string;
  components: PageComponent[];
  globalStyles: Record<string, string>;
  metadata: {
    author?: string;
    created: string;
    modified: string;
    version: string;
  };
}

export interface PanelState {
  selectedComponent: PageComponent | null;
  showProperties: boolean;
}

export class PageBuilder extends HTMLElement {
  #state: {
    schema: PageSchema;
    panelState: PanelState;
  } = {
    schema: {
      id: "page-1",
      title: "New Page",
      components: [],
      globalStyles: {},
      metadata: {
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        version: "1.0.0",
      },
    },
    panelState: {
      selectedComponent: null,
      showProperties: false,
    },
  };

  #componentTemplates: ComponentTemplate[] = [
    {
      type: "heading",
      label: "Heading",
      icon: "📝",
      category: "Typography",
      defaultProps: {
        type: "heading",
        tag: "h1",
        content: "Your Heading Here",
        styles: {
          fontSize: "2rem",
          fontWeight: "700",
          margin: "0 0 1rem 0",
          color: "#333",
        },
        attributes: {},
      },
    },
    {
      type: "paragraph",
      label: "Paragraph",
      icon: "📄",
      category: "Typography",
      defaultProps: {
        type: "paragraph",
        tag: "p",
        content:
          "Your paragraph text goes here. You can edit this content and style it as needed.",
        styles: {
          fontSize: "1rem",
          lineHeight: "1.6",
          margin: "0 0 1rem 0",
          color: "#333",
        },
        attributes: {},
      },
    },
    {
      type: "button",
      label: "Button",
      icon: "🔘",
      category: "Interactive",
      defaultProps: {
        type: "button",
        tag: "button",
        content: "Click Me",
        styles: {
          padding: "0.75rem 1.5rem",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "1rem",
          fontWeight: "500",
        },
        attributes: {
          type: "button",
        },
      },
    },
    {
      type: "image",
      label: "Image",
      icon: "🖼️",
      category: "Media",
      defaultProps: {
        type: "image",
        tag: "img",
        content: "",
        styles: {
          maxWidth: "100%",
          height: "auto",
          borderRadius: "4px",
        },
        attributes: {
          src: "https://via.placeholder.com/400x200",
          alt: "Placeholder image",
        },
      },
    },
    {
      type: "container",
      label: "Container",
      icon: "📦",
      category: "Layout",
      defaultProps: {
        type: "container",
        tag: "div",
        content: "",
        styles: {
          padding: "1.5rem",
          border: "1px solid #dee2e6",
          borderRadius: "6px",
          backgroundColor: "#f8f9fa",
        },
        attributes: {},
        children: [],
      },
    },
    {
      type: "grid",
      label: "Grid",
      icon: "⚏",
      category: "Layout",
      defaultProps: {
        type: "grid",
        tag: "div",
        content: "",
        styles: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
        },
        attributes: {},
        children: [],
      },
    },
    {
      type: "form",
      label: "Form",
      icon: "📋",
      category: "Interactive",
      defaultProps: {
        type: "form",
        tag: "form",
        content: "",
        styles: {
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "500px",
        },
        attributes: {
          method: "POST",
          action: "#",
        },
        children: [],
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

  get schema(): PageSchema {
    return this.#state.schema;
  }

  set schema(value: PageSchema) {
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

    if (target.closest(".component-template")) {
      const template = target.closest(".component-template") as HTMLElement;
      const type = template.dataset.type;
      if (type) {
        this.#addComponent(type);
      }
    }

    if (target.closest(".page-component")) {
      const component = target.closest(".page-component") as HTMLElement;
      const componentId = component.dataset.componentId;
      if (componentId) {
        this.#selectComponent(componentId);
      }
    }

    if (target.closest(".control-btn")) {
      const btn = target.closest(".control-btn") as HTMLElement;
      const action = btn.dataset.action;
      const componentId = btn
        .closest(".page-component")
        ?.getAttribute("data-component-id");

      if (action && componentId) {
        this.#handleComponentAction(action, componentId);
      }
    }
  }

  #handleDragStart(event: DragEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest(".component-template")) {
      const template = target.closest(".component-template") as HTMLElement;
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
    const dropZone = target.closest(
      ".page-components, .page-component, .drop-zone"
    );

    if (dropZone) {
      event.dataTransfer!.dropEffect = "copy";
      dropZone.classList.add("drag-over");
    }
  }

  #handleDrop(event: DragEvent): void {
    event.preventDefault();
    const target = event.target as HTMLElement;
    const dropZone = target.closest(
      ".page-components, .page-component, .drop-zone"
    );

    if (dropZone && event.dataTransfer) {
      dropZone.classList.remove("drag-over");
      const componentType = event.dataTransfer.getData("text/plain");

      if (componentType) {
        let insertIndex = this.#state.schema.components.length;

        if (dropZone.classList.contains("page-component")) {
          const componentId = dropZone.getAttribute("data-component-id");
          if (componentId) {
            insertIndex =
              this.#state.schema.components.findIndex(
                (c) => c.id === componentId
              ) + 1;
          }
        }

        this.#addComponent(componentType, insertIndex);
      }
    }
  }

  #handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;

    if (target.closest(".properties-panel")) {
      this.#updateComponentProperty(target);
    }
  }

  #addComponent(type: string, index?: number): void {
    const template = this.#componentTemplates.find((t) => t.type === type);
    if (!template) return;

    const newComponent: PageComponent = {
      id: `component-${Date.now()}`,
      ...template.defaultProps,
    } as PageComponent;

    if (index !== undefined) {
      this.#state.schema.components.splice(index, 0, newComponent);
    } else {
      this.#state.schema.components.push(newComponent);
    }

    this.#state.panelState.selectedComponent = newComponent;
    this.#state.panelState.showProperties = true;

    this.render();
    this.#dispatchChange();
  }

  #selectComponent(componentId: string): void {
    const component = this.#state.schema.components.find(
      (c) => c.id === componentId
    );
    if (component) {
      this.#state.panelState.selectedComponent = component;
      this.#state.panelState.showProperties = true;
      this.render();
    }
  }

  #handleComponentAction(action: string, componentId: string): void {
    const componentIndex = this.#state.schema.components.findIndex(
      (c) => c.id === componentId
    );
    if (componentIndex === -1) return;

    switch (action) {
      case "delete":
        this.#state.schema.components.splice(componentIndex, 1);
        if (this.#state.panelState.selectedComponent?.id === componentId) {
          this.#state.panelState.selectedComponent = null;
          this.#state.panelState.showProperties = false;
        }
        break;
      case "duplicate": {
        const component = this.#state.schema.components[componentIndex];
        const duplicated = {
          ...component,
          id: `component-${Date.now()}`,
        };
        this.#state.schema.components.splice(componentIndex + 1, 0, duplicated);
        break;
      }
      case "move-up":
        if (componentIndex > 0) {
          [
            this.#state.schema.components[componentIndex],
            this.#state.schema.components[componentIndex - 1],
          ] = [
            this.#state.schema.components[componentIndex - 1],
            this.#state.schema.components[componentIndex],
          ];
        }
        break;
      case "move-down":
        if (componentIndex < this.#state.schema.components.length - 1) {
          [
            this.#state.schema.components[componentIndex],
            this.#state.schema.components[componentIndex + 1],
          ] = [
            this.#state.schema.components[componentIndex + 1],
            this.#state.schema.components[componentIndex],
          ];
        }
        break;
    }

    this.render();
    this.#dispatchChange();
  }

  #updateComponentProperty(input: HTMLInputElement): void {
    if (!this.#state.panelState.selectedComponent) return;

    const property = input.name;
    const value = input.type === "checkbox" ? input.checked : input.value;

    if (property.startsWith("styles.")) {
      const styleProperty = property.replace("styles.", "");
      this.#state.panelState.selectedComponent.styles[styleProperty] =
        value.toString();
    } else if (property.startsWith("attributes.")) {
      const attrProperty = property.replace("attributes.", "");
      this.#state.panelState.selectedComponent.attributes[attrProperty] =
        value.toString();
    } else {
      (this.#state.panelState.selectedComponent as any)[property] = value;
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
      <header class="builder-header">
        <div class="header-content">
          <h1 class="header-title">Constructor Visual</h1>
          <nav class="header-nav">
            <div class="nav-tabs">
              <button class="nav-tab" data-view="form-builder">Constructor de Formularios</button>
              <button class="nav-tab active" data-view="page-builder">Constructor de Páginas</button>
              <button class="nav-tab" data-view="templates">Plantillas</button>
            </div>
          </nav>
          <div class="header-actions">
            <button class="btn btn-secondary">Nuevo Proyecto</button>
            <button class="btn btn-primary">Guardar</button>
          </div>
        </div>
      </header>
      
      <div class="page-builder">
        <div class="toolbar">
          <div class="toolbar-section">
            <h3 class="toolbar-title">Components</h3>
            <div class="component-templates">
              ${this.#componentTemplates
                .map(
                  (template) => `
                <div class="component-template" data-type="${template.type}" draggable="true">
                  <span class="component-icon">${template.icon}</span>
                  <span class="component-label">${template.label}</span>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        </div>
        
        <div class="canvas">
          ${this.#renderPagePreview()}
        </div>
        
        <div class="properties-panel">
          ${this.#state.panelState.selectedComponent ? this.#renderPropertiesPanel() : this.#renderEmptyProperties()}
        </div>
      </div>
    `;
  }

  #renderPagePreview(): string {
    if (this.#state.schema.components.length === 0) {
      return `
        <div class="empty-canvas">
          <div class="empty-icon">🏗️</div>
          <h3 class="empty-title">Start Building Your Page</h3>
          <p class="empty-description">
            Drag components from the toolbar or click to add them to your page.
          </p>
        </div>
      `;
    }

    return `
      <div class="page-preview">
        <div class="page-header">
          <h1 class="page-title">${this.#state.schema.title}</h1>
        </div>
        <div class="page-content">
          <div class="page-components">
            ${this.#state.schema.components.map((component) => this.#renderComponent(component)).join("")}
          </div>
          <div class="drop-zone">
            Drop components here
          </div>
        </div>
        <div class="page-actions">
          <button type="button" class="btn btn-secondary">Preview</button>
          <button type="button" class="btn btn-primary">Save Page</button>
        </div>
      </div>
    `;
  }

  #renderComponent(component: PageComponent): string {
    const isSelected =
      this.#state.panelState.selectedComponent?.id === component.id;
    const styles = Object.entries(component.styles)
      .map(
        ([key, value]) =>
          `${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value}`
      )
      .join("; ");

    return `
      <div class="page-component ${isSelected ? "selected" : ""}" data-component-id="${component.id}">
        <div class="component-controls">
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
        
        ${this.#renderComponentContent(component, styles)}
      </div>
    `;
  }

  #renderComponentContent(component: PageComponent, styles: string): string {
    const attributes = Object.entries(component.attributes)
      .map(([key, value]) => `${key}="${value}"`)
      .join(" ");

    switch (component.type) {
      case "heading":
        return `<${component.tag} class="component-heading" style="${styles}" ${attributes}>${component.content}</${component.tag}>`;

      case "paragraph":
        return `<p class="component-paragraph" style="${styles}" ${attributes}>${component.content}</p>`;

      case "button":
        return `<button class="component-button" style="${styles}" ${attributes}>${component.content}</button>`;

      case "image":
        return `<img class="component-image" style="${styles}" ${attributes}>`;

      case "container":
        return `
          <div class="component-container" style="${styles}" ${attributes}>
            ${
              component.children
                ?.map((child) => this.#renderComponent(child))
                .join("") ||
              '<div class="component-placeholder">Container content goes here</div>'
            }
          </div>
        `;

      case "grid":
        return `
          <div class="component-grid" style="${styles}" ${attributes}>
            ${
              component.children
                ?.map((child) => this.#renderComponent(child))
                .join("") ||
              '<div class="component-placeholder">Grid items go here</div>'
            }
          </div>
        `;

      case "form":
        return `
          <form class="component-form" style="${styles}" ${attributes}>
            ${
              component.children
                ?.map((child) => this.#renderComponent(child))
                .join("") ||
              '<div class="component-placeholder">Form fields go here</div>'
            }
          </form>
        `;

      default:
        return `<div style="${styles}" ${attributes}>${component.content}</div>`;
    }
  }

  #renderEmptyProperties(): string {
    return `
      <h3 class="properties-title">Properties</h3>
      <div class="empty-properties">
        <div class="empty-icon">⚙️</div>
        <p class="empty-text">Select a component to edit its properties</p>
      </div>
    `;
  }

  #renderPropertiesPanel(): string {
    const component = this.#state.panelState.selectedComponent;
    if (!component) return "";

    return `
      <h3 class="properties-title">Component Properties</h3>
        
        <div class="property-group">
          <label class="property-label">Content</label>
          <textarea class="property-textarea" name="content" rows="3">${component.content}</textarea>
        </div>
        
        <div class="property-group">
          <label class="property-label">Tag</label>
          <select class="property-select" name="tag">
            ${this.#getTagOptions(component.type)
              .map(
                (tag) =>
                  `<option value="${tag}" ${component.tag === tag ? "selected" : ""}>${tag}</option>`
              )
              .join("")}
          </select>
        </div>
        
        <div class="property-group">
          <label class="property-label">Background Color</label>
          <input type="color" class="property-input" name="styles.backgroundColor" value="${component.styles.backgroundColor || "#ffffff"}">
        </div>
        
        <div class="property-group">
          <label class="property-label">Text Color</label>
          <input type="color" class="property-input" name="styles.color" value="${component.styles.color || "#333333"}">
        </div>
        
        <div class="property-group">
          <label class="property-label">Font Size</label>
          <input type="text" class="property-input" name="styles.fontSize" value="${component.styles.fontSize || "1rem"}">
        </div>
        
        <div class="property-group">
          <label class="property-label">Padding</label>
          <input type="text" class="property-input" name="styles.padding" value="${component.styles.padding || "0"}">
        </div>
        
        <div class="property-group">
          <label class="property-label">Margin</label>
          <input type="text" class="property-input" name="styles.margin" value="${component.styles.margin || "0"}">
        </div>
        
        ${
          component.type === "image"
            ? `
          <div class="property-group">
            <label class="property-label">Image URL</label>
            <input type="url" class="property-input" name="attributes.src" value="${component.attributes.src || ""}">
          </div>
          
          <div class="property-group">
            <label class="property-label">Alt Text</label>
            <input type="text" class="property-input" name="attributes.alt" value="${component.attributes.alt || ""}">
          </div>
        `
            : ""
        }
        
        ${
          component.type === "button"
            ? `
          <div class="property-group">
            <label class="property-label">Button Type</label>
            <select class="property-select" name="attributes.type">
              <option value="button" ${component.attributes.type === "button" ? "selected" : ""}>Button</option>
              <option value="submit" ${component.attributes.type === "submit" ? "selected" : ""}>Submit</option>
              <option value="reset" ${component.attributes.type === "reset" ? "selected" : ""}>Reset</option>
            </select>
          </div>
        `
            : ""
        }
      </div>
    `;
  }

  #getTagOptions(componentType: string): string[] {
    switch (componentType) {
      case "heading":
        return ["h1", "h2", "h3", "h4", "h5", "h6"];
      case "paragraph":
        return ["p", "div", "span"];
      case "button":
        return ["button", "a"];
      case "container":
      case "grid":
        return [
          "div",
          "section",
          "article",
          "aside",
          "header",
          "footer",
          "main",
        ];
      case "form":
        return ["form", "div"];
      default:
        return ["div", "span", "section"];
    }
  }
}

if (!customElements.get("page-builder")) {
  customElements.define("page-builder", PageBuilder);
}
