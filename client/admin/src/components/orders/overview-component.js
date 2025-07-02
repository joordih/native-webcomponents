import css from '@assets/components/orders/overview.css?inline'
import { store } from '@redux/store.js'

class OverviewComponent extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.setupStyles()

    this.dateFrom = new Date('2024-10-18T07:22:58.000Z')

    this.unsubscribe = null
  }

  setupStyles () {
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(css)
    this.shadow.adoptedStyleSheets = [sheet]
  }

  connectedCallback () {
    this.unsubscribe = store.subscribe(() => {
    })
    this.render()
  }

  async fetchOrders () {
    const url = 'http://localhost:8080/api/admin/orders/'

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    return response.json()
  }

  async searchOrders () {
    const data = {
      count: 8,
      rows: [
        {
          id: 22,
          name: 'pepito1',
          email: 'pepito1@gmail.com',
          createdAt: '2024-11-13T07:22:58.000Z',
          updatedAt: '2024-11-18T11:24:32.000Z',
        },
        {
          id: 23,
          name: 'pepito2',
          email: 'pepito2@gmail.com',
          createdAt: '2024-11-13T07:23:51.000Z',
          updatedAt: '2024-11-13T07:23:51.000Z',
        },
        {
          id: 24,
          name: 'pepito3',
          email: 'pepito3@gmail.com',
          createdAt: '2024-11-13T07:25:38.000Z',
          updatedAt: '2024-11-13T07:25:38.000Z',
        },
        {
          id: 25,
          name: 'pepito4',
          email: 'pepito4@gmail.com',
          createdAt: '2024-11-13T07:26:58.000Z',
          updatedAt: '2024-11-13T07:26:58.000Z',
        },
        {
          id: 26,
          name: 'pepito5',
          email: 'pepito5@gmail.com',
          createdAt: '2024-11-13T07:28:04.000Z',
          updatedAt: '2024-11-13T07:28:04.000Z',
        },
      ],
    }

    const orders = data.rows

    return await orders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).filter((order) => {
      const date = new Date(order.createdAt)
      return date >= this.dateFrom && date <= new Date()
    })
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
        <div class="overview">
          ${this.statisticsTemplate()}
        </div>
      `
  }

  statisticsTemplate () {
    const orders = this.fetchOrders()

    const newOrdersLastMonth = orders.length

    return /* html */`
      <div class="statistics">
        <div class="statistic new-orders-month">
          <h5>New orders last month</h5>
          <p>${newOrdersLastMonth}</p>
          <h3 class="info">+20% from last month</p>
        </div>
      </div>
    `
  }
}

customElements.define('overview-component', OverviewComponent)
