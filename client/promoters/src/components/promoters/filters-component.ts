import style from '../../assets/components/promoters/filters.css?inline'

interface FilterState {
  name?: string
  email?: string
  status?: string
  dateFrom?: string
  dateTo?: string
}

class FiltersComponent extends HTMLElement {
  private shadow: ShadowRoot
  private isCollapsed: boolean
  private activeFilters: Map<string, string> = new Map()
  private draftFilters: Map<string, string> = new Map()
  private handleResize: (...args: any[]) => void

  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.isCollapsed = this.getInitialCollapsedState()

    const sheet = new CSSStyleSheet()
    sheet.replaceSync(style)
    this.shadow.adoptedStyleSheets = [sheet]

    this.handleResize = this.debounce(this.onResize.bind(this), 250)
  }

  connectedCallback(): void {
    this.style.display = 'none'
    this.classList.add('hidden')
    window.addEventListener('resize', this.handleResize)
    this.render()
    this.setupEventListeners()
  }

  disconnectedCallback(): void {
    window.removeEventListener('resize', this.handleResize)
  }

  private getInitialCollapsedState(): boolean {
    return window.innerWidth <= 768
  }

  private onResize(): void {
    const wasMobile = this.isCollapsed && window.innerWidth > 768
    const isNowMobile = !this.isCollapsed && window.innerWidth <= 768

    if (wasMobile || isNowMobile) {
      this.isCollapsed = window.innerWidth <= 768
      this.render()
      this.setupEventListeners()
    }
  }

  private debounce(func: Function, wait: number): (...args: any[]) => void {
    let timeout: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  private render(): void {
    this.shadow.innerHTML = /* html */ `
      <div class="filters-overlay">
        <div class="filters-menu" part="menu">
          <div class="filters-header">
            <h3 class="filters-title">Filtros de Búsqueda</h3>
            <button class="close-filters" type="button" aria-label="Cerrar filtros">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div class="filters-content">
            <div class="filter-group">
              <label class="filter-label" for="search-name">Buscar por nombre</label>
              <input 
                type="text" 
                id="search-name" 
                class="filter-input" 
                placeholder="Ingresa el nombre del promoter..."
                value="${this.draftFilters.get('name') || ''}"
              >
            </div>
            
            <div class="filter-group">
              <label class="filter-label" for="search-email">Buscar por email</label>
              <input 
                type="email" 
                id="search-email" 
                class="filter-input" 
                placeholder="Ingresa el email del promoter..."
                value="${this.draftFilters.get('email') || ''}"
              >
            </div>
            
            <div class="filter-group">
              <label class="filter-label" for="filter-status">Estado</label>
              <select id="filter-status" class="filter-select">
                <option value="">Todos los estados</option>
                <option value="active" ${
                  this.draftFilters.get('status') === 'active' ? 'selected' : ''
                }>Activo</option>
                <option value="inactive" ${
                  this.draftFilters.get('status') === 'inactive' ? 'selected' : ''
                }>Inactivo</option>
                <option value="pending" ${
                  this.draftFilters.get('status') === 'pending' ? 'selected' : ''
                }>Pendiente</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label class="filter-label" for="date-from">Fecha desde</label>
              <input 
                type="date" 
                id="date-from" 
                class="filter-input"
                value="${this.draftFilters.get('dateFrom') || ''}"
              >
            </div>
            
            <div class="filter-group">
              <label class="filter-label" for="date-to">Fecha hasta</label>
              <input 
                type="date" 
                id="date-to" 
                class="filter-input"
                value="${this.draftFilters.get('dateTo') || ''}"
              >
            </div>
          </div>
          
          <div class="filters-actions">
            <button class="filter-button secondary" type="button" id="clear-filters">
              Limpiar Filtros
            </button>
            <button class="filter-button primary" type="button" id="apply-filters">
              Aplicar Filtros
            </button>
          </div>
          
          ${this.getActiveFiltersHTML()}
        </div>
      </div>
    `
  }

  private getActiveFiltersHTML(): string {
    if (this.activeFilters.size === 0) return ''

    const filterTags = Array.from(this.activeFilters.entries())
      .filter(([key, value]) => value && value.trim() !== '')
      .map(([key, value]) => {
        const label = this.getFilterLabel(key, value)
        return `
          <div class="filter-tag">
            <span>${label}</span>
            <button class="filter-tag-remove" data-filter="${key}" type="button">×</button>
          </div>
        `
      })
      .join('')

    return filterTags
      ? `
      <div class="active-filters">
        ${filterTags}
      </div>
    `
      : ''
  }

  private getFilterLabel(key: string, value: string): string {
    const labels: Record<string, string> = {
      name: `Nombre: ${value}`,
      email: `Email: ${value}`,
      status: `Estado: ${this.getStatusLabel(value)}`,
      dateFrom: `Desde: ${value}`,
      dateTo: `Hasta: ${value}`
    }
    return labels[key] || `${key}: ${value}`
  }

  private getStatusLabel(value: string): string {
    const statusLabels: Record<string, string> = {
      active: 'Activo',
      inactive: 'Inactivo',
      pending: 'Pendiente'
    }
    return statusLabels[value] || value
  }

  private updateFilter(key: string, value: string): void {
    const newDraftFilters = new Map(this.draftFilters)
    if (value) {
      newDraftFilters.set(key, value)
    } else {
      newDraftFilters.delete(key)
    }
    this.draftFilters = newDraftFilters
  }

  private applyFilters(): void {
    this.activeFilters = new Map(this.draftFilters)
    this.dispatchFilterEvent()
    this.hide()
  }

  private clearAllFilters(): void {
    this.activeFilters.clear()
    this.draftFilters.clear()
    this.dispatchFilterEvent()
    this.render()
    this.setupEventListeners()
  }

  private removeFilter(key: string): void {
    this.activeFilters.delete(key)
    this.draftFilters.delete(key)
    this.dispatchFilterEvent()
    this.render()
    this.setupEventListeners()
  }

  private setupEventListeners(): void {
    const closeButton = this.shadow.querySelector('.close-filters')
    closeButton?.addEventListener('click', () => {
      this.hide()
    })

    const overlay = this.shadow.querySelector('.filters-overlay')
    overlay?.addEventListener('click', (e: Event) => {
      if (e.target === overlay) {
        this.hide()
      }
    })

    const menu = this.shadow.querySelector('.filters-menu')
    menu?.addEventListener('click', (e: Event) => {
      e.stopPropagation()
    })

    const interactiveElements = this.shadow.querySelectorAll(
      'input, select, button, .filter-tag'
    )
    interactiveElements.forEach(element => {
      element.addEventListener('click', (e: Event) => {
        e.stopPropagation()
      })
    })

    const nameInput = this.shadow.querySelector('#search-name') as HTMLInputElement
    nameInput?.addEventListener('input', (e: Event) =>
      this.updateFilter('name', (e.target as HTMLInputElement).value)
    )
    nameInput?.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') this.applyFilters()
    })

    const emailInput = this.shadow.querySelector('#search-email') as HTMLInputElement
    emailInput?.addEventListener('input', (e: Event) =>
      this.updateFilter('email', (e.target as HTMLInputElement).value)
    )
    emailInput?.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') this.applyFilters()
    })

    const statusSelect = this.shadow.querySelector('#filter-status') as HTMLSelectElement
    statusSelect?.addEventListener('change', (e: Event) =>
      this.updateFilter('status', (e.target as HTMLSelectElement).value)
    )

    const dateFromInput = this.shadow.querySelector('#date-from') as HTMLInputElement
    const dateToInput = this.shadow.querySelector('#date-to') as HTMLInputElement

    dateFromInput?.addEventListener('change', (e: Event) =>
      this.updateFilter('dateFrom', (e.target as HTMLInputElement).value)
    )
    dateToInput?.addEventListener('change', (e: Event) =>
      this.updateFilter('dateTo', (e.target as HTMLInputElement).value)
    )

    const clearButton = this.shadow.querySelector('#clear-filters')
    clearButton?.addEventListener('click', () => this.clearAllFilters())

    const applyButton = this.shadow.querySelector('#apply-filters')
    applyButton?.addEventListener('click', () => this.applyFilters())

    const removeButtons = this.shadow.querySelectorAll('.filter-tag-remove')
    removeButtons.forEach(button => {
      button.addEventListener('click', (e: Event) => {
        const filterKey = (e.target as HTMLElement).dataset.filter
        if (filterKey) {
          this.removeFilter(filterKey)
        }
      })
    })
  }

  private dispatchFilterEvent(): void {
    const filterData = Object.fromEntries(this.activeFilters)

    this.dispatchEvent(
      new CustomEvent('filtersChanged', {
        detail: { filters: filterData, searchTerm: filterData.name || filterData.email },
        bubbles: true,
        composed: true
      })
    )
  }

  public getActiveFilters(): Record<string, string> {
    return Object.fromEntries(this.activeFilters)
  }

  public setFilters(filters: Record<string, string>): void {
    this.activeFilters.clear()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        this.activeFilters.set(key, value)
      }
    })
    this.render()
    this.setupEventListeners()
  }

  public show(): void {
    this.draftFilters = new Map(this.activeFilters)
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

  public toggle(): void {
    const isHidden = !this.classList.contains('show')

    if (isHidden) {
      this.show()
    } else {
      this.hide()
    }
  }
}

customElements.define('filters-component', FiltersComponent)

export default FiltersComponent