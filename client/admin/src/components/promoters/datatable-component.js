import style from '@assets/components/promoters/datatable.css?inline'
import arrowLeftSvg from '@icons/arrow-left-icon.svg?raw'
import arrowRightSvg from '@icons/arrow-right-icon.svg?raw'
import orderDeleteSvg from '@icons/order-delete-icon.svg?raw'
import orderEditSvg from '@icons/order-edit-icon.svg?raw'
import plusSvg from '@icons/plus-icon.svg?raw'
import {
  createElement,
  editElement,
  setCurrentTab
} from '@redux/slices/promoters/forms-slice.js'
import {
  addPromoters,
  clearPromoters,
  decrementCount,
  removePromoter,
  setCount,
  setQueuedUpdate,
  setSearchTerm
} from '@redux/slices/promoters/promoters-slice.js'
import { store } from '@redux/store.js'

class DataTable extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.currentPage = 0
    this.limit = 5

    const sheet = new CSSStyleSheet()
    sheet.replaceSync(style)
    this.shadow.adoptedStyleSheets = [sheet]

    this.debouncedSearch = this.debounce(this.performSearch.bind(this), 1000)
    this.unsubscribe = null
    this.boundHandleTableClick = this.handleTableClick.bind(this)
  }

  connectedCallback () {
    this.unsubscribe = store.subscribe(async () => {
      if (store.getState().promoters.queuedUpdate) {
        await store.dispatch(setQueuedUpdate(false))
        await this.performSearch()
      }

      this.render()
    })

    document.addEventListener('filtersChanged', event => {
      const { searchTerm, filters } = event.detail
      if (searchTerm !== undefined) {
        this.performSearch(searchTerm)
      }
      if (filters) {
        this.applyFilters(filters)
      }
    })

    this.performSearch()
    this.render()
  }

  disconnectedCallback () {
    this.unsubscribe.unsubscribe()
  }

  debounce (func, wait) {
    let timeout
    return (...args) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  async fetchData (searchTerm = undefined, filters = {}) {
    const offset = this.currentPage * this.limit
    let url = `http://localhost:8080/api/admin/promoters/${this.limit}/${offset}`

    const params = new URLSearchParams()

    if (searchTerm) {
      params.append('search', searchTerm)
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        params.append(key, value)
      }
    })

    if (params.toString()) {
      url += `?${params.toString()}`
    }

    const response = await fetch(url)
    return response.json()
  }

  handleNextPage = async () => {
    if (
      this.currentPage <
      Math.floor(store.getState().promoters.count / this.limit)
    ) {
      this.currentPage++
      await this.performSearch()
    }
  }

  handlePrevPage = async () => {
    if (this.currentPage > 0) {
      this.currentPage--
      await this.performSearch()
    }
  }

  async performSearch (searchTerm, filters = {}) {
    try {
      if (this.abortController) {
        this.abortController.abort()
      }
      this.abortController = new AbortController()

      store.dispatch(clearPromoters())
      const data = await this.fetchData(searchTerm, filters)

      if (searchTerm === '') {
        store.dispatch(setSearchTerm(undefined))
      }

      if (data.rows?.length) {
        store.dispatch(setSearchTerm(searchTerm))
        store.dispatch(addPromoters(data.rows))
      } else {
        store.dispatch(setSearchTerm(searchTerm))
      }

      store.dispatch(setCount(data.count))
      this.render()
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error en búsqueda:', error)
      }
    }
  }

  async applyFilters (filters) {
    this.currentPage = 0
    const searchTerm = store.getState().promoters.searchTerm
    await this.performSearch(searchTerm, filters)
  }

  createPromoterRow () {
    const tableBody = this.shadow.querySelector('#promoters tbody')
    store.getState().promoters.promoters.forEach(promoter => {
      const row = document.createElement('tr')
      row.classList.add('promoter-card')
      row.dataset.id = promoter.id

      const actionCell = document.createElement('td')
      const nameCell = document.createElement('td')
      const emailCell = document.createElement('td')
      const creationDateCell = document.createElement('td')
      const updateDateCell = document.createElement('td')
      const deletedDateCell = document.createElement('td')

      const div = document.createElement('div')
      div.classList.add('card-header', `header-${promoter.id}`)

      const headerTitle = document.createElement('span')
      headerTitle.textContent = `ID: ${promoter.id}`
      div.appendChild(headerTitle)

      const editButton = document.createElement('a')
      editButton.classList.add(
        'edit-button',
        'transition-colors',
        `edit-${promoter.id}`
      )
      editButton.innerHTML = `${orderEditSvg}`
      div.appendChild(editButton)

      const deleteButton = document.createElement('a')
      deleteButton.classList.add(
        'delete-button',
        'transition-colors',
        `delete-${promoter.id}`
      )
      deleteButton.innerHTML = `${orderDeleteSvg}`
      div.appendChild(deleteButton)

      nameCell.innerHTML = `Name: <span>${promoter.name}</span>`
      emailCell.innerHTML = `Email: <span>${promoter.email}</span>`
      creationDateCell.innerHTML = `Created: <span>${new Date(
        promoter.createdAt
      )
        .toISOString()
        .slice(0, 10)}</span>`
      updateDateCell.innerHTML = `Updated: <span>${new Date(promoter.updatedAt)
        .toISOString()
        .slice(0, 10)}</span>`
      deletedDateCell.innerHTML = `Deleted: <span>${
        promoter.deletedAt
          ? new Date(promoter.deletedAt).toISOString().slice(0, 10)
          : 'N/A'
      }</span>`

      actionCell.appendChild(div)

      row.appendChild(actionCell)
      row.appendChild(nameCell)
      row.appendChild(emailCell)
      row.appendChild(creationDateCell)
      row.appendChild(updateDateCell)
      row.appendChild(deletedDateCell)

      tableBody.appendChild(row)
    })
  }

  render () {
    this.disconnectEventListeners()

    const promoters = store.getState().promoters
    // const searchTerm = store.getState().promoters.searchTerm

    this.shadow.innerHTML = /* html */ `
      <div class="promoters-header">
        <span>Amount of promoters: ${promoters.count}</span>
        <button class="filter-toggle" type="button" title="Abrir filtros">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
        </button>
      </div>
      <table id="promoters">
        <tbody class="hidden-scrollbar">
        </tbody>
      </table>
      <div class="footer">
        <button-component id="create-button" text="Nuevo" background="transparent" background-hover="#17171A" text-color="#FAFAFA" padding="0.375rem" margin-left="0.2rem" border-radius="0.5rem">
          ${plusSvg}
        </button-component>
        <div class="paginator-container">
          <button-component class="paginator-previous" text="" background="transparent" background-hover="#17171A" text-color="#FAFAFA" padding="0.375rem" margin-left="0.2rem" border-radius="0.5rem">
            ${arrowLeftSvg}
          </button-component>
          <span class="paginator-current">Page ${this.currentPage}/${Math.floor(
      promoters.count / this.limit
    )}</span>
          <button-component class="paginator-next" reverse-side="true" text="" background="transparent" background-hover="#17171A" text-color="#FAFAFA" padding="0.375rem" margin-left="0.2rem" border-radius="0.5rem">
            ${arrowRightSvg}
          </button-component>
        </div>
      </div>
    `.replace()

    this.createPromoterRow()
    this.setupEventListeners()
  }

  setupEventListeners () {
    const tbody = this.shadow.querySelector('#promoters tbody')
    if (tbody) {
      tbody.removeEventListener('click', this.boundHandleTableClick)
      tbody.addEventListener('click', this.boundHandleTableClick)
    }

    this.shadow
      .querySelector('#create-button')
      .addEventListener('click', () => {
        const inputs = store.getState().promoters_forms.inputs
        Object.keys(inputs).forEach(input => {
          store.dispatch(createElement({ id: input, element: { value: '' } }))
        })
      })

    this.shadow
      .querySelector('.filter-toggle')
      .addEventListener('click', () => {
        const filtersComponent = document
          .querySelector('page-component')
          ?.shadowRoot?.querySelector('filters-component')
        if (filtersComponent && typeof filtersComponent.show === 'function') {
          filtersComponent.show()
        }
      })

    this.shadow
      .querySelector('.paginator-next')
      .addEventListener('click', this.handleNextPage)
    this.shadow
      .querySelector('.paginator-previous')
      .addEventListener('click', this.handlePrevPage)
  }

  disconnectEventListeners () {
    const tbody = this.shadow.querySelector('#promoters tbody')
    if (tbody) {
      tbody.removeEventListener('click', this.boundHandleTableClick)
    }
  }

  handleTableClick (event) {
    const promoterCard = event.target.closest('.promoter-card')
    if (!promoterCard) return

    const promoterId = promoterCard.dataset.id
    const promoter = store
      .getState()
      .promoters.promoters.find(p => p.id === Number(promoterId))
    if (!promoter) return

    if (event.target.closest('.delete-button')) {
      this.handleDelete(promoter, promoterCard)
    } else if (event.target.closest('.edit-button')) {
      this.handleEdit(promoter)
      store.dispatch(setCurrentTab('general'))
    }
  }

  handleDelete (promoter, promoterCard) {
    this.pushPopup()
    document
      .querySelector('#popup-component')
      .shadowRoot.querySelector('#continue-button')
      .addEventListener('click', async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/api/admin/promoters/${promoter.id}`,
            {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' }
            }
          )
          if (response.ok) {
            store.dispatch(removePromoter(promoter.id))
            store.dispatch(decrementCount())
            promoterCard.remove()
          }
        } catch (error) {
          console.error('Error al eliminar:', error)
        }
      })
  }

  handleEdit (promoter) {
    store.dispatch(setCurrentTab('general'))

    Object.entries(promoter).forEach(([key, value]) => {
      store.dispatch(
        editElement({
          id: `${key}`,
          element: {
            value:
              ['createdAt', 'updatedAt', 'deletedAt'].includes(key) && value
                ? new Date(value).toISOString().slice(0, 10)
                : value
          }
        })
      )
    })
  }

  pushPopup () {
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
