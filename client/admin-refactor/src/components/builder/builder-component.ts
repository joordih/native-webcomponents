import "../page-builder/page-builder-component";
import "../visual-form-builder/visual-form-builder-component";

interface BuilderState {
  currentView: "dashboard" | "form-builder" | "page-builder";
  activeProject: {
    id: string;
    name: string;
    type: "form" | "page";
    lastModified: Date;
    description?: string;
  } | null;
  recentProjects: Array<{
    id: string;
    name: string;
    type: "form" | "page";
    lastModified: Date;
    thumbnail?: string;
  }>;
}

class BuilderComponent extends HTMLElement {
  private shadow: ShadowRoot;
  private state: BuilderState = {
    currentView: "dashboard",
    activeProject: null,
    recentProjects: [
      {
        id: "project_1",
        name: "Formulario de Contacto",
        type: "form",
        lastModified: new Date(Date.now() - 86400000),
        thumbnail: "📝"
      },
      {
        id: "project_2",
        name: "Landing Page Principal",
        type: "page",
        lastModified: new Date(Date.now() - 172800000),
        thumbnail: "🚀"
      }
    ],
  };

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback(): void {
    this.render();
    this.setupEventListeners();
  }

  private render(): void {
    this.shadow.innerHTML = `
      <link rel="stylesheet" href="/src/assets/components/builder/builder.css">
      
      <div class="builder-container">
        ${this.renderHeader()}
        
        <div class="builder-main">
          ${this.state.currentView === "dashboard" ? this.renderDashboard() : ""}
          
          <div class="view-content ${this.state.currentView === "form-builder" ? "active" : ""}">
            ${this.renderBuilderHeader("form")}
            <visual-form-builder></visual-form-builder>
          </div>
          
          <div class="view-content ${this.state.currentView === "page-builder" ? "active" : ""}">
            ${this.renderBuilderHeader("page")}
            <page-builder></page-builder>
          </div>
        </div>
      </div>
    `;
  }

  private renderHeader(): string {
    return `
      <header class="builder-header">
        <div class="header-brand">
          <div class="brand-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div class="brand-text">
            <h1>Constructor Visual</h1>
            <p>Crea formularios y páginas sin código</p>
          </div>
        </div>
        
        <nav class="header-nav">
          <button class="nav-btn ${this.state.currentView === "dashboard" ? "active" : ""}" data-view="dashboard">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
            Dashboard
          </button>
          <button class="nav-btn ${this.state.currentView === "form-builder" ? "active" : ""}" data-view="form-builder">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
            Formularios
          </button>
          <button class="nav-btn ${this.state.currentView === "page-builder" ? "active" : ""}" data-view="page-builder">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
            </svg>
            Páginas
          </button>
        </nav>
        
        <div class="header-actions">
          <button class="btn btn-ghost" data-action="settings">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
            </svg>
          </button>
          <button class="btn btn-primary" data-action="new-project">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Nuevo
          </button>
        </div>
      </header>
    `;
  }
  
