class Title extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })

    this.title = this.getAttribute('title')
  }

  connectedCallback () {
    this.render()
  }

  render () {
    this.shadow.innerHTML =
    `
    <style>
      h1 {
        font-family: "Geist", sans-serif;
        font-weight: 700;
        font-size: 2.3rem;
        color: #f0f0f0;
        margin: 0;
      }
    </style>

    <h1>${this.title}</h1>
    `
  }
}

customElements.define('title-component', Title)
