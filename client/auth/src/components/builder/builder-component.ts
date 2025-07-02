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

export class FormBuilderVisual extends HTMLElement {
  private shadow: ShadowRoot;
  private swapy: any;
  private formFields: Map<string, Field> = new Map();
  private fieldCounter = 0;

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
    }, 100);
  }

  private render(): void {
    this.shadow.innerHTML = `
      <div class="form-builder-container">
        <div class="toolbar">
          <h3>Elementos de Formulario</h3>
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

        <div class="builder-area">
          <h3>Constructor de Formulario</h3>
          <div class="form-canvas" id="form-canvas">
            ${this.generateEmptySlots()}
          </div>
        </div>

        <div class="properties-panel">
          <h3>Propiedades</h3>
          <div class="properties-content">
            <p>Selecciona un campo para editar sus propiedades</p>
          </div>
        </div>
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

  private generateEmptySlots(): string {
    let slots = "";
    for (let i = 1; i <= 12; i++) {
      slots += `
        <div class="form-slot" data-swapy-slot="slot-${i}">
          <div class="slot-placeholder" data-swapy-item="empty-${i}">Arrastra un campo aquí</div>
        </div>
      `;
    }
    return slots;
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

  private setupEventListeners(): void {
    const fieldTemplates = this.shadow.querySelectorAll(".field-template");
    fieldTemplates.forEach((template) => {
      template.addEventListener("dragstart", (event: Event) =>
        this.handleDragStart(event as DragEvent)
      );
      template.addEventListener("click", (event: Event) =>
        this.handleTemplateClick(event)
      );
    });

    const slots = this.shadow.querySelectorAll(".form-slot");
    slots.forEach((slot) => {
      slot.addEventListener("dragover", (event: Event) =>
        this.handleDragOver(event as DragEvent)
      );
      slot.addEventListener("drop", (event: Event) =>
        this.handleDrop(event as DragEvent)
      );
    });

    this.shadow
      .querySelector(".btn-preview")
      ?.addEventListener("click", this.showPreview.bind(this));
    this.shadow
      .querySelector(".btn-export")
      ?.addEventListener("click", this.exportSchema.bind(this));
    this.shadow
      .querySelector(".btn-clear")
      ?.addEventListener("click", this.clearForm.bind(this));
    this.shadow
      .querySelector(".close-modal")
      ?.addEventListener("click", this.hidePreview.bind(this));

    fieldTemplates.forEach((template) => {
      (template as HTMLElement).draggable = true;
    });
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

    // Aplicar contraste a los botones del campo
    const fieldButtons = fieldDiv.querySelectorAll('button');
    fieldButtons.forEach(button => {
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

    // Aplicar contraste a los nuevos botones
    const newButtons = propertiesPanel.querySelectorAll('button');
    newButtons.forEach(button => {
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
    
    // Aplicar contraste a los botones del campo actualizado
    const fieldButtons = fieldElement.querySelectorAll('button');
    fieldButtons.forEach(button => {
      ContrastUtils.applyContrastToButton(button as HTMLElement);
    });
  }

  private cancelFieldEdit(): void {
    const propertiesPanel = this.shadow.querySelector(".properties-content");
    if (propertiesPanel) {
      propertiesPanel.innerHTML =
        "<p>Selecciona un campo para editar sus propiedades</p>";
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

  private updateFormSchema(): void {
    const schema: FormSchema = {
      fields: Array.from(this.formFields.values()),
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
        fields: Array.from(this.formFields.values()),
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
      fields: Array.from(this.formFields.values()),
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
      fields: Array.from(this.formFields.values()),
    };
  }

  private applyContrastToButtons(): void {
    const buttons = this.shadow.querySelectorAll('button');
    buttons.forEach(button => {
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
