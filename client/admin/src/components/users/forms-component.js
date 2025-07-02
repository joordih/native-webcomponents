import style from '@assets/components/orders/forms.css?inline'
import createSvg from '@icons/create-icon.svg?raw'
import deleteSvg from '@icons/delete-icon.svg?raw'
import generalSvg from '@icons/general-icon.svg?raw'
import miscSvg from '@icons/misc-icon.svg?raw'
import saveSvg from '@icons/save-icon.svg?raw'
import { addElement, setCurrentTab } from '@redux/slices/users/forms-slice.js'
import { incrementCount, setQueuedUpdate } from '@redux/slices/users/users-slice'
import { store } from '@redux/store.js'

class Forms extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.setupStyles()
    this.tabs = {
      general: { selector: '.general-tab', buttonId: '#general-button' },
      misc: { selector: '.misc-tab', buttonId: '#misc-button' },
      create: { selector: '.create-tab', buttonId: '#create-button' },
    }
  }

  setupStyles () {
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(style)
    this.shadow.adoptedStyleSheets = [sheet]
  }

  connectedCallback () {
    this.setupStateSubscription()
    this.render()
    this.setupEventListeners()
  }

  disconnectedCallback () {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }

  setupStateSubscription () {
    this.unsubscribe = store.subscribe(() => {
      const state = store.getState()
      this.updateInputValues(state.users_forms.inputs)
      this.updateTabVisibility(state.users_forms.currentTab)
    })
  }

  updateInputValues (inputs) {
    for (const [id, input] of Object.entries(inputs)) {
      const element = this.shadow.querySelector(`#${id}`)
      if (element) {
        element.value = input.value
      }
    }
  }

  updateTabVisibility (currentTab) {
    Object.entries(this.tabs).forEach(([tab, { selector, buttonId }]) => {
      const isActive = tab === currentTab
      const tabElement = this.shadow.querySelector(selector)
      const buttonElement = this.shadow.querySelector(buttonId)

      if (tabElement) {
        tabElement.style.display = isActive ? 'grid' : 'none'
      }

      if (buttonElement) {
        isActive ? buttonElement.classList.add('active') : buttonElement.classList.remove('active')
      }
    })

    const createButtonTab = this.shadow.querySelector('.create-button-tab')
    if (createButtonTab) {
      createButtonTab.style.display = currentTab === 'create' ? 'flex' : 'none'
    }
  }

  setupEventListeners () {
    this.shadow.querySelector('.header').addEventListener('click', this.handleTabClick.bind(this))
    this.shadow.querySelector('a.actions > button-component').addEventListener('click', this.handleActionClick.bind(this))
  }

  handleTabClick (event) {
    event.preventDefault()
    const tab = event.target.closest('.tab')?.querySelector('a')?.getAttribute('href')?.replace('#', '')
    if (tab) {
      store.dispatch(setCurrentTab(tab))
    }
  }

  async handleActionClick (event) {
    event.preventDefault()
    const currentTab = store.getState().users_forms.currentTab
    console.log('tab: ' + currentTab)

    if (currentTab === 'general') {
      await this.saveOrder()
    } else if (currentTab === 'create') {
      await this.createOrder()
    }
  }

  async saveOrder () {
    const orderForm = this.getFormData('.general-tab')
    console.log('general-tab: ' + orderForm)
    const response = await this.sendRequest('PUT', {
      id: orderForm.id,
      name: orderForm.name,
      email: orderForm.email,
    })

    if (response.ok) {
      store.dispatch(setQueuedUpdate(true))

      const currentTab = store.getState().users_forms.currentTab
      await Promise.resolve().then(() => {
        const inputs = this.shadow.querySelectorAll(`div.inputs${this.tabs[currentTab].selector} > div > input`)
        inputs.forEach((input) => {
          input.value = ''
          store.dispatch(addElement({
            id: input.id,
            element: {
              value: '',
              type: input.type || undefined,
              placeholder: input.placeholder,
            },
          }))
        })
      })
    }
  }

  async createOrder () {
    const orderForm = this.getFormData('.create-tab')
    console.log('create-tab: ' + orderForm)
    const response = await this.sendRequest('POST', {
      name: orderForm.name,
      email: orderForm.email,
    })

    if (response.ok) {
      console.log(store.getState().users_forms.currentTab)
      store.dispatch(incrementCount())
      store.dispatch(setQueuedUpdate(true))
      this.render()
    }
  }

  getFormData (selector) {
    const formData = {}
    this.shadow.querySelectorAll(`${selector} > div > input`).forEach((input) => {
      if (input) {
        formData[input.id] = input.value
      }
    })
    return formData
  }

  async sendRequest (method, data) {
    console.log({ method, data })
    return await fetch('http://localhost:8080/api/admin/users/', {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  }

  registerInputs () {
    this.shadow.querySelectorAll('input').forEach(async (input) => {
      await store.dispatch(addElement({
        id: input.id,
        element: {
          value: input.value,
          type: input.type || undefined,
          placeholder: input.placeholder,
        },
      }))
    })
  }

  render () {
    this.shadow.innerHTML = this.getTemplate()
    this.registerInputs()
  }

  getTemplate () {
    return /* html */`
      <div class="header">
        ${this.getTabsTemplate()}
        ${this.getActionButtonTemplate()}
      </div>
      ${this.getGeneralTabTemplate()}
      ${this.getMiscTabTemplate()}
      ${this.getCreateTabTemplate()}
    `
  }

  getTabsTemplate () {
    return /* html */`
      <div class="tab">
        <a id="general-button" href="#general">
          ${generalSvg}
          GENERAL
        </a>
      </div>
      <div class="tab">
        <a id="misc-button" href="#misc">
          ${miscSvg}
          MISC
        </a>
      </div>
      <div class="tab create-button-tab">
        <a id="create-button" href="#create">
          ${createSvg}
          CREATE
        </a>
      </div>
    `
  }

  getActionButtonTemplate () {
    return /* html */`
      <div class="tab-action">
        <a href="#save" class="actions">
          <button-component
            text="Guardar"
            background="#1f5314"
            background-hover="#206312"
            text-color="#51e633"
            border-radius="0.5rem"
          >
            ${saveSvg}
          </button-component>
        </a>
      </div>
    `
  }

  getGeneralTabTemplate () {
    return /* html */`
      <div class="inputs general-tab">
        ${this.getFormInputsTemplate()}
      </div>
    `
  }

  getMiscTabTemplate () {
    return /* html */`
      <div class="inputs misc-tab">
        <div>
          <button-component
            text="Relleno"
            background="#531414"
            background-hover="#621212"
            text-color="#e63535"
            border-radius="0.375rem"
          >
            ${deleteSvg}
          </button-component>
        </div>
      </div>
    `
  }

  getCreateTabTemplate () {
    return /* html */`
      <div class="inputs create-tab">
        ${this.getFormInputsTemplate()}
      </div>
    `
  }

  getFormInputsTemplate () {
    return /* html */`
      <div>
        <label for="name">Nombre</label>
        <input type="text" id="name" class="input" placeholder="Nombre" value="" />
      </div>
      <div>
        <label for="email">Email</label>
        <input type="email" id="email" class="input" placeholder="Email" />
      </div>
      <div>
        <label for="date_of_creation">Fecha de creación</label>
        <input type="date" id="createdAt" class="input" placeholder="Date" disabled />
      </div>
      <div>
        <label for="date_of_update">Fecha de actualización</label>
        <input type="date" id="updatedAt" class="input" placeholder="Date" disabled />
      </div>
      <div class="id-input">
        <label for="date_of_update">Order Id</label>
        <input type="text" id="id" class="input" placeholder="Order Id" />
      </div>
    `
  }
}

customElements.define('forms-users-component', Forms)
