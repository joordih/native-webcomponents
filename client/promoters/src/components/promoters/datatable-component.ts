import style from '../../assets/components/promoters/datatable.css?inline'

interface Promoter {
  id: number
  name: string
  email: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

class DataTable extends HTMLElement {
  private shadow: ShadowRoot
  private currentPage: number = 0
  private limit: number = 5
  private debouncedSearch: (...args: any[]) => void
  private abortController?: AbortController
  private boundHandleTableClick: (event: Event) => void
  private promotersState = {
    promoters: [] as Promoter[],
    count: 0,
    queuedUpdate: false
  }

  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })

    const sheet = new CSSStyleSheet()
    sheet.replaceSync(style)
    this.shadow.adoptedStyleSheets = [sheet]

    this.debouncedSearch = this.debounce(this.performSearch.bind(this), 1000)
    this.boundHandleTableClick = this.handleTableClick.bind(this)
  }

  connectedCallback(): void {
    this.performSearch()
    this.render()
  }

  disconnectedCallback(): void {
    if (this.abortController) {
      this.abortController.abort()
    }
  }

  private debounce(func: Function, wait: number): (...args: any[]) => void {
    let timeout: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  private async fetchData(searchTerm?: string): Promise<{ rows: Promoter[], count: number }> {
    const offset = this.currentPage * this.limit
    let url = `http://localhost:8080/api/admin/promoters/${this.limit}/${offset}`

    if (searchTerm) {
      url += `?search=${searchTerm}`
    }

    const response = await fetch(url)
    return response.json()
  }

  private handleNextPage = async (): Promise<void> => {
    if (this.currentPage < Math.floor(this.promotersState.count / this.limit)) {
      this.currentPage++
      await this.performSearch()
    }
  }

  private handlePrevPage = async (): Promise<void> => {
    if (this.currentPage > 0) {
      this.currentPage--
      await this.performSearch()
    }
  }

  private async performSearch(searchTerm?: string): Promise<void> {
    try {
      if (this.abortController) {
        this.abortController.abort()
      }
      this.abortController = new AbortController()

      this.promotersState.promoters = []
      const data = await this.fetchData(searchTerm)

      if (data.rows?.length) {
        this.promotersState.promoters = data.rows
      }

      this.promotersState.count = data.count
      this.render()
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error en búsqueda:', error)
      }
    }
  }

  private createRows(): void {
    const tableBody = this.shadow.querySelector('tbody')
    if (!tableBody) return
    
    tableBody.innerHTML = ''

    this.promotersState.promoters.forEach(promoter => {
      const row = document.createElement('tr')
      row.classList.add('promoter-card')
      row.dataset.id = promoter.id.toString()

      const checkboxCell = document.createElement('td')
      const nameCell = document.createElement('td')
      const statusCell = document.createElement('td')
      const dateCell = document.createElement('td')
      const actionsCell = document.createElement('td')

      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkboxCell.appendChild(checkbox)

      nameCell.innerHTML = `
        <div class="promoter">
          <img src="https://i.pravatar.cc/150?img=${promoter.id}" class="avatar">
          <div class="promoter-info">
            <div class="promoter-name">${promoter.name}</div>
            <div class="promoter-email">${promoter.email}</div>
          </div>
        </div>
      `

      const status = document.createElement('span')
      status.className = 'status active'
      status.textContent = 'Active'
      statusCell.appendChild(status)

      const createdDate = new Date(promoter.createdAt).toLocaleDateString()
      dateCell.textContent = createdDate

      const actionsDiv = document.createElement('div')
      actionsDiv.className = 'card-header'

      const editButton = document.createElement('a')
      editButton.className = 'edit-button transition-colors'
      editButton.innerHTML = ''

      const deleteButton = document.createElement('a')
      deleteButton.className = 'delete-button transition-colors'
      deleteButton.innerHTML = ''

      actionsDiv.appendChild(editButton)
      actionsDiv.appendChild(deleteButton)
      actionsCell.appendChild(actionsDiv)

      row.appendChild(checkboxCell)
      row.appendChild(nameCell)
      row.appendChild(statusCell)
      row.appendChild(dateCell)
      row.appendChild(actionsCell)

      tableBody.appendChild(row)
    })
  }

  private render(): void {
    this.shadow.innerHTML = /* html */ `
      <filters-component></filters-component>
      
      <div class="header">
        <button class="dropdown actions">Status ▾</button>
        <button class="dropdown actions">Columns ▾</button>
        <button class="button actions">Add New +</button>
      </div>

      <table>
        <thead>
          <tr>
            <th><input type="checkbox"></th>
            <th>NAME</th>
            <th>STATUS</th>
            <th>CREATED</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>

      <div class="footer">
        <div class="footer-text">Total promoters: ${this.promotersState.count || 0}</div>
        <nav class="pagination">
          <div class="pagination-wrapper">
            <button class="page prev" ${
              this.currentPage === 0 ? 'disabled' : ''
            }>Previous</button>
            ${Array.from({ length: Math.ceil(this.promotersState.count / this.limit) })
              .map(
                (_, i) => `
              <button class="page" data-active="${this.currentPage === i}">
                ${i + 1}
              </button>
            `
              )
              .join('')}
            <button class="page next" ${
              this.currentPage === Math.floor(this.promotersState.count / this.limit)
                ? 'disabled'
                : ''
            }>Next</button>
          </div>
        </nav>
      </div>
    `

    this.createRows()
    this.setupEventListeners()
  }

  private setupEventListeners(): void {
    const filtersComponent = this.shadow.querySelector('filters-component')
    filtersComponent?.addEventListener('filtersChanged', (e: any) => {
      const { searchTerm } = e.detail
      this.currentPage = 0
      this.performSearch(searchTerm)
    })

    const pagination = this.shadow.querySelector('.pagination-wrapper')
    pagination?.addEventListener('click', (e: Event) => {
      const button = (e.target as Element).closest('.page') as HTMLButtonElement
      if (!button || button.disabled) return

      if (button.classList.contains('prev')) {
        this.handlePrevPage()
      } else if (button.classList.contains('next')) {
        this.handleNextPage()
      } else {
        const pageNum = Number.parseInt(button.textContent || '1') - 1
        if (pageNum !== this.currentPage) {
          this.currentPage = pageNum
          this.performSearch()
        }
      }
    })

    const tbody = this.shadow.querySelector('tbody')
    tbody?.addEventListener('click', this.boundHandleTableClick)
  }

  private handleTableClick(event: Event): void {
    const promoterCard = (event.target as Element).closest('.promoter-card') as HTMLElement
    if (!promoterCard) return

    const promoterId = promoterCard.dataset.id
    const promoter = this.promotersState.promoters.find(p => p.id === Number(promoterId))
    if (!promoter) return

    if ((event.target as Element).closest('.delete-button')) {
      this.handleDelete(promoter, promoterCard)
    } else if ((event.target as Element).closest('.edit-button')) {
      this.handleEdit(promoter)
    }
  }

  private handleDelete(promoter: Promoter, promoterCard: HTMLElement): void {
    this.pushPopup()
    const popup = document.querySelector('#popup-component')
    const continueButton = popup?.shadowRoot?.querySelector('#continue-button')
    
    continueButton?.addEventListener('click', async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/admin/promoters/${promoter.id}`,
          {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
          }
        )
        if (response.ok) {
          this.promotersState.promoters = this.promotersState.promoters.filter(p => p.id !== promoter.id)
          this.promotersState.count--
          promoterCard.remove()
        }
      } catch (error) {
        console.error('Error al eliminar:', error)
      }
    })
  }

  private handleEdit(promoter: Promoter): void {
    const event = new CustomEvent('editPromoter', {
      detail: promoter,
      bubbles: true,
      composed: true
    })
    this.dispatchEvent(event)
  }

  private pushPopup(): void {
    document.body.insertAdjacentHTML(
      'afterbegin',
      `<popup-component 
        id='popup-component' 
        title='Are you sure you want to delete this promoter?' 
        message='Remember that this action cannot be undone.'
      ></popup-component>`
    )
  }
}

customElements.define('datatable-component', DataTable)