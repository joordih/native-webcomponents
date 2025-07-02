class Button extends HTMLElement {
  #shadow
  #attributes = {
    text: undefined,
    background: '#4CAF50',
    'background-hover': '#45a049',
    'text-color': '#4CAF50',
    'border-radius': '0.375rem',
    padding: '0.5rem',
    'margin-left': '0',
    'reverse-side': false,
  }

  constructor () {
    super()
    this.#shadow = this.attachShadow({ mode: 'open' })
    this.#initAttributes()
  }

  #initAttributes () {
    Object.keys(this.#attributes).forEach((attr) => {
      const value = this.getAttribute(attr)
      if (value !== null) {
        this.#attributes[attr] = value
      }
    })
  }

  #getStyles () {
    return `
      <style>
        .button {
          display: flex;
          align-items: center;
          cursor: pointer;
          background-color: ${this.#attributes.background};
          padding: ${this.#attributes.padding};
          width: 100%;
          border-radius: ${this.#attributes['border-radius']};
          transition: background-color 0.1s ease;
          border: none;
          margin-left: ${this.#attributes['margin-left']};
          border: 1px transparent solid;
        }

        .button:hover {
          background-color: ${this.#attributes['background-hover']};
        }

        .button:active {
          border: 1px solid ${this.#attributes['text-color']};
        }

        .button-text {
          font-size: 0.875rem;
          color: ${this.#attributes['text-color']};
          font-weight: bold;
        }

        ::slotted(svg) {
          fill: ${this.#attributes['text-color']};
          ${this.#getIconMargin()}
        }
      </style>
    `
  }

  #getIconMargin () {
    if (!this.#attributes.text) return ''
    return this.#attributes['reverse-side']
      ? 'margin-left: 0.5rem;'
      : 'margin-right: 0.5rem;'
  }

  #getButtonContent () {
    const text = this.#attributes.text
      ? `<span class="button-text">${this.#attributes.text}</span>`
      : ''

    return this.#attributes['reverse-side']
      ? `${text}<slot></slot>`
      : `<slot></slot>${text}`
  }

  connectedCallback () {
    this.render()
  }

  render () {
    this.#shadow.innerHTML = `
      ${this.#getStyles()}
      <button 
        title="${this.#attributes.text || ''}" 
        class="button">
        ${this.#getButtonContent()}
      </button>
    `
  }
}

customElements.define('button-component', Button)
