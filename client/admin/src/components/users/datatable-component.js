import style from '@assets/components/users/datatable.css?inline'
import { editElement, setCurrentTab } from '@redux/slices/users/forms-slice.js'
import {
  addUsers,
  clearUsers,
  decrementCount,
  removeUser,
  setCount,
  setQueuedUpdate,
  setSearchTerm
} from '@redux/slices/users/users-slice.js'
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
    this.unsubscribe = store.subscribe(() => {
      if (store.getState().users.queuedUpdate) {
        store.dispatch(setQueuedUpdate(false))
        this.performSearch()
      }
      this.render()
    })
    this.performSearch()
    this.render()
  }

  disconnectedCallback () {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }

  debounce (func, wait) {
    let timeout
    return (...args) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  async fetchData (searchTerm = undefined) {
    const offset = this.currentPage * this.limit
    let url = `http://localhost:8080/api/admin/users/${this.limit}/${offset}`

    if (searchTerm) {
      url += `?search=${searchTerm}`
    }

    const response = await fetch(url)
    return response.json()
  }

  handleNextPage = async () => {
    if (
      this.currentPage < Math.floor(store.getState().users.count / this.limit)
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

  async performSearch (searchTerm) {
    try {
      if (this.abortController) {
        this.abortController.abort()
      }
      this.abortController = new AbortController()

      store.dispatch(clearUsers())
      const data = await this.fetchData(searchTerm)

      if (searchTerm === '') {
        store.dispatch(setSearchTerm(undefined))
      }

      if (data.rows?.length) {
        store.dispatch(setSearchTerm(searchTerm))
        store.dispatch(addUsers(data.rows))
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

  createRows () {
    const tableBody = this.shadow.querySelector('tbody')
    tableBody.innerHTML = ''

    store.getState().users.users.forEach(user => {
      const editComponent = document.createElement('edit-component')

      const row = document.createElement('tr')
      row.setAttribute('slot', 'trigger')
      row.classList.add('user-card')
      row.dataset.id = user.id

      const checkboxCell = document.createElement('td')
      const nameCell = document.createElement('td')
      const roleCell = document.createElement('td')
      const statusCell = document.createElement('td')
      const actionsCell = document.createElement('td')

      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkboxCell.appendChild(checkbox)

      nameCell.innerHTML = `
        <div class="user">
          <img src="https://i.pravatar.cc/150?img=1" class="avatar">
          <div class="user-info">
            <div class="user-name">${user.name}</div>
            <div class="user-email">${user.email}</div>
          </div>
        </div>
        `

      roleCell.textContent = 'User'

      const status = document.createElement('span')
      status.className = 'status ' + (user.status || 'active').toLowerCase()
      status.textContent = 'Active'
      statusCell.appendChild(status)

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
      row.appendChild(roleCell)
      row.appendChild(statusCell)
      row.appendChild(actionsCell)

      editComponent.appendChild(row)
      tableBody.appendChild(editComponent)
    })
  }

  render () {
    const users = store.getState().users

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
            <th>ROLE</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>

      <div class="footer">
        <div class="footer-text">Total users: ${users.count || 0}</div>
        <nav class="pagination">
          <div class="pagination-wrapper">
            <button class="page prev" ${
              this.currentPage === 0 ? 'disabled' : ''
            }>Previous</button>
            ${[...Array.from({ length: Math.ceil(users.count / this.limit) })]
              .map(
                (_, i) => `
              <button class="page" data-active="${this.currentPage === i}">
                ${i + 1}
              </button>
            `
              )
              .join('')}
            <button class="page next" ${
              this.currentPage === Math.floor(users.count / this.limit)
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

  setupEventListeners () {
    const filtersComponent = this.shadow.querySelector('filters-component')
    filtersComponent.addEventListener('filtersChanged', e => {
      const { searchTerm } = e.detail
      this.currentPage = 0
      this.performSearch(searchTerm)
    })

    const pagination = this.shadow.querySelector('.pagination-wrapper')
    pagination.addEventListener('click', e => {
      const button = e.target.closest('.page')
      if (!button || button.disabled) return

      if (button.classList.contains('prev')) {
        this.handlePrevPage()
      } else if (button.classList.contains('next')) {
        this.handleNextPage()
      } else {
        const pageNum = Number.parseInt(button.textContent) - 1
        if (pageNum !== this.currentPage) {
          this.currentPage = pageNum
          this.performSearch()
        }
      }
    })

    const tbody = this.shadow.querySelector('tbody')
    tbody.addEventListener('click', this.boundHandleTableClick)
  }

  handleTableClick (event) {
    const userCard = event.target.closest('.user-card')
    if (!userCard) return

    const userId = userCard.dataset.id
    const user = store.getState().users.users.find(u => u.id === Number(userId))
    if (!user) return

    if (event.target.closest('.delete-button')) {
      this.handleDelete(user, userCard)
    } else if (event.target.closest('.edit-button')) {
      this.handleEdit(user)
    }
  }

  handleDelete (user, userCard) {
    this.pushPopup()
    document
      .querySelector('#popup-component')
      .shadowRoot.querySelector('#continue-button')
      .addEventListener('click', async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/api/admin/users/${user.id}`,
            {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' }
            }
          )
          if (response.ok) {
            store.dispatch(removeUser(user.id))
            store.dispatch(decrementCount())
            userCard.remove()
          }
        } catch (error) {
          console.error('Error al eliminar:', error)
        }
      })
  }

  handleEdit (user) {
    store.dispatch(setCurrentTab('general'))
    Object.entries(user).forEach(([key, value]) => {
      store.dispatch(
        editElement({
          id: key,
          element: {
            value: ['createdAt', 'updatedAt'].includes(key)
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
        title='Are you sure you want to delete this user?' 
        message='Remember that this action cannot be undone.'
      ></popup-component>`
    )
  }
}

customElements.define('datatable-component', DataTable)
