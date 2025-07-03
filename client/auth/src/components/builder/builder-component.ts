import { createSwapy, SwapEvent } from "swapy";
import css from "./builder-component.css?raw";
import {
  AUTOCOMPLETE_TOKENS,
  Field,
  FormSchema,
  INPUT_CONFIGS,
} from "../forms/form-schema";

import {
  calculatorIcon,
  closeIcon,
  dateIcon,
  emailIcon,
  eyeIcon,
  lockIcon,
  penIcon,
  saveIcon,
  selectIcon,
  textIcon,
  trashIcon,
  writebookIcon,
} from "./index.ts";
import { ContrastUtils } from "../../utils/contrast-utils";

interface FieldTemplate {
  id: string;
  type: string;
  label: string;
  icon: string;
  defaultConfig: Partial<Field>;
}

interface PanelState {
  isFloating: boolean;
  isVisible: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
}

interface LayoutConfig {
  toolbar: PanelState;
  properties: PanelState;
  gridColumns: number;
  gridRows: number;
}

export class FormBuilderVisual extends HTMLElement {
  private shadow: ShadowRoot;
  private swapy: any;
  private formFields: Map<string, Field> = new Map();
  private fieldCounter = 0;
  private layoutConfig!: LayoutConfig;
  private isDragging = false;
  private dragOffset = { x: 0, y: 0 };
  private currentDragPanel: string | null = null;
  private isResizing = false;
  private currentResizePanel: string | null = null;
  private resizeStartPos = { x: 0, y: 0 };
  private resizeStartSize = { width: 0, height: 0 };
  private eventListenersSetup = false;

