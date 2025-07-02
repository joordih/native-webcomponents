import style from '@assets/components/ui/edit-menu.css?inline'
import menuEditIcon from '@icons/menu-edit-icon.svg?raw'
import menuTrashIcon from '@icons/menu-trash-icon.svg?raw'

class EditComponent extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.isMenuOpen = false
    this.loadStyles()
  }

  loadStyles () {
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(style)
    this.shadow.adoptedStyleSheets = [sheet]
  }

  connectedCallback () {
    this.render()
    this.setupEventListeners()
  }

  render () {
    this.shadow.innerHTML = /* html */`
      <div class="context-menu-container">
        <slot name="trigger"></slot>
        <div class="context-menu slide-in-blurred-top">
          <div class="section">
            <div class="section-title">Actions</div>
            <!-- <div class="menu-item">
              <div class="icon">📄</div>
              <div class="menu-item-content">
                <div class="menu-item-title">New file</div>
                <div class="menu-item-description text-foreground-500">Create a new file</div>
              </div>
              <div class="shortcut">⌘N</div>
            </div>
            <div class="menu-item">
              <div class="icon">🔗</div>
              <div class="menu-item-content">
                <div class="menu-item-title">Copy link</div>
                <div class="menu-item-description text-foreground-500">Copy the file link</div>
              </div>
              <div class="shortcut">⌘C</div>
            </div> -->
            <div class="menu-item">
              <div class="icon">${menuEditIcon}</div>
              <div class="menu-item-content">
                <div class="menu-item-title">Edit file</div>
                <div class="menu-item-description text-foreground-500">Allows you to edit the file</div>
              </div>
              <div class="shortcut">⌘E</div>
            </div>
          </div>
          <div class="separator"></div>
          <div class="section">
            <div class="section-title">Danger zone</div>
            <div class="menu-item danger">
              <div class="icon">${menuTrashIcon}</div>
              <div class="menu-item-content">
                <div class="menu-item-title">Delete file</div>
                <div class="menu-item-description text-foreground-500">Permanently delete the file</div>
              </div>
              <div class="shortcut">⌘D</div>
            </div>
          </div>
        </div>
      </div>
    `
  }

  setupEventListeners () {
    const trigger = this.shadow.querySelector('slot[name="trigger"]')

    trigger.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.showContextMenu(e.clientX, e.clientY)
      this.isMenuOpen = true
    })

    document.addEventListener('contextmenu', (e) => {
      if (!this.isMenuOpen) return

      const isOutside = !this.shadow.contains(e.target)
      if (isOutside) {
        e.preventDefault()
        this.hideContextMenu()
        this.isMenuOpen = false
      }
    })

    document.addEventListener('click', (e) => {
      if (!this.isMenuOpen) return

      const isOutside = !this.shadow.contains(e.target)
      if (isOutside) {
        this.hideContextMenu()
        this.isMenuOpen = false
      }
    })
  }

  showContextMenu (x, y) {
    const menu = this.shadow.querySelector('.context-menu')
    menu.style.display = 'block'
    menu.style.left = `${x}px`
    menu.style.top = `${y}px`
  }

  hideContextMenu () {
    const menu = this.shadow.querySelector('.context-menu')
    menu.style.display = 'none'
  }
}

customElements.define('edit-component', EditComponent)
