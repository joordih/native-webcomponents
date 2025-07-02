import css from "./builder-component.css?raw";
import { FormBuilderVisual } from "./builder-component";
import { FormSchema } from "../forms/form-schema";
import { ContrastUtils } from "../../utils/contrast-utils";
import {
  builderIcon,
  chartIcon,
  codeIcon,
  contactIcon,
  eyeIcon,
  folderIcon,
  laptopIcon,
  palleteIcon,
  paperIcon,
  personIcon,
  saveIcon,
  textIcon,
  trashIcon,
  writebookIcon,
} from ".";

export class BuilderDemoComponent extends HTMLElement {
  private shadow: ShadowRoot;
  private demoBuilder: FormBuilderVisual | null = null;
  private previewForm: any = null;
  private currentTab = "builder";
  private fileInput: HTMLInputElement | null = null;

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
    this.registerEvents();
    this.applyContrastToButtons();
    setTimeout(() => {
      this.loadContactForm();
    }, 500);
  }

  private render(): void {
    this.shadow.innerHTML = `
      <div class="demo-container">
        <div class="demo-header">
          <h1>
            ${palleteIcon} Zodiac Builder
            <span class="version-badge">v1.0</span>
          </h1>
          <p>Visual UI form builder Drag and Drop based.</p>

          <div class="demo-tabs">
            <button class="demo-tab active" data-tab="builder">${builderIcon} Constructor</button>
            <button class="demo-tab" data-tab="preview">${eyeIcon} Vista Previa</button>
            <button class="demo-tab" data-tab="code">${codeIcon} Código</button>
          </div>
        </div>

        <div class="demo-content">
          <div class="demo-main">
            <div id="tab-builder" class="tab-content active">
              <form-builder-visual id="demoBuilder"></form-builder-visual>
            </div>

            <div id="tab-preview" class="tab-content">
              <div class="preview-container">
                <div class="preview-header">
                  <h2>${textIcon} Vista Previa del Formulario</h2>
                  <p>Así se verá tu formulario para los usuarios finales</p>
                </div>
                <form-builder id="previewForm"></form-builder>
              </div>
            </div>

            <div id="tab-code" class="tab-content">
              <div class="preview-container">
                <div class="preview-header">
                  <h2>${laptopIcon} Schema JSON</h2>
                  <p>Código JSON generado por el constructor visual</p>
                </div>
                <div class="schema-display" id="codeDisplay">{ "fields": [] }</div>
              </div>
            </div>
          </div>

          <div class="demo-sidebar">
            <div class="sidebar-header">
              <h3>${chartIcon} Panel de Control</h3>
              <p class="sidebar-description">Estadísticas y acciones rápidas</p>
            </div>

            <div class="sidebar-content">
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-value" id="fieldCount">0</div>
                  <div class="stat-label">Campos</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value" id="requiredCount">0</div>
                  <div class="stat-label">Requeridos</div>
                </div>
              </div>

              <div class="demo-actions">
                <button class="btn-primary" id="loadContactForm">${contactIcon} Formulario de Contacto</button>
                <button class="btn-primary" id="loadRegistrationForm">${personIcon} Formulario de Registro</button>
                <button class="btn-primary" id="loadSurveyForm">${writebookIcon} Encuesta</button>
                <button class="btn-success" id="exportSchema">${saveIcon} Exportar JSON</button>
                <button class="btn-warning" id="importSchema">${folderIcon} Importar JSON</button>
                <button class="btn-danger" id="clearAll">${trashIcon} Limpiar Todo</button>
              </div>

              <div>
                <h4 class="schema-title">${paperIcon} Schema Actual</h4>
                <div class="schema-display" id="liveSchema">{ "fields": [] }</div>
              </div>
            </div>
          </div>
        </div>

        <div class="demo-footer">
          <div class="footer-info">
            <div class="footer-status">
              <div class="status-dot"></div>
              <span>Sistema activo</span>
            </div>
            <span>Última actualización: <span id="lastUpdate">--:--</span></span>
          </div>
          <div>
            <span>Zodiac Builder © 2025</span>
          </div>
        </div>
      </div>

      <input type="file" id="fileInput" accept=".json" class="hidden-input" />
    `;
  }

  private registerEvents(): void {
    this.demoBuilder = this.shadow.getElementById(
      "demoBuilder"
    ) as FormBuilderVisual;
    this.previewForm = this.shadow.getElementById("previewForm");
    this.fileInput = this.shadow.getElementById(
      "fileInput"
    ) as HTMLInputElement;

    const tabs = this.shadow.querySelectorAll(".demo-tab");
    tabs.forEach((tab) => {
      tab.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        const tabName = target.getAttribute("data-tab");
        if (tabName) {
          this.switchTab(tabName);
        }
      });
    });

    this.shadow
      .getElementById("loadContactForm")
      ?.addEventListener("click", () => this.loadContactForm());
    this.shadow
      .getElementById("loadRegistrationForm")
      ?.addEventListener("click", () => this.loadRegistrationForm());
    this.shadow
      .getElementById("loadSurveyForm")
      ?.addEventListener("click", () => this.loadSurveyForm());
    this.shadow
      .getElementById("exportSchema")
      ?.addEventListener("click", () => this.exportSchema());
    this.shadow
      .getElementById("importSchema")
      ?.addEventListener("click", () => this.importSchema());
    this.shadow
      .getElementById("clearAll")
      ?.addEventListener("click", () => this.clearAll());

    this.fileInput?.addEventListener("change", (event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const schema = JSON.parse(e.target?.result as string);
            this.demoBuilder?.loadSchema(schema);
            alert("Schema importado correctamente");
          } catch (error) {
            alert("Error al importar el archivo: " + (error as Error).message);
          }
        };
        reader.readAsText(file);
      }
      if (this.fileInput) {
        this.fileInput.value = "";
      }
    });

    this.demoBuilder.addEventListener("schema-changed", (event: Event) => {
      const schema = (event as CustomEvent).detail;
      this.updateStats(schema);
      this.updateLiveSchema(schema);

      if (this.currentTab === "preview") {
        this.updatePreview();
      }
    });
  }

  private switchTab(tabName: string): void {
    this.shadow.querySelectorAll(".tab-content").forEach((tab) => {
      tab.classList.remove("active");
    });

    this.shadow.querySelectorAll(".demo-tab").forEach((tab) => {
      tab.classList.remove("active");
    });

    this.shadow.getElementById(`tab-${tabName}`)?.classList.add("active");
    this.shadow
      .querySelector(`[data-tab="${tabName}"]`)
      ?.classList.add("active");

    this.currentTab = tabName;

    if (tabName === "preview" || tabName === "code") {
      this.updatePreview();
    }

    this.applyContrastToTabButtons();
  }

  private updateStats(schema: FormSchema): void {
    const fields = schema.fields || [];
    const requiredFields = fields.filter((field) => field.required);

    const fieldCountEl = this.shadow.getElementById("fieldCount");
    const requiredCountEl = this.shadow.getElementById("requiredCount");
    const lastUpdateEl = this.shadow.getElementById("lastUpdate");

    if (fieldCountEl) fieldCountEl.textContent = fields.length.toString();
    if (requiredCountEl)
      requiredCountEl.textContent = requiredFields.length.toString();

    const now = new Date();
    if (lastUpdateEl) lastUpdateEl.textContent = now.toLocaleTimeString();
  }

  private updateLiveSchema(schema: FormSchema): void {
    const formattedSchema = JSON.stringify(schema, null, 2);
    const liveSchemaEl = this.shadow.getElementById("liveSchema");
    const codeDisplayEl = this.shadow.getElementById("codeDisplay");

    if (liveSchemaEl) liveSchemaEl.textContent = formattedSchema;
    if (codeDisplayEl) codeDisplayEl.textContent = formattedSchema;
  }

  private updatePreview(): void {
    if (this.demoBuilder && this.previewForm) {
      const schema = this.demoBuilder.getSchema();
      (this.previewForm as any).schema = schema;
    }
  }

  private loadContactForm(): void {
    const schema: FormSchema = {
      fields: [
        {
          id: "contact-1",
          name: "nombre",
          label: "Nombre Completo",
          type: "text",
          placeholder: "Tu nombre completo",
          required: true,
        },
        {
          id: "contact-2",
          name: "email",
          label: "Correo Electrónico",
          type: "email",
          placeholder: "tu@email.com",
          required: true,
        },
        {
          id: "contact-3",
          name: "telefono",
          label: "Teléfono",
          type: "text",
          placeholder: "+34 600 000 000",
          required: false,
        },
        {
          id: "contact-4",
          name: "asunto",
          label: "Asunto",
          type: "select",
          required: true,
          options: [
            { value: "consulta", label: "Consulta General" },
            { value: "soporte", label: "Soporte Técnico" },
            { value: "ventas", label: "Información de Ventas" },
            { value: "otro", label: "Otro" },
          ],
        },
      ],
    };
    this.demoBuilder?.loadSchema(schema);
  }

  private loadRegistrationForm(): void {
    const schema: FormSchema = {
      fields: [
        {
          id: "reg-1",
          name: "nombre",
          label: "Nombre",
          type: "text",
          placeholder: "Tu nombre",
          required: true,
        },
        {
          id: "reg-2",
          name: "apellidos",
          label: "Apellidos",
          type: "text",
          placeholder: "Tus apellidos",
          required: true,
        },
        {
          id: "reg-3",
          name: "email",
          label: "Email",
          type: "email",
          placeholder: "tu@email.com",
          required: true,
        },
        {
          id: "reg-4",
          name: "password",
          label: "Contraseña",
          type: "password",
          placeholder: "Mínimo 8 caracteres",
          required: true,
        },
        {
          id: "reg-5",
          name: "fecha_nacimiento",
          label: "Fecha de Nacimiento",
          type: "date",
          required: true,
        },
        {
          id: "reg-6",
          name: "pais",
          label: "País",
          type: "select",
          required: true,
          options: [
            { value: "es", label: "España" },
            { value: "mx", label: "México" },
            { value: "ar", label: "Argentina" },
            { value: "co", label: "Colombia" },
            { value: "pe", label: "Perú" },
            { value: "cl", label: "Chile" },
          ],
        },
      ],
    };
    this.demoBuilder?.loadSchema(schema);
  }

  private loadSurveyForm(): void {
    const schema: FormSchema = {
      fields: [
        {
          id: "survey-1",
          name: "satisfaccion",
          label: "¿Qué tal tu experiencia?",
          type: "select",
          required: true,
          options: [
            { value: "5", label: "⭐⭐⭐⭐⭐ Excelente" },
            { value: "4", label: "⭐⭐⭐⭐ Muy buena" },
            { value: "3", label: "⭐⭐⭐ Buena" },
            { value: "2", label: "⭐⭐ Regular" },
            { value: "1", label: "⭐ Mala" },
          ],
        },
        {
          id: "survey-2",
          name: "recomendacion",
          label: "¿Nos recomendarías?",
          type: "select",
          required: true,
          options: [
            { value: "si", label: "Sí, definitivamente" },
            { value: "tal_vez", label: "Tal vez" },
            { value: "no", label: "No" },
          ],
        },
        {
          id: "survey-3",
          name: "email_contacto",
          label: "Email (opcional)",
          type: "email",
          placeholder: "Para seguimiento",
          required: false,
        },
      ],
    };
    this.demoBuilder?.loadSchema(schema);
  }

  private exportSchema(): void {
    if (!this.demoBuilder) return;

    const schema = this.demoBuilder.getSchema();
    const jsonString = JSON.stringify(schema, null, 2);

    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `form-schema-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private importSchema(): void {
    this.fileInput?.click();
  }

  private clearAll(): void {
    if (confirm("¿Estás seguro de que quieres limpiar todo el formulario?")) {
      this.demoBuilder?.loadSchema({ fields: [] });
    }
  }

  private applyContrastToButtons(): void {
    const buttons = this.shadow.querySelectorAll("button");
    buttons.forEach((button) => {
      ContrastUtils.applyContrastToButton(button as HTMLElement);
    });
  }

  private applyContrastToTabButtons(): void {
    const tabButtons = this.shadow.querySelectorAll(".demo-tab");
    tabButtons.forEach((button) => {
      ContrastUtils.applyContrastToButton(button as HTMLElement);
    });
  }
}

customElements.define("builder-demo-component", BuilderDemoComponent);