  private renderDashboard(): string {
    return `
      <div class="dashboard">
        <div class="dashboard-hero">
          <div class="hero-content">
            <h2>¡Bienvenido al Constructor Visual!</h2>
            <p>Crea formularios y páginas web de manera visual, sin necesidad de código. Comienza con una plantilla o crea desde cero.</p>
            <div class="hero-actions">
              <button class="btn btn-primary btn-lg" data-action="create-form">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
                Crear Formulario
              </button>
              <button class="btn btn-secondary btn-lg" data-action="create-page">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                </svg>
                Crear Página
              </button>
            </div>
          </div>
          <div class="hero-visual">
            <div class="visual-grid">
              <div class="visual-card form-card">
                <div class="card-icon">📝</div>
                <div class="card-title">Formularios</div>
              </div>
              <div class="visual-card page-card">
                <div class="card-icon">🚀</div>
                <div class="card-title">Páginas</div>
              </div>
              <div class="visual-card template-card">
                <div class="card-icon">⚡</div>
                <div class="card-title">Plantillas</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="dashboard-content">
          <div class="content-section">
            <div class="section-header">
              <h3>Proyectos Recientes</h3>
              <button class="btn btn-ghost btn-sm" data-action="view-all">
                Ver todos
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </button>
            </div>
            <div class="projects-grid">
              ${this.state.recentProjects.map(project => `
                <div class="project-card" data-project="${project.id}" data-action="edit-project">
                  <div class="project-thumbnail">
                    ${project.thumbnail || (project.type === "form" ? "📝" : "🚀")}
                  </div>
                  <div class="project-info">
                    <h4>${project.name}</h4>
                    <p class="project-type">${project.type === "form" ? "Formulario" : "Página"}</p>
                    <p class="project-date">${this.formatDate(project.lastModified)}</p>
                  </div>
                  <div class="project-actions">
                    <button class="btn btn-ghost btn-sm" data-action="edit-project" data-project="${project.id}">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                      </svg>
                    </button>
                    <button class="btn btn-ghost btn-sm" data-action="duplicate-project" data-project="${project.id}">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              `).join("")}
              
              <div class="project-card create-new" data-action="new-project">
                <div class="create-content">
                  <div class="create-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                  </div>
                  <h4>Crear Nuevo</h4>
                  <p>Comienza un proyecto desde cero</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="content-section">
            <div class="section-header">
              <h3>Plantillas Populares</h3>
              <button class="btn btn-ghost btn-sm" data-action="browse-templates">
                Explorar todas
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </button>
            </div>
            <div class="templates-grid">
              ${this.renderPopularTemplates()}
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  private renderBuilderHeader(type: "form" | "page"): string {
    return `
      <div class="builder-header-bar">
        <div class="header-left">
          <button class="btn btn-ghost" data-action="back-to-dashboard">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Volver
          </button>
          <div class="header-divider"></div>
          <h2>${type === "form" ? "Constructor de Formularios" : "Constructor de Páginas"}</h2>
        </div>
        
        <div class="header-actions">
          <button class="btn btn-ghost" data-action="preview">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
            Vista Previa
          </button>
          <button class="btn btn-secondary" data-action="save">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
            </svg>
            Guardar
          </button>
          <button class="btn btn-primary" data-action="publish">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 4v2h14V4H5zm0 10h4v6h6v-6h4l-7-7-7 7z"/>
            </svg>
            Publicar
          </button>
        </div>
      </div>
    `;
  }
  
  private renderPopularTemplates(): string {
    const templates = [
      { id: "contact", name: "Formulario de Contacto", type: "form", icon: "📞" },
      { id: "landing", name: "Landing Page", type: "page", icon: "🚀" },
      { id: "survey", name: "Encuesta", type: "form", icon: "📊" },
      { id: "portfolio", name: "Portafolio", type: "page", icon: "🎨" }
    ];
    
    return templates.map(template => `
      <div class="template-card" data-template="${template.id}" data-type="${template.type}">
        <div class="template-icon">${template.icon}</div>
        <h4>${template.name}</h4>
        <p class="template-type">${template.type === "form" ? "Formulario" : "Página"}</p>
        <button class="btn btn-sm btn-primary" data-action="use-template" data-template="${template.id}">
          Usar plantilla
        </button>
      </div>
    `).join("");
  }
  
  private formatDate(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Ayer";
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString();
  }

  private renderTemplatesView(): string {
    const templates = [
      {
        id: "contact-form",
        type: "form",
        title: "Formulario de Contacto",
        description: "Formulario básico con campos de nombre, email y mensaje",
        icon: "📝",
      },
      {
        id: "registration-form",
        type: "form",
        title: "Formulario de Registro",
        description:
          "Formulario completo para registro de usuarios con validaciones",
        icon: "👤",
      },
      {
        id: "survey-form",
        type: "form",
        title: "Encuesta",
        description: "Formulario de encuesta con diferentes tipos de preguntas",
        icon: "📊",
      },
      {
        id: "landing-page",
        type: "page",
        title: "Página de Aterrizaje",
        description:
          "Página promocional con hero, características y call-to-action",
        icon: "🚀",
      },
      {
        id: "blog-post",
        type: "page",
        title: "Artículo de Blog",
        description:
          "Estructura típica de un artículo con título, contenido y sidebar",
        icon: "📰",
      },
      {
        id: "portfolio",
        type: "page",
        title: "Portafolio",
        description: "Página de portafolio con galería de proyectos",
        icon: "🎨",
      },
    ];

    return `
      <div class="templates-view">
        <div class="empty-state">
          <svg class="empty-state-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
          <h3>Plantillas Prediseñadas</h3>
          <p>Comienza rápidamente con nuestras plantillas prediseñadas o crea tu propio diseño desde cero</p>
          <button class="btn btn-primary" data-action="create-blank">
            <svg class="btn-icon" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Crear desde Cero
          </button>
        </div>
        
        <div class="templates-grid">
          ${templates
            .map(
              (template) => `
            <div class="template-card" data-template="${template.id}" data-type="${template.type}">
              <div class="template-preview">
                ${template.icon}
              </div>
              <h3 class="template-title">${template.title}</h3>
              <p class="template-description">${template.description}</p>
              <span class="template-type">${template.type === "form" ? "Formulario" : "Página"}</span>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  private setupEventListeners(): void {
    this.shadow.addEventListener("click", this.handleClick.bind(this));
  }

  private handleClick(event: Event): void {
    const target = event.target as HTMLElement;
    const action = target.getAttribute("data-action");
    const view = target.getAttribute("data-view");
    const template = target.getAttribute("data-template");
    const templateType = target.getAttribute("data-type");
    const project = target.getAttribute("data-project");

    if (view) {
      this.switchView(view as "dashboard" | "form-builder" | "page-builder" | "templates");
    }

    if (template && templateType) {
      this.loadTemplate(template, templateType as "form" | "page");
    }

    switch (action) {
      case "new-project":
      case "create-form":
        this.createNewProject("form");
        break;
      case "create-page":
        this.createNewProject("page");
        break;
      case "save":
      case "save-project":
        this.saveProject();
        break;
      case "use-template":
        if (template) {
          this.loadTemplate(template, templateType as "form" | "page");
        }
        break;
      case "create-blank":
        this.createBlankProject();
        break;
      case "edit-project":
        if (project) {
          this.editProject(project);
        }
        break;
      case "duplicate-project":
        if (project) {
          this.duplicateProject(project);
        }
        break;
      case "back-to-dashboard":
        this.switchView("dashboard");
        break;
      case "preview":
        this.previewProject();
        break;
      case "publish":
        this.publishProject();
        break;
      case "settings":
        this.openSettings();
        break;
      case "view-all":
        this.viewAllProjects();
        break;
      case "browse-templates":
        this.switchView("templates");
        break;
    }
  }

  private switchView(
    view: "dashboard" | "form-builder" | "page-builder" | "templates"
  ): void {
    this.state.currentView = view;
    this.render();
  }

  private loadTemplate(templateId: string, templateType?: "form" | "page"): void {
    const templates = {
      contact: { name: "Formulario de Contacto", type: "form" as const },
      landing: { name: "Landing Page", type: "page" as const },
      survey: { name: "Encuesta", type: "form" as const },
      portfolio: { name: "Portafolio", type: "page" as const },
      registration: { name: "Formulario de Registro", type: "form" as const },
      blog: { name: "Página de Blog", type: "page" as const }
    };
    
    const template = templates[templateId as keyof typeof templates];
    if (template) {
      this.state.activeProject = {
        id: `template_${templateId}_${Date.now()}`,
        name: template.name,
        type: templateType || template.type,
        lastModified: new Date(),
      };
      
      // Cambiar a la vista apropiada
      this.state.currentView = this.state.activeProject.type === "form" ? "form-builder" : "page-builder";
      this.render();
      
      console.log(`Plantilla cargada: ${template.name}`);
    }
  }

  private createNewProject(type?: "form" | "page"): void {
    const projectType = type || (this.state.currentView === "form-builder" ? "form" : "page");
    const projectName = prompt(`Nombre del ${projectType === "form" ? "formulario" : "página"}:`);
    if (projectName) {
      this.state.activeProject = {
        id: `project_${Date.now()}`,
        name: projectName,
        type: projectType,
        lastModified: new Date(),
      };
      this.state.currentView = projectType === "form" ? "form-builder" : "page-builder";
      this.render();
    }
  }

  private editProject(projectId: string): void {
    const project = this.state.recentProjects.find(p => p.id === projectId);
    if (project) {
      this.state.activeProject = {
        ...project,
        description: undefined
      };
      this.state.currentView = project.type === "form" ? "form-builder" : "page-builder";
      this.render();
    }
  }

  private duplicateProject(projectId: string): void {
    const project = this.state.recentProjects.find(p => p.id === projectId);
    if (project) {
      const newProject = {
        ...project,
        id: `project_${Date.now()}`,
        name: `${project.name} (Copia)`,
        lastModified: new Date()
      };
      this.state.recentProjects.unshift(newProject);
      this.render();
    }
  }

  private previewProject(): void {
    if (this.state.activeProject) {
      console.log(`Previsualizando proyecto: ${this.state.activeProject.name}`);
      // Aquí se implementaría la lógica de preview
    }
  }

  private publishProject(): void {
    if (this.state.activeProject) {
      console.log(`Publicando proyecto: ${this.state.activeProject.name}`);
      // Aquí se implementaría la lógica de publicación
    }
  }

  private openSettings(): void {
    console.log("Abriendo configuración");
    // Aquí se implementaría la lógica de configuración
  }

  private viewAllProjects(): void {
    console.log("Viendo todos los proyectos");
    // Aquí se implementaría la vista de todos los proyectos
  }

  private createBlankProject(): void {
    const type = confirm(
      "¿Crear un formulario? (Cancelar para crear una página)"
    )
      ? "form"
      : "page";

    this.state.activeProject = {
      id: `project_${Date.now()}`,
      name: `Nuevo ${type === "form" ? "Formulario" : "Página"}`,
      type: type,
      lastModified: new Date(),
    };

    this.state.currentView = type === "form" ? "form-builder" : "page-builder";
    this.render();
  }

  private saveProject(): void {
    if (!this.state.activeProject) {
      alert("No hay proyecto activo para guardar");
      return;
    }

    this.state.activeProject.lastModified = new Date();
    alert(`Proyecto "${this.state.activeProject.name}" guardado exitosamente`);
    this.render();
  }

  public getCurrentView(): string {
    return this.state.currentView;
  }

  public getActiveProject() {
    return this.state.activeProject;
  }
}

customElements.define("builder-component", BuilderComponent);

export { BuilderComponent };