  private fieldTemplates: FieldTemplate[] = [
    {
      id: "text",
      type: "text",
      label: "Texto",
      icon: textIcon,
      defaultConfig: {
        type: "text",
        placeholder: "Ingresa texto...",
        autocomplete: AUTOCOMPLETE_TOKENS.OFF,
      },
    },
    {
      id: "email",
      type: "email",
      label: "Email",
      icon: emailIcon,
      defaultConfig: {
        type: "email",
        placeholder: "ejemplo@correo.com",
        autocomplete: AUTOCOMPLETE_TOKENS.EMAIL,
      },
    },
    {
      id: "password",
      type: "password",
      label: "Contraseña",
      icon: lockIcon,
      defaultConfig: {
        type: "password",
        placeholder: "Contraseña...",
        autocomplete: AUTOCOMPLETE_TOKENS.NEW_PASSWORD,
      },
    },
    {
      id: "number",
      type: "number",
      label: "Número",
      icon: calculatorIcon,
      defaultConfig: {
        type: "number",
        placeholder: "0",
        autocomplete: AUTOCOMPLETE_TOKENS.OFF,
      },
    },
    {
      id: "date",
      type: "date",
      label: "Fecha",
      icon: dateIcon,
      defaultConfig: {
        type: "date",
        autocomplete: AUTOCOMPLETE_TOKENS.BDAY,
      },
    },
    {
      id: "select",
      type: "select",
      label: "Selección",
      icon: selectIcon,
      defaultConfig: {
        type: "select",
        options: ["Opción 1", "Opción 2", "Opción 3"],
      },
    },
  ];

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.loadStyles();
    this.initializeLayoutConfig();
  }

  private initializeLayoutConfig(): void {
    this.layoutConfig = {
      toolbar: {
        isFloating: false,
        isVisible: true,
        position: { x: 20, y: 20 },
        size: { width: 280, height: 600 },
        isMinimized: false,
      },
      properties: {
        isFloating: false,
        isVisible: true,
        position: { x: window.innerWidth - 340, y: 20 },
        size: { width: 320, height: 600 },
        isMinimized: false,
      },
      gridColumns: 3,
      gridRows: 4,
    };
  }

  private loadStyles(): void {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    this.shadow.adoptedStyleSheets = [sheet];
  }

  connectedCallback(): void {
    this.render();
    setTimeout(() => {
      this.initSwapy();
      this.setupEventListeners();
      this.applyContrastToButtons();
      this.applyInitialPanelStyles();
    }, 100);
  }

  private applyInitialPanelStyles(): void {
    setTimeout(() => {
      Object.keys(this.layoutConfig).forEach((panelType) => {
        if (panelType !== "gridColumns" && panelType !== "gridRows") {
          this.applyPanelStyles(panelType);
        }
      });
    }, 100);
  }

  disconnectedCallback(): void {
    this.removeEventListeners();

    if (this.swapy) {
      this.swapy.destroy();
      this.swapy = null;
    }
  }

  private render(): void {
    this.removeEventListeners();

    this.shadow.innerHTML = `
      <div class="form-builder-container ${this.getContainerClasses()}">
        <!--${this.renderLayoutControls()}-->
        ${this.renderToolbar()}
        ${this.renderBuilderArea()}
        ${this.renderPropertiesPanel()}
      </div>

      <div class="preview-modal" id="preview-modal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Vista Previa del Formulario</h3>
            <button class="close-modal">✕</button>
          </div>
          <div class="modal-body">
            <form-builder id="preview-form"></form-builder>
          </div>
        </div>
      </div>
    `;
  }

  private getContainerClasses(): string {
    const classes = ["properties-hidden"];
    if (this.layoutConfig.toolbar.isFloating) classes.push("toolbar-floating");
    if (this.layoutConfig.properties.isFloating)
      classes.push("properties-floating");
    return classes.join(" ");
  }

  private renderLayoutControls(): string {
    return `
      <div class="layout-controls">
        <button class="layout-btn" data-action="toggle-toolbar-float" title="Hacer flotante panel de herramientas">
          📌
        </button>
        <button class="layout-btn" data-action="toggle-properties-float" title="Hacer flotante panel de propiedades">
          🔧
        </button>
        <button class="layout-btn" data-action="toggle-toolbar-visibility" title="Mostrar/Ocultar herramientas">
          👁️
        </button>
        <button class="layout-btn" data-action="toggle-properties-visibility" title="Mostrar/Ocultar propiedades">
          🎛️
        </button>
        <button class="layout-btn" data-action="reset-layout" title="Resetear layout">
          🔄
        </button>
        <div class="grid-controls">
          <label>Columnas:</label>
          <input type="range" min="1" max="6" value="${this.layoutConfig.gridColumns}" data-control="grid-columns">
          <span>${this.layoutConfig.gridColumns}</span>
        </div>
      </div>
    `;
  }

  private renderToolbar(): string {
    const config = this.layoutConfig.toolbar;
    const style = config.isFloating
      ? `style="position: fixed; left: ${config.position.x}px; top: ${config.position.y}px; width: ${config.size.width}px; height: ${config.size.height}px; z-index: 1000;"`
      : "";
    const classes = `toolbar ${config.isFloating ? "floating" : ""} ${!config.isVisible ? "hidden" : ""} ${config.isMinimized ? "minimized" : ""}`;

    return `
      <div class="${classes}" data-panel="toolbar" ${style}>
        ${config.isFloating ? this.renderPanelHeader("toolbar", "Elementos de Formulario") : ""}
        <div class="panel-content">
          ${!config.isFloating ? "<h3>Elementos de Formulario</h3>" : ""}
          <div class="field-templates">
            ${this.fieldTemplates
              .map(
                (template) => `
              <div class="field-template" data-field-type="${template.type}">
                <span class="field-icon">${template.icon}</span>
                <span class="field-label">${template.label}</span>
              </div>
            `
              )
              .join("")}
          </div>
          
          <div class="actions">
            <button class="btn-preview">
              ${eyeIcon}
              <span>Vista Previa</span>
            </button>
            <button class="btn-export">${saveIcon} Exportar JSON</button>
            <button class="btn-clear">${trashIcon} Limpiar</button>
          </div>
        </div>
        ${config.isFloating ? this.renderResizeHandle() : ""}
      </div>
    `;
  }

  private renderBuilderArea(): string {
    return `
      <div class="builder-area">
        <h3>Constructor de Formulario</h3>
        <div class="form-canvas" id="form-canvas" style="grid-template-columns: repeat(${this.layoutConfig.gridColumns}, 1fr);">
          ${this.generateEmptySlots()}
        </div>
      </div>
    `;
  }

  private renderPropertiesPanel(): string {
    const config = this.layoutConfig.properties;
    const style = config.isFloating
      ? `style="position: fixed; left: ${config.position.x}px; top: ${config.position.y}px; width: ${config.size.width}px; height: ${config.size.height}px; z-index: 1000;"`
      : "";
    const classes = `properties-panel ${config.isFloating ? "floating" : ""} ${!config.isVisible ? "hidden" : ""} ${config.isMinimized ? "minimized" : ""}`;

    return `
      <div class="${classes}" data-panel="properties" ${style}>
        ${config.isFloating ? this.renderPanelHeader("properties", "Propiedades") : ""}
        <div class="panel-content">
          ${!config.isFloating ? "<h3>Propiedades</h3>" : ""}
          <div class="properties-content">
            <p>Selecciona un campo para editar sus propiedades</p>
          </div>
        </div>
        ${config.isFloating ? this.renderResizeHandle() : ""}
      </div>
    `;
  }

  private renderPanelHeader(panelType: string, title: string): string {
    return `
      <div class="panel-header" data-drag-handle="${panelType}">
        <span class="panel-title">${title}</span>
        <div class="panel-controls">
          <button class="panel-btn" data-action="minimize-${panelType}" title="Minimizar">−</button>
          <button class="panel-btn" data-action="dock-${panelType}" title="Acoplar">📌</button>
          <button class="panel-btn" data-action="close-${panelType}" title="Cerrar">✕</button>
        </div>
      </div>
    `;
  }

  private renderResizeHandle(): string {
    return '<div class="resize-handle"></div>';
  }

  private generateEmptySlots(): string {
    let slots = "";
    const totalSlots =
      this.layoutConfig.gridColumns * this.layoutConfig.gridRows;
    for (let i = 1; i <= totalSlots; i++) {
      slots += `
        <div class="form-slot" data-swapy-slot="slot-${i}">
          <div class="slot-placeholder" data-swapy-item="empty-${i}">Arrastra un campo aquí</div>
        </div>
      `;
    }
    return slots;
  }

  private setupLayoutEventListeners(): void {
    this.shadow.addEventListener("click", this.handleLayoutAction.bind(this));
    this.shadow.addEventListener("input", this.handleGridControl.bind(this));
    this.shadow.addEventListener("mousedown", (event: Event) =>
      this.handleMouseDown(event as MouseEvent)
    );
    document.addEventListener("mousemove", this.handleMouseMove.bind(this));
    document.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  private handleLayoutAction(event: Event): void {
    const target = event.target as HTMLElement;
    const action = target.getAttribute("data-action");

    if (!action) return;

    switch (action) {
      case "toggle-toolbar-float":
        this.togglePanelFloat("toolbar");
        break;
      case "toggle-properties-float":
        this.togglePanelFloat("properties");
        break;
      case "toggle-toolbar-visibility":
        this.togglePanelVisibility("toolbar");
        break;
      case "toggle-properties-visibility":
        this.togglePanelVisibility("properties");
        break;
      case "reset-layout":
        this.resetLayout();
        break;
      case "minimize-toolbar":
        this.togglePanelMinimize("toolbar");
        break;
      case "minimize-properties":
        this.togglePanelMinimize("properties");
        break;
      case "dock-toolbar":
        this.dockPanel("toolbar");
        break;
      case "dock-properties":
        this.dockPanel("properties");
        break;
      case "close-toolbar":
        this.togglePanelVisibility("toolbar");
        break;
      case "close-properties":
        this.togglePanelVisibility("properties");
        break;
    }
  }

  private handleGridControl(event: Event): void {
    const target = event.target as HTMLInputElement;
    const control = target.getAttribute("data-control");

    if (control === "grid-columns") {
      this.layoutConfig.gridColumns = parseInt(target.value);
      this.updateGridLayout();
    }
  }

  private handleMouseDown(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const dragHandle = target.closest("[data-drag-handle]") as HTMLElement;
    const resizeHandle = target.closest(".resize-handle") as HTMLElement;

    if (dragHandle) {
      this.startDragging(event, dragHandle.getAttribute("data-drag-handle")!);
    } else if (resizeHandle) {
      this.startResizing(
        event,
        resizeHandle.closest("[data-panel]")!.getAttribute("data-panel")!
      );
    }
  }

  private handleMouseMove(event: MouseEvent): void {
    if (this.isDragging && this.currentDragPanel) {
      this.updatePanelPosition(event);
    } else if (this.isResizing && this.currentResizePanel) {
      this.updatePanelSize(event);
    }
  }

  private handleMouseUp(): void {
    this.isDragging = false;
    this.isResizing = false;
    this.currentDragPanel = null;
    this.currentResizePanel = null;
  }

  private startDragging(event: MouseEvent, panelType: string): void {
    this.isDragging = true;
    this.currentDragPanel = panelType;
    const panel = this.shadow.querySelector(
      `[data-panel="${panelType}"]`
    ) as HTMLElement;
    const rect = panel.getBoundingClientRect();
    this.dragOffset = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    event.preventDefault();
  }

  private startResizing(event: MouseEvent, panelType: string): void {
    this.isResizing = true;
    this.currentResizePanel = panelType;
    this.resizeStartPos = { x: event.clientX, y: event.clientY };
    const config = this.layoutConfig[
      panelType as keyof LayoutConfig
    ] as PanelState;
    this.resizeStartSize = { ...config.size };
    event.preventDefault();
  }

  private updatePanelPosition(event: MouseEvent): void {
    if (!this.currentDragPanel) return;

    const config = this.layoutConfig[
      this.currentDragPanel as keyof LayoutConfig
    ] as PanelState;
    config.position = {
      x: event.clientX - this.dragOffset.x,
      y: event.clientY - this.dragOffset.y,
    };

    this.applyPanelStyles(this.currentDragPanel);
  }

  private updatePanelSize(event: MouseEvent): void {
    if (!this.currentResizePanel) return;

    const deltaX = event.clientX - this.resizeStartPos.x;
    const deltaY = event.clientY - this.resizeStartPos.y;

    const config = this.layoutConfig[
      this.currentResizePanel as keyof LayoutConfig
    ] as PanelState;
    config.size = {
      width: Math.max(200, this.resizeStartSize.width + deltaX),
      height: Math.max(150, this.resizeStartSize.height + deltaY),
    };

    this.applyPanelStyles(this.currentResizePanel);
  }

  private togglePanelFloat(panelType: string): void {
    const config = this.layoutConfig[
      panelType as keyof LayoutConfig
    ] as PanelState;
    config.isFloating = !config.isFloating;
    this.render();
    this.setupEventListeners();
  }

  private togglePanelVisibility(panelType: string): void {
    const config = this.layoutConfig[
      panelType as keyof LayoutConfig
    ] as PanelState;
    config.isVisible = !config.isVisible;
    this.render();
    this.setupEventListeners();
  }

  private togglePanelMinimize(panelType: string): void {
    const config = this.layoutConfig[
      panelType as keyof LayoutConfig
    ] as PanelState;
    config.isMinimized = !config.isMinimized;
    this.applyPanelStyles(panelType);
  }

  private dockPanel(panelType: string): void {
    const config = this.layoutConfig[
      panelType as keyof LayoutConfig
    ] as PanelState;
    config.isFloating = false;
    this.render();
    this.setupEventListeners();
  }

  private resetLayout(): void {
    this.initializeLayoutConfig();
    this.render();
    this.setupEventListeners();
  }

  private updateGridLayout(): void {
    const canvas = this.shadow.querySelector("#form-canvas") as HTMLElement;
    if (canvas) {
      canvas.style.gridTemplateColumns = `repeat(${this.layoutConfig.gridColumns}, 1fr)`;
      canvas.innerHTML = this.generateEmptySlots();
    }

    const gridSpan = this.shadow.querySelector(".grid-controls span");
    if (gridSpan) {
      gridSpan.textContent = this.layoutConfig.gridColumns.toString();
    }

    this.reinitializeSwapy();
  }

  private applyPanelStyles(panelType: string): void {
    const panel = this.shadow.querySelector(
      `[data-panel="${panelType}"]`
    ) as HTMLElement;
    const config = this.layoutConfig[
      panelType as keyof LayoutConfig
    ] as PanelState;

    if (panel && config.isFloating) {
      panel.style.left = `${config.position.x}px`;
      panel.style.top = `${config.position.y}px`;
      panel.style.width = `${config.size.width}px`;
      panel.style.height = config.isMinimized
        ? "40px"
        : `${config.size.height}px`;
    }
  }

  private initSwapy(): void {
    try {
      const canvas = this.shadow.querySelector("#form-canvas") as HTMLElement;
      if (!canvas) {
        console.error("Canvas element not found");
        return;
      }

      const slots = canvas.querySelectorAll("[data-swapy-slot]");
      console.log(`Found ${slots.length} slots`);

      slots.forEach((slot, index) => {
        const items = slot.querySelectorAll("[data-swapy-item]");
        console.log(`Slot ${index + 1} has ${items.length} items`);
      });

      this.swapy = createSwapy(canvas, {
        animation: "spring",
        swapMode: "drop",
      });

      this.swapy.onSwap((event: SwapEvent) => {
        console.log("Field swapped:", event);
        this.updateFormSchema();
      });

      console.log("Swapy initialized successfully");
    } catch (error) {
      console.error("Error initializing Swapy:", error);
    }
  }

  private reinitializeSwapy(): void {
    if (this.swapy) {
      this.swapy.destroy();
    }
    setTimeout(() => {
      this.initSwapy();
      this.setupEventListeners();
      this.applyContrastToButtons();
    }, 100);
  }

  private boundHandlers = {
    dragStart: (event: Event) => this.handleDragStart(event as DragEvent),
    templateClick: (event: Event) => this.handleTemplateClick(event),
    dragOver: (event: Event) => this.handleDragOver(event as DragEvent),
    drop: (event: Event) => this.handleDrop(event as DragEvent),
    showPreview: () => this.showPreview(),
    exportSchema: () => this.exportSchema(),
    clearForm: () => this.clearForm(),
    hidePreview: () => this.hidePreview(),
  };

  private setupEventListeners(): void {
    if (this.eventListenersSetup) {
      return;
    }

    const fieldTemplates = this.shadow.querySelectorAll(".field-template");
    fieldTemplates.forEach((template) => {
      template.addEventListener("dragstart", this.boundHandlers.dragStart);
      template.addEventListener("click", this.boundHandlers.templateClick);
      (template as HTMLElement).draggable = true;
    });

    const slots = this.shadow.querySelectorAll(".form-slot");
    slots.forEach((slot) => {
      slot.addEventListener("dragover", this.boundHandlers.dragOver);
      slot.addEventListener("drop", this.boundHandlers.drop);
    });

    this.shadow
      .querySelector(".btn-preview")
      ?.addEventListener("click", this.boundHandlers.showPreview);
    this.shadow
      .querySelector(".btn-export")
      ?.addEventListener("click", this.boundHandlers.exportSchema);
    this.shadow
      .querySelector(".btn-clear")
      ?.addEventListener("click", this.boundHandlers.clearForm);
    this.shadow
      .querySelector(".close-modal")
      ?.addEventListener("click", this.boundHandlers.hidePreview);

    this.setupLayoutEventListeners();
    this.eventListenersSetup = true;
  }

  private removeEventListeners(): void {
    if (!this.eventListenersSetup) {
      return;
    }

    const fieldTemplates = this.shadow.querySelectorAll(".field-template");
    fieldTemplates.forEach((template) => {
      template.removeEventListener("dragstart", this.boundHandlers.dragStart);
      template.removeEventListener("click", this.boundHandlers.templateClick);
    });

    const slots = this.shadow.querySelectorAll(".form-slot");
    slots.forEach((slot) => {
      slot.removeEventListener("dragover", this.boundHandlers.dragOver);
      slot.removeEventListener("drop", this.boundHandlers.drop);
    });

    this.shadow
      .querySelector(".btn-preview")
      ?.removeEventListener("click", this.boundHandlers.showPreview);
    this.shadow
      .querySelector(".btn-export")
      ?.removeEventListener("click", this.boundHandlers.exportSchema);
    this.shadow
      .querySelector(".btn-clear")
      ?.removeEventListener("click", this.boundHandlers.clearForm);
    this.shadow
      .querySelector(".close-modal")
      ?.removeEventListener("click", this.boundHandlers.hidePreview);

    this.eventListenersSetup = false;
  }

  private handleDragStart(event: DragEvent): void {
    const target = event.target as HTMLElement;
    const fieldType = target
      .closest(".field-template")
      ?.getAttribute("data-field-type");
    if (fieldType) {
      event.dataTransfer?.setData("text/plain", fieldType);
    }
  }

  private handleDragOver(event: DragEvent): void {
    event.preventDefault();
    const slot = event.currentTarget as HTMLElement;
    slot.classList.add("drag-over");
  }

  private handleDrop(event: DragEvent): void {
    event.preventDefault();
    const slot = event.currentTarget as HTMLElement;
    slot.classList.remove("drag-over");

    const fieldType = event.dataTransfer?.getData("text/plain");
    if (fieldType && slot.querySelector(".slot-placeholder")) {
      this.addFieldToSlot(slot, fieldType);
    }
  }

  private handleTemplateClick(event: Event): void {
    const target = event.currentTarget as HTMLElement;
    const fieldType = target.getAttribute("data-field-type");
    if (fieldType) {
      const emptySlot = this.shadow.querySelector(
        ".form-slot .slot-placeholder"
      )?.parentElement;
      if (emptySlot) {
        this.addFieldToSlot(emptySlot as HTMLElement, fieldType);
      }
    }
  }

  private addFieldToSlot(slot: HTMLElement, fieldType: string): void {
    const template = this.fieldTemplates.find((t) => t.type === fieldType);
    if (!template) return;

    this.fieldCounter++;
    const fieldId = `field-${this.fieldCounter}`;
    const slotId = slot.getAttribute("data-swapy-slot");

    const field: Field = {
      id: fieldId,
      name: `field_${this.fieldCounter}`,
      label: `${template.label} ${this.fieldCounter}`,
      ...template.defaultConfig,
    } as Field;

    this.formFields.set(fieldId, field);

    const fieldElement = this.createFieldElement(field, slotId!);
    slot.innerHTML = "";
    slot.appendChild(fieldElement);

    this.reinitializeSwapy();
    this.updateFormSchema();
  }

  private createFieldElement(field: Field, slotId: string): HTMLElement {
    const fieldDiv = document.createElement("div");
    fieldDiv.className = "form-field";
    fieldDiv.setAttribute("data-swapy-item", field.id);
    fieldDiv.setAttribute("data-field-id", field.id);

    const template = this.fieldTemplates.find((t) => t.type === field.type);
    const icon = template?.icon || writebookIcon;

    fieldDiv.innerHTML = `
      <div class="field-header">
        <span class="field-icon">${icon}</span>
        <span class="field-title">${field.label}</span>
        <div class="field-actions">
          <button class="btn-edit" title="Editar">${penIcon}</button>
          <button class="btn-delete" title="Eliminar">${trashIcon}</button>
        </div>
      </div>
      <div class="field-preview">
        ${this.generateFieldPreview(field)}
      </div>
    `;

    fieldDiv.querySelector(".btn-edit")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.editField(field.id);
    });

    fieldDiv.querySelector(".btn-delete")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.deleteField(field.id, slotId);
    });

    const fieldButtons = fieldDiv.querySelectorAll("button");
    fieldButtons.forEach((button) => {
      ContrastUtils.applyContrastToButton(button as HTMLElement);
    });

    return fieldDiv;
  }

  private generateFieldPreview(field: Field): string {
    const config = INPUT_CONFIGS[field.type];
    if (!config) return "";

    if (field.type === "select") {
      const selectField = field as any;
      const options = selectField.options || [];
      return `
        <select disabled>
          ${options
            .map((opt: any) => {
              const value = typeof opt === "string" ? opt : opt.value;
              const label = typeof opt === "string" ? opt : opt.label;
              return `<option value="${value}">${label}</option>`;
            })
            .join("")}
        </select>
      `;
    } else {
      const textField = field as any;
      return `<input type="${field.type}" placeholder="${textField.placeholder || ""}" disabled>`;
    }
  }

  private editField(fieldId: string): void {
    const field = this.formFields.get(fieldId);
    if (!field) return;

    const propertiesPanel = this.shadow.querySelector(".properties-content");
    if (!propertiesPanel) return;

    this.showPropertiesPanel();

    propertiesPanel.innerHTML = `
      <div class="field-properties">
        <h4>Editando: ${field.label}</h4>
        
        <div class="property-group">
          <label>Etiqueta:</label>
          <input type="text" id="prop-label" value="${field.label || ""}">
        </div>
        
        <div class="property-group">
          <label>Nombre del campo:</label>
          <input type="text" id="prop-name" value="${field.name}">
        </div>
        
        <div class="property-group">
          <label>Requerido:</label>
          <input type="checkbox" id="prop-required" ${field.required ? "checked" : ""}>
        </div>
        
        ${this.generateTypeSpecificProperties(field)}
        
        <div class="property-actions">
          <button class="btn-save">${saveIcon} Guardar</button>
          <button class="btn-cancel">${closeIcon} Cancelar</button>
        </div>
      </div>
    `;

    propertiesPanel
      .querySelector(".btn-save")
      ?.addEventListener("click", () => {
        this.saveFieldProperties(fieldId);
      });

    propertiesPanel
      .querySelector(".btn-cancel")
      ?.addEventListener("click", () => {
        this.cancelFieldEdit();
      });

    const newButtons = propertiesPanel.querySelectorAll("button");
    newButtons.forEach((button) => {
      ContrastUtils.applyContrastToButton(button as HTMLElement);
    });
  }

  private generateTypeSpecificProperties(field: Field): string {
    switch (field.type) {
      case "text":
      case "email":
      case "password":
      case "number":
        const textField = field as any;
        return `
          <div class="property-group">
            <label>Placeholder:</label>
            <input type="text" id="prop-placeholder" value="${textField.placeholder || ""}">
          </div>
        `;

      case "date":
        const dateField = field as any;
        return `
          <div class="property-group">
            <label>Fecha mínima:</label>
            <input type="date" id="prop-min" value="${dateField.min || ""}">
          </div>
          <div class="property-group">
            <label>Fecha máxima:</label>
            <input type="date" id="prop-max" value="${dateField.max || ""}">
          </div>
        `;

      case "select":
        const selectField = field as any;
        const optionsText =
          selectField.options
            ?.map((opt: any) =>
              typeof opt === "string" ? opt : `${opt.value}|${opt.label}`
            )
            .join("\n") || "";
        return `
          <div class="property-group">
            <label>Opciones (una por línea, formato: valor|etiqueta):</label>
            <textarea id="prop-options" rows="4">${optionsText}</textarea>
          </div>
        `;

      default:
        return "";
    }
  }

  private saveFieldProperties(fieldId: string): void {
    const field = this.formFields.get(fieldId);
    if (!field) return;

    const propertiesPanel = this.shadow.querySelector(".properties-content");
    if (!propertiesPanel) return;

    const labelInput = propertiesPanel.querySelector(
      "#prop-label"
    ) as HTMLInputElement;
    const nameInput = propertiesPanel.querySelector(
      "#prop-name"
    ) as HTMLInputElement;
    const requiredInput = propertiesPanel.querySelector(
      "#prop-required"
    ) as HTMLInputElement;

    field.label = labelInput.value;
    field.name = nameInput.value;
    field.required = requiredInput.checked;

    this.updateTypeSpecificProperties(field, propertiesPanel);

    this.updateFieldDisplay(fieldId);
    this.cancelFieldEdit();
    this.updateFormSchema();
  }

  private updateTypeSpecificProperties(field: Field, panel: Element): void {
    switch (field.type) {
      case "text":
      case "email":
      case "password":
      case "number":
        const placeholderInput = panel.querySelector(
          "#prop-placeholder"
        ) as HTMLInputElement;
        if (placeholderInput) {
          (field as any).placeholder = placeholderInput.value;
        }
        break;

      case "date":
        const minInput = panel.querySelector("#prop-min") as HTMLInputElement;
        const maxInput = panel.querySelector("#prop-max") as HTMLInputElement;
        if (minInput) (field as any).min = minInput.value;
        if (maxInput) (field as any).max = maxInput.value;
        break;

      case "select":
        const optionsTextarea = panel.querySelector(
          "#prop-options"
        ) as HTMLTextAreaElement;
        if (optionsTextarea) {
          const optionsText = optionsTextarea.value.trim();
          const options = optionsText
            .split("\n")
            .filter((line) => line.trim())
            .map((line) => {
              const parts = line.split("|");
              if (parts.length === 2) {
                return { value: parts[0].trim(), label: parts[1].trim() };
              }
              return parts[0].trim();
            });
          (field as any).options = options;
        }
        break;
    }
  }

  private updateFieldDisplay(fieldId: string): void {
    const field = this.formFields.get(fieldId);
    if (!field) return;

    const fieldElement = this.shadow.querySelector(
      `[data-field-id="${fieldId}"]`
    );
    if (!fieldElement) return;

    const titleElement = fieldElement.querySelector(".field-title");
    const previewElement = fieldElement.querySelector(".field-preview");

    if (titleElement) titleElement.textContent = field.label || field.name;
    if (previewElement)
      previewElement.innerHTML = this.generateFieldPreview(field);

    const fieldButtons = fieldElement.querySelectorAll("button");
    fieldButtons.forEach((button) => {
      ContrastUtils.applyContrastToButton(button as HTMLElement);
    });
  }

  private cancelFieldEdit(): void {
    const propertiesPanel = this.shadow.querySelector(".properties-content");
    if (propertiesPanel) {
      propertiesPanel.innerHTML =
        "<p>Selecciona un campo para editar sus propiedades</p>";
    }
    this.hidePropertiesPanel();
  }

  private showPropertiesPanel(): void {
    const propertiesPanel = this.shadow.querySelector(".properties-panel");
    const container = this.shadow.querySelector(".form-builder-container");
    if (propertiesPanel) {
      propertiesPanel.classList.add("visible");
    }
    if (container) {
      container.classList.remove("properties-hidden");
    }
  }

  private hidePropertiesPanel(): void {
    const propertiesPanel = this.shadow.querySelector(".properties-panel");
    const container = this.shadow.querySelector(".form-builder-container");
    if (propertiesPanel) {
      propertiesPanel.classList.remove("visible");
    }
    if (container) {
      container.classList.add("properties-hidden");
    }
  }

  private deleteField(fieldId: string, slotId: string): void {
    this.formFields.delete(fieldId);

    const slot = this.shadow.querySelector(`[data-swapy-slot="${slotId}"]`);
    if (slot) {
      const slotNumber = slotId.replace("slot-", "");
      slot.innerHTML = `<div class="slot-placeholder" data-swapy-item="empty-${slotNumber}">Arrastra un campo aquí</div>`;
    }

    this.cancelFieldEdit();
    this.reinitializeSwapy();
    this.updateFormSchema();
  }

  private getOrderedFields(): Field[] {
    const orderedFields: Field[] = [];
    const slots = this.shadow.querySelectorAll(".form-slot");

    slots.forEach((slot) => {
      const fieldElement = slot.querySelector("[data-field-id]");
      if (fieldElement) {
        const fieldId = fieldElement.getAttribute("data-field-id");
        if (fieldId) {
          const field = this.formFields.get(fieldId);
          if (field) {
            orderedFields.push(field);
          }
        }
      }
    });

    return orderedFields;
  }

  private updateFormSchema(): void {
    const schema: FormSchema = {
      fields: this.getOrderedFields(),
    };

    this.dispatchEvent(
      new CustomEvent("schema-changed", {
        detail: schema,
        bubbles: true,
        composed: true,
      })
    );
  }

  private showPreview(): void {
    const modal = this.shadow.querySelector("#preview-modal") as HTMLElement;
    const previewForm = this.shadow.querySelector("#preview-form") as any;

    if (modal && previewForm) {
      const schema: FormSchema = {
        fields: this.getOrderedFields(),
      };

      previewForm.schema = schema;
      modal.style.display = "flex";
    }
  }

  private hidePreview(): void {
    const modal = this.shadow.querySelector("#preview-modal") as HTMLElement;
    if (modal) {
      modal.style.display = "none";
    }
  }

  private exportSchema(): void {
    const schema: FormSchema = {
      fields: this.getOrderedFields(),
    };

    const jsonString = JSON.stringify(schema, null, 2);

    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "form-schema.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  private clearForm(): void {
    if (confirm("¿Estás seguro de que quieres limpiar el formulario?")) {
      this.formFields.clear();
      this.fieldCounter = 0;

      const slots = this.shadow.querySelectorAll(".form-slot");
      slots.forEach((slot, index) => {
        const slotNumber = index + 1;
        slot.innerHTML = `<div class="slot-placeholder" data-swapy-item="empty-${slotNumber}">Arrastra un campo aquí</div>`;
      });

      this.cancelFieldEdit();
      this.reinitializeSwapy();
      this.updateFormSchema();
    }
  }

  public getSchema(): FormSchema {
    return {
      fields: this.getOrderedFields(),
    };
  }

  private applyContrastToButtons(): void {
    const buttons = this.shadow.querySelectorAll("button");
    buttons.forEach((button) => {
      ContrastUtils.applyContrastToButton(button as HTMLElement);
    });
  }

  public loadSchema(schema: FormSchema): void {
    this.formFields.clear();
    this.fieldCounter = 0;

    const slots = this.shadow.querySelectorAll(".form-slot");
    slots.forEach((slot, index) => {
      const slotNumber = index + 1;
      slot.innerHTML = `<div class="slot-placeholder" data-swapy-item="empty-${slotNumber}">Arrastra un campo aquí</div>`;
    });

    this.cancelFieldEdit();

    schema.fields.forEach((field, index) => {
      const slotIndex = index + 1;
      const slot = this.shadow.querySelector(
        `[data-swapy-slot="slot-${slotIndex}"]`
      );

      if (slot) {
        this.fieldCounter++;
        const fieldId = `field-${this.fieldCounter}`;
        const updatedField = { ...field, id: fieldId };

        this.formFields.set(fieldId, updatedField);

        const fieldElement = this.createFieldElement(
          updatedField,
          `slot-${slotIndex}`
        );
        slot.innerHTML = "";
        slot.appendChild(fieldElement);
      }
    });

    this.reinitializeSwapy();
    this.updateFormSchema();
    this.applyContrastToButtons();
  }
}

customElements.define("form-builder-visual", FormBuilderVisual);
