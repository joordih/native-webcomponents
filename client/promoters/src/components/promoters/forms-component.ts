import style from '../../assets/components/promoters/promoters.css?inline'

interface PromoterData {
  id?: string
  name: string
  email: string
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

class Forms extends HTMLElement {
  private shadow: ShadowRoot
  private activeTab: string = 'general'
  private promoterData: PromoterData | null = null
  private isEditMode: boolean = false

  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })

    const sheet = new CSSStyleSheet()
    sheet.replaceSync(style)
    this.shadow.adoptedStyleSheets = [sheet]
  }

  connectedCallback(): void {
    this.style.display = 'none'
    this.classList.add('hidden')
    this.render()
    this.setupEventListeners()
  }

  private render(): void {
    this.shadow.innerHTML = this.getTemplate()
  }

  private getTemplate(): string {
    return /* html */ `
      <div class="forms-overlay">
        <div class="forms-container">
          <div class="forms-header">
            <h2 class="forms-title">
              ${this.isEditMode ? 'Editar Promoter' : 'Nuevo Promoter'}
            </h2>
            <button class="close-forms" type="button" aria-label="Cerrar formulario">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          ${this.getTabsTemplate()}

          <form class="forms-content" id="promoter-form">
            ${this.getTabContent()}
          </form>

          ${this.getActionButtonTemplate()}
        </div>
      </div>
    `
  }

  private getTabsTemplate(): string {
    if (!this.isEditMode) return ''

    return /* html */ `
      <div class="forms-tabs">
        <button 
          type="button" 
          class="tab-button ${this.activeTab === 'general' ? 'active' : ''}" 
          data-tab="general"
        >
          General
        </button>
        <button 
          type="button" 
          class="tab-button ${this.activeTab === 'misc' ? 'active' : ''}" 
          data-tab="misc"
        >
          Información
        </button>
      </div>
    `
  }

  private getTabContent(): string {
    if (!this.isEditMode) {
      return this.getCreateTabTemplate()
    }

    switch (this.activeTab) {
      case 'general':
        return this.getGeneralTabTemplate()
      case 'misc':
        return this.getMiscTabTemplate()
      default:
        return this.getGeneralTabTemplate()
    }
  }

  private getGeneralTabTemplate(): string {
    return /* html */ `
      <div class="tab-content" data-tab="general">
        <div class="form-group">
          <label for="promoter-name" class="form-label">Nombre *</label>
          <input 
            type="text" 
            id="promoter-name" 
            name="name" 
            class="form-input" 
            placeholder="Ingresa el nombre del promoter"
            value="${this.promoterData?.name || ''}"
            required
          >
        </div>

        <div class="form-group">
          <label for="promoter-email" class="form-label">Email *</label>
          <input 
            type="email" 
            id="promoter-email" 
            name="email" 
            class="form-input" 
            placeholder="Ingresa el email del promoter"
            value="${this.promoterData?.email || ''}"
            required
          >
        </div>
      </div>
    `
  }

  private getMiscTabTemplate(): string {
    return /* html */ `
      <div class="tab-content" data-tab="misc">
        <div class="form-group">
          <label for="promoter-id" class="form-label">ID</label>
          <input 
            type="text" 
            id="promoter-id" 
            name="id" 
            class="form-input" 
            value="${this.promoterData?.id || ''}"
            readonly
          >
        </div>

        <div class="form-group">
          <label for="promoter-created" class="form-label">Fecha de Creación</label>
          <input 
            type="text" 
            id="promoter-created" 
            name="createdAt" 
            class="form-input" 
            value="${this.formatDate(this.promoterData?.createdAt)}"
            readonly
          >
        </div>

        <div class="form-group">
          <label for="promoter-updated" class="form-label">Última Actualización</label>
          <input 
            type="text" 
            id="promoter-updated" 
            name="updatedAt" 
            class="form-input" 
            value="${this.formatDate(this.promoterData?.updatedAt)}"
            readonly
          >
        </div>

        ${this.promoterData?.deletedAt ? `
          <div class="form-group">
            <label for="promoter-deleted" class="form-label">Fecha de Eliminación</label>
            <input 
              type="text" 
              id="promoter-deleted" 
              name="deletedAt" 
              class="form-input" 
              value="${this.formatDate(this.promoterData.deletedAt)}"
              readonly
            >
          </div>
        ` : ''}
      </div>
    `
  }

  private getCreateTabTemplate(): string {
    return /* html */ `
      <div class="tab-content" data-tab="create">
        <div class="form-group">
          <label for="new-promoter-name" class="form-label">Nombre *</label>
          <input 
            type="text" 
            id="new-promoter-name" 
            name="name" 
            class="form-input" 
            placeholder="Ingresa el nombre del promoter"
            required
          >
        </div>

        <div class="form-group">
          <label for="new-promoter-email" class="form-label">Email *</label>
          <input 
            type="email" 
            id="new-promoter-email" 
            name="email" 
            class="form-input" 
            placeholder="Ingresa el email del promoter"
            required
          >
        </div>
      </div>
    `
  }

  private getActionButtonTemplate(): string {
    return /* html */ `
      <div class="forms-actions">
        <button type="button" class="form-button secondary" id="cancel-form">
          Cancelar
        </button>
        <button type="submit" class="form-button primary" id="save-form">
          ${this.isEditMode ? 'Guardar Cambios' : 'Crear Promoter'}
        </button>
      </div>
    `
  }

  private formatDate(dateString?: string): string {
    if (!dateString) return ''
    
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  private setupEventListeners(): void {
    const closeButton = this.shadow.querySelector('.close-forms')
    closeButton?.addEventListener('click', () => this.hide())

    const overlay = this.shadow.querySelector('.forms-overlay')
    overlay?.addEventListener('click', (e: Event) => {
      if (e.target === overlay) {
        this.hide()
      }
    })

    const container = this.shadow.querySelector('.forms-container')
    container?.addEventListener('click', (e: Event) => {
      e.stopPropagation()
    })

    const tabButtons = this.shadow.querySelectorAll('.tab-button')
    tabButtons.forEach(button => {
      button.addEventListener('click', (e: Event) => {
        const tab = (e.target as HTMLElement).dataset.tab
        if (tab) {
          this.switchTab(tab)
        }
      })
    })

    const form = this.shadow.querySelector('#promoter-form')
    form?.addEventListener('submit', (e: Event) => {
      e.preventDefault()
      this.handleSubmit()
    })

    const cancelButton = this.shadow.querySelector('#cancel-form')
    cancelButton?.addEventListener('click', () => this.hide())

    const inputs = this.shadow.querySelectorAll('.form-input')
    inputs.forEach(input => {
      input.addEventListener('input', (e: Event) => {
        this.handleInputChange(e.target as HTMLInputElement)
      })
    })
  }

  private switchTab(tab: string): void {
    this.activeTab = tab
    this.render()
    this.setupEventListeners()
  }

  private handleInputChange(input: HTMLInputElement): void {
    if (!this.promoterData) return

    const { name, value } = input
    if (name in this.promoterData) {
      (this.promoterData as any)[name] = value
    }
  }

  private async handleSubmit(): Promise<void> {
    const formData = this.getFormData()
    
    if (!this.validateForm(formData)) {
      return
    }

    try {
      if (this.isEditMode) {
        await this.savePromoter(formData)
      } else {
        await this.createPromoter(formData)
      }
      this.hide()
      this.dispatchSuccessEvent()
    } catch (error) {
      console.error('Error al procesar el formulario:', error)
      this.showError('Error al procesar la solicitud. Inténtalo de nuevo.')
    }
  }

  private getFormData(): PromoterData {
    const form = this.shadow.querySelector('#promoter-form') as HTMLFormElement
    const formData = new FormData(form)
    
    return {
      id: this.promoterData?.id,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      createdAt: this.promoterData?.createdAt,
      updatedAt: this.promoterData?.updatedAt,
      deletedAt: this.promoterData?.deletedAt
    }
  }

  private validateForm(data: PromoterData): boolean {
    if (!data.name?.trim()) {
      this.showError('El nombre es requerido')
      return false
    }

    if (!data.email?.trim()) {
      this.showError('El email es requerido')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      this.showError('El email no tiene un formato válido')
      return false
    }

    return true
  }

  private async savePromoter(data: PromoterData): Promise<void> {
    const response = await fetch(`/api/admin/promoters/${data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email
      })
    })

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }
  }

  private async createPromoter(data: PromoterData): Promise<void> {
    const response = await fetch('/api/admin/promoters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email
      })
    })

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }
  }

  private showError(message: string): void {
    // Crear un elemento de error temporal
    const errorDiv = document.createElement('div')
    errorDiv.className = 'error-message'
    errorDiv.textContent = message
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ef4444;
      color: white;
      padding: 12px 16px;
      border-radius: 6px;
      z-index: 10000;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `

    document.body.appendChild(errorDiv)

    setTimeout(() => {
      errorDiv.remove()
    }, 5000)
  }

  private dispatchSuccessEvent(): void {
    this.dispatchEvent(
      new CustomEvent('promoterSaved', {
        detail: { 
          action: this.isEditMode ? 'updated' : 'created',
          promoter: this.promoterData 
        },
        bubbles: true,
        composed: true
      })
    )
  }

  public showCreateForm(): void {
    this.isEditMode = false
    this.promoterData = null
    this.activeTab = 'general'
    this.show()
  }

  public showEditForm(promoterData: PromoterData): void {
    this.isEditMode = true
    this.promoterData = { ...promoterData }
    this.activeTab = 'general'
    this.show()
  }

  private show(): void {
    this.render()
    this.setupEventListeners()
    this.style.display = 'block'
    
    setTimeout(() => {
      this.classList.add('show')
      this.classList.remove('hidden')
    }, 10)
    
    document.body.style.overflow = 'hidden'
  }

  public hide(): void {
    this.classList.remove('show')
    this.classList.add('hidden')

    setTimeout(() => {
      if (this.classList.contains('hidden')) {
        this.style.display = 'none'
      }
    }, 200)
    
    document.body.style.overflow = ''
  }
}

customElements.define('forms-component', Forms)

export default Forms