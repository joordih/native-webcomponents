import style from '@assets/components/promoters/filters.css?inline'
import { store } from '@redux/store.js'
import {
  setSearchTerm,
  initDraftFilters,
  setDraftFilters,
  applyDraftFilters,
  clearFilters
} from '@redux/slices/promoters/promoters-slice.js'

class FiltersComponent extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.isCollapsed = this.getInitialCollapsedState()
    this.activeFilters = new Map()
    this.draftFilters = new Map()
    this.unsubscribe = null

    const sheet = new CSSStyleSheet()
    sheet.replaceSync(style)
    this.shadow.adoptedStyleSheets = [sheet]

    this.handleResize = this.debounce(this.onResize.bind(this), 250)
  }

  connectedCallback () {
    this.style.display = 'none'
    this.classList.remove('hidden')
    this.unsubscribe = store.subscribe(() => {
      const { searchTerm, draftFilters } = store.getState().promoters
      const newActiveFilters = new Map(Object.entries(searchTerm || {}))
      const newDraftFilters = new Map(Object.entries(draftFilters || {}))

      const activeFiltersChanged = JSON.stringify(Array.from(newActiveFilters.entries())) !==
          JSON.stringify(Array.from(this.activeFilters.entries()))
      const draftFiltersChanged = JSON.stringify(Array.from(newDraftFilters.entries())) !==
          JSON.stringify(Array.from(this.draftFilters.entries()))

      this.activeFilters = newActiveFilters
      this.draftFilters = newDraftFilters

      if (activeFiltersChanged) {
        this.render()
        this.setupEventListeners()
      } else if (draftFiltersChanged) {
        this.updateInputValues()
      }
    })

    window.addEventListener('resize', this.handleResize)
    this.render()
    this.setupEventListeners()
  }

  disconnectedCallback () {
    window.removeEventListener('resize', this.handleResize)
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }

  getInitialCollapsedState () {
    return window.innerWidth <= 768
  }

  onResize () {
    const wasMobile = this.isCollapsed && window.innerWidth > 768
    const isNowMobile = !this.isCollapsed && window.innerWidth <= 768

    if (wasMobile || isNowMobile) {
      this.isCollapsed = window.innerWidth <= 768
      this.render()
      this.setupEventListeners()
    }
  }

  debounce (func, wait) {
    let timeout
    return (...args) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  updateInputValues () {
    const nameInput = this.shadow.querySelector('#search-name')
    const emailInput = this.shadow.querySelector('#search-email')
    const statusSelect = this.shadow.querySelector('#filter-status')
    const roleSelect = this.shadow.querySelector('#filter-role')
    const dateFromInput = this.shadow.querySelector('#date-from')
    const dateToInput = this.shadow.querySelector('#date-to')

    if (nameInput && nameInput !== document.activeElement) {
      nameInput.value = this.draftFilters.get('name') || ''
    }
    if (emailInput && emailInput !== document.activeElement) {
      emailInput.value = this.draftFilters.get('email') || ''
    }
    if (statusSelect && statusSelect !== document.activeElement) {
      statusSelect.value = this.draftFilters.get('status') || ''
    }
    if (roleSelect && roleSelect !== document.activeElement) {
      roleSelect.value = this.draftFilters.get('role') || ''
    }
    if (dateFromInput && dateFromInput !== document.activeElement) {
      dateFromInput.value = this.draftFilters.get('dateFrom') || ''
    }
    if (dateToInput && dateToInput !== document.activeElement) {
      dateToInput.value = this.draftFilters.get('dateTo') || ''
    }
  }

  render () {
    this.shadow.innerHTML = /* html */ `
      <!-- <div class="search-container">
        <input 
          type="text" 
          id="search-input" 
          class="search-input" 
          placeholder="Buscar promotores..."
          value="${this.getSearchValue()}"
        >
      </div> -->
      
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
                placeholder="Ingresa el nombre del promotor..."
                value="${this.draftFilters.get('name') || ''}"
              >
          </div>
          
          <div class="filter-group">
            <label class="filter-label" for="search-email">Buscar por email</label>
            <input 
              type="email" 
              id="search-email" 
              class="filter-input" 
              placeholder="Ingresa el email del promotor..."
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
            <label class="filter-label" for="filter-role">Rol</label>
            <select id="filter-role" class="filter-select">
              <option value="">Todos los roles</option>
              <option value="promoter" ${
                this.draftFilters.get('role') === 'promoter' ? 'selected' : ''
              }>Promotor</option>
              <option value="manager" ${
                this.draftFilters.get('role') === 'manager' ? 'selected' : ''
              }>Manager</option>
              <option value="supervisor" ${
                this.draftFilters.get('role') === 'supervisor' ? 'selected' : ''
              }>Supervisor</option>
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
  </div>
    `
  }

  getSearchValue () {
    const searchTerm = store.getState().promoters.searchTerm
    if (typeof searchTerm === 'string') {
      return searchTerm
    }
    return ''
  }

  getActiveFiltersHTML () {
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

  getFilterLabel (key, value) {
    const labels = {
      name: `Nombre: ${value}`,
      email: `Email: ${value}`,
      status: `Estado: ${this.getStatusLabel(value)}`,
      role: `Rol: ${this.getRoleLabel(value)}`,
      dateFrom: `Desde: ${value}`,
      dateTo: `Hasta: ${value}`
    }
    return labels[key] || `${key}: ${value}`
  }

  getStatusLabel (value) {
    const statusLabels = {
      active: 'Activo',
      inactive: 'Inactivo',
      pending: 'Pendiente'
    }
    return statusLabels[value] || value
  }

  getRoleLabel (value) {
    const roleLabels = {
      promoter: 'Promotor',
      manager: 'Manager',
      supervisor: 'Supervisor'
    }
    return roleLabels[value] || value
  }

  updateFilter (key, value) {
    const newDraftFilters = new Map(this.draftFilters)
    if (value) {
      newDraftFilters.set(key, value)
    } else {
      newDraftFilters.delete(key)
    }
    store.dispatch(setDraftFilters(Object.fromEntries(newDraftFilters)))
  }

  applyFilters () {
    store.dispatch(applyDraftFilters())
    this.hide()

    // Dispatch custom event for datatable
    const searchTerm = this.shadow.querySelector('#search-input')?.value || ''
    const filters = Object.fromEntries(this.draftFilters)
    this.dispatchEvent(
      new CustomEvent('filtersChanged', {
        detail: { searchTerm, filters },
        bubbles: true,
        composed: true
      })
    )
  }

  clearAllFilters () {
    store.dispatch(clearFilters())
    const searchInput = this.shadow.querySelector('#search-input')
    if (searchInput) {
      searchInput.value = ''
    }
    this.dispatchEvent(
      new CustomEvent('filtersChanged', {
        detail: { searchTerm: '', filters: {} },
        bubbles: true,
        composed: true
      })
    )
  }

  removeFilter (key) {
    const newFilters = new Map(this.activeFilters)
    newFilters.delete(key)
    store.dispatch(setSearchTerm(Object.fromEntries(newFilters)))
  }

  setupEventListeners () {
    // Search input
    const searchInput = this.shadow.querySelector('#search-input')
    searchInput?.addEventListener('input', e => {
      const searchTerm = e.target.value
      this.dispatchEvent(
        new CustomEvent('filtersChanged', {
          detail: { searchTerm },
          bubbles: true,
          composed: true
        })
      )
    })

    const closeButton = this.shadow.querySelector('.close-filters')
    closeButton?.addEventListener('click', () => {
      this.hide()
    })

    const overlay = this.shadow.querySelector('.filters-overlay')
    overlay?.addEventListener('click', e => {
      if (e.target === overlay) {
        this.hide()
      }
    })

    const menu = this.shadow.querySelector('.filters-menu')
    menu?.addEventListener('click', e => {
      e.stopPropagation()
    })

    const interactiveElements = this.shadow.querySelectorAll(
      'input, select, button, .filter-tag'
    )
    interactiveElements.forEach(element => {
      element.addEventListener('click', e => {
        e.stopPropagation()
      })
    })

    const nameInput = this.shadow.querySelector('#search-name')
    nameInput?.addEventListener('input', e =>
      this.updateFilter('name', e.target.value)
    )
    nameInput?.addEventListener('keydown', e => {
      if (e.key === 'Enter') this.applyFilters()
    })

    const emailInput = this.shadow.querySelector('#search-email')
    emailInput?.addEventListener('input', e =>
      this.updateFilter('email', e.target.value)
    )
    emailInput?.addEventListener('keydown', e => {
      if (e.key === 'Enter') this.applyFilters()
    })

    const statusSelect = this.shadow.querySelector('#filter-status')
    const roleSelect = this.shadow.querySelector('#filter-role')

    statusSelect?.addEventListener('change', e =>
      this.updateFilter('status', e.target.value)
    )
    roleSelect?.addEventListener('change', e =>
      this.updateFilter('role', e.target.value)
    )

    const dateFromInput = this.shadow.querySelector('#date-from')
    const dateToInput = this.shadow.querySelector('#date-to')

    dateFromInput?.addEventListener('change', e =>
      this.updateFilter('dateFrom', e.target.value)
    )
    dateToInput?.addEventListener('change', e =>
      this.updateFilter('dateTo', e.target.value)
    )

    const clearButton = this.shadow.querySelector('#clear-filters')
    clearButton?.addEventListener('click', () => this.clearAllFilters())

    const applyButton = this.shadow.querySelector('#apply-filters')
    applyButton?.addEventListener('click', () => this.applyFilters())

    const removeButtons = this.shadow.querySelectorAll('.filter-tag-remove')
    removeButtons.forEach(button => {
      button.addEventListener('click', e => {
        const filterKey = e.target.dataset.filter
        this.removeFilter(filterKey)
      })
    })
  }

  dispatchFilterEvent () {
    const filterData = Object.fromEntries(this.activeFilters)

    this.dispatchEvent(
      new CustomEvent('filtersChanged', {
        detail: { filters: filterData },
        bubbles: true,
        composed: true
      })
    )
  }

  getActiveFilters () {
    return Object.fromEntries(this.activeFilters)
  }

  setFilters (filters) {
    this.activeFilters.clear()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        this.activeFilters.set(key, value)
      }
    })
    this.render()
    this.setupEventListeners()
  }

  show () {
    store.dispatch(initDraftFilters())
    this.style.display = 'block'
    setTimeout(() => {
      this.classList.add('show')
      this.classList.remove('hidden')
    }, 10)
    document.body.style.overflow = 'hidden'
  }

  hide () {
    this.classList.remove('show')
    this.classList.add('hidden')

    setTimeout(() => {
      if (this.classList.contains('hidden')) {
        this.style.display = 'none'
      }
    }, 200)
    document.body.style.overflow = ''
  }

  toggle () {
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
