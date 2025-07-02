import style from '@assets/components/orders/table.css?inline'
import arrowLeftSvg from '@icons/arrow-left-icon.svg?raw'
import arrowRightSvg from '@icons/arrow-right-icon.svg?raw'
import orderDeleteSvg from '@icons/order-delete-icon.svg?raw'
import orderEditSvg from '@icons/order-edit-icon.svg?raw'
import plusSvg from '@icons/plus-icon.svg?raw'
import { createElement, editElement, setCurrentTab } from '@redux/slices/orders/forms-slice.js'
import { addOrders, clearOrders, decrementCount, removeOrder, setCount, setQueuedUpdate, setSearchTerm } from '@redux/slices/orders/orders-slice.js'
import { store } from '@redux/store.js'

class Table extends HTMLElement {
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
      if (store.getState().orders.queuedUpdate) {
        await store.dispatch(setQueuedUpdate(false))
        await this.performSearch()
      }

      this.render()
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

  async fetchOrders (searchTerm = undefined) {
    const offset = this.currentPage * this.limit

    let url = `http://localhost:8080/api/admin/orders/${this.limit}/${offset}`

    if (searchTerm) {
      url += `?search=${searchTerm}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    return response.json()
  }

  handleNextPage = async () => {
    if (this.currentPage < Math.floor(store.getState().orders.count / this.limit)) {
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

      store.dispatch(clearOrders())
      const data = await this.fetchOrders(searchTerm)

      if (searchTerm === '') {
        store.dispatch(setSearchTerm(undefined))
      }

      if (data.rows?.length) {
        store.dispatch(setSearchTerm(searchTerm))
        store.dispatch(addOrders(data.rows))
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

  createOrderRow () {
    const tableBody = this.shadow.querySelector('#orders tbody')
    store.getState().orders.orders.forEach((order) => {
      const row = document.createElement('tr')
      row.classList.add('order-card')
      row.dataset.id = order.id

      const actionCell = document.createElement('td')
      const nameCell = document.createElement('td')
      const emailCell = document.createElement('td')
      const creationDateCell = document.createElement('td')
      const updateDateCell = document.createElement('td')

      const div = document.createElement('div')
      div.classList.add('card-header', `header-${order.id}`)

      const headerTitle = document.createElement('span')
      headerTitle.textContent = `Order #${order.id}`
      div.appendChild(headerTitle)

      const editButton = document.createElement('a')
      editButton.classList.add('edit-button', 'transition-colors', `edit-${order.id}`)
      editButton.innerHTML = `${orderEditSvg}`
      div.appendChild(editButton)

      const deleteButton = document.createElement('a')
      deleteButton.classList.add('delete-button', 'transition-colors', `delete-${order.id}`)
      deleteButton.innerHTML = `${orderDeleteSvg}`
      div.appendChild(deleteButton)

      nameCell.innerHTML = `Nombre: <span>${order.name}</span>`
      emailCell.innerHTML = `Email: <span>${order.email}</span>`
      creationDateCell.innerHTML = `Fecha de creación: <span>${new Date(order.createdAt).toISOString().slice(0, 10)}</span>`
      updateDateCell.innerHTML = `Fecha de actualización: <span>${new Date(order.updatedAt).toISOString().slice(0, 10)}</span>`

      actionCell.appendChild(div)

      row.appendChild(actionCell)
      row.appendChild(nameCell)
      row.appendChild(emailCell)
      row.appendChild(creationDateCell)
      row.appendChild(updateDateCell)

      tableBody.appendChild(row)
    })
  }

  render () {
    this.disconnectEventListeners()

    const orders = store.getState().orders
    const searchTerm = store.getState().orders.searchTerm

    this.shadow.innerHTML = /* html */`
      <div class="orders-header">
        Amount of orders: ${orders.count}
        <div class="filter">
          <input type="text" placeholder="Search orders" value="${searchTerm || ''}" />
        </div>
      </div>
      <table id="orders">
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
          <span class="paginator-current">Page ${this.currentPage}/${Math.floor(orders.count / this.limit)}</span>
          <button-component class="paginator-next" reverse-side="true" text="" background="transparent" background-hover="#17171A" text-color="#FAFAFA" padding="0.375rem" margin-left="0.2rem" border-radius="0.5rem">
            ${arrowRightSvg}
          </button-component>
        </div>
      </div>
    `.replace()

    this.createOrderRow()
    this.setupEventListeners()
  }

  setupEventListeners () {
    const searchInput = this.shadow.querySelector('.filter input')
    searchInput.addEventListener('input', (e) => {
      this.debouncedSearch(e.target.value.trim())
    })

    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        clearTimeout(this.debouncedSearch.timeout)
        this.performSearch(e.target.value.trim())
      }
    })

    const tbody = this.shadow.querySelector('#orders tbody')
    if (tbody) {
      tbody.removeEventListener('click', this.boundHandleTableClick)
      tbody.addEventListener('click', this.boundHandleTableClick)
    }

    this.shadow.querySelector('#create-button').addEventListener('click', () => {
      const inputs = store.getState().orders_forms.inputs
      Object.keys(inputs).forEach((input) => {
        store.dispatch(createElement({ id: input, element: { value: '' } }))
      })
    })

    this.shadow.querySelector('.paginator-next').addEventListener('click', this.handleNextPage)
    this.shadow.querySelector('.paginator-previous').addEventListener('click', this.handlePrevPage)
  }

  disconnectEventListeners () {
    const tbody = this.shadow.querySelector('#orders tbody')
    if (tbody) {
      tbody.removeEventListener('click', this.boundHandleTableClick)
    }
  }

  handleTableClick (event) {
    const orderCard = event.target.closest('.order-card')
    if (!orderCard) return

    const orderId = orderCard.dataset.id
    const order = store.getState().orders.orders.find(o => o.id === Number(orderId))
    if (!order) return

    if (event.target.closest('.delete-button')) {
      this.handleDelete(order, orderCard)
    } else if (event.target.closest('.edit-button')) {
      this.handleEdit(order)
      store.dispatch(setCurrentTab('general'))
    }
  }

  handleDelete (order, orderCard) {
    this.pushPopup()
    document.querySelector('#popup-component').shadowRoot.querySelector('#continue-button').addEventListener('click', async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/admin/orders/${order.id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        })
        if (response.ok) {
          store.dispatch(removeOrder(order.id))
          store.dispatch(decrementCount())
          orderCard.remove()
        }
      } catch (error) {
        console.error('Error al eliminar:', error)
      }
    })
  }

  handleEdit (order) {
    store.dispatch(setCurrentTab('general'))

    Object.entries(order).forEach(([key, value]) => {
      store.dispatch(editElement({
        id: `${key}`,
        element: {
          value: ['createdAt', 'updatedAt'].includes(key)
            ? new Date(value).toISOString().slice(0, 10)
            : value,
        },
      }))
    })
  }

  pushPopup () {
    document.body.insertAdjacentHTML(
      'afterbegin',
      `<popup-component 
        id='popup-component' 
        title='Are you sure you want to delete this order?' 
        message='Remember that this action cannot be undone.'
      ></popup-component>`
    )
  }
}

customElements.define('table-orders-component', Table)
