class PopupComponent extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })

    this.title = this.getAttribute('title')
    this.message = this.getAttribute('message')
  }

  connectedCallback () {
    this.render()
  }

  render () {
    this.shadow.innerHTML =
    /* html */`
    <style>
      .container {
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        z-index: 1000;
      }
      .popup {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: #09090B;
        min-width: 350px;
        padding: 20px;
        border-radius: .5rem;
        border: 1px solid rgb(39, 39, 42);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

        .content {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          margin-right: auto;

          h1 {
            font-family: "Geist", sans-serif;
            font-weight: 600;
            font-size: 1.125rem;
            line-height: 1.75rem;
            color: white;
            margin: 0px;
          }

          p {
            font-family: "Geist", sans-serif;
            font-weight: 400;
            font-size: 0.875rem;
            line-height: 1.25rem;
            color: #a1a1aa;
            margin: 0px;
            margin-right: auto;
          }
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          margin-left: auto;
          margin-top: 1rem;
          margin-bottom: 0px;
        }
      }
    </style>
    <div class="container">
      <div class="popup">
        <div class="content">
          <h1>${this.title}</h1>
          <p>${this.message}</p>
        </div>
        <div class="actions">
            <button-component id="cancel-button" text="Cancel" background="#09090B" background-hover="#27272A" text-color="#FAFAFA" border-radius="0.5rem">
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="mdi-close-thick" width="20" height="20" viewBox="0 0 24 24">
                <path d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z" />
              </svg>
            </button-component>
            <button-component id="continue-button" text="Continue" background="#09090B" background-hover="#27272A" text-color="#FAFAFA" border-radius="0.5rem">
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="mdi-check-bold" width="20" height="20" viewBox="0 0 27 24">
                <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
              </svg>
            </button-component>
        </div>
      </div>
    </div>
    `

    this.addEventHandlers()
  }

  addEventHandlers () {
    this.shadow.querySelector('.container').addEventListener('click', (event) => {
      if (event.target === this.shadow.querySelector('.popup') || event.target === this.shadow.querySelector('#cancel-button')) {
        this.remove()
        return
      }

      if (event.target === this.shadow.querySelector('#continue-button')) {
        this.remove()
      }
    })
  }
}

customElements.define('popup-component', PopupComponent)
