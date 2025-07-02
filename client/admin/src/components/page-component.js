class PageComponent extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.basePath = this.getAttribute('base-path') || ''
  }

  async connectedCallback () {
    await this.getRoutes()
    this.render()
    window.onpopstate = () => this.handleRouteChange()
  }

  handleRouteChange () {
    this.render()
  }

  async getRoutes () {
    const response = await fetch('http://localhost:8080/api/admin/routes')

    if (response.ok) {
      this.routes = await response.json()
    } else {
      const data = await response.json()

      if (data.redirection) {
        window.location.href = data.redirection
      }
    }
  }

  render () {
    const path = window.location.pathname
    this.getTemplate(path)
  }

  async getTemplate (path) {
    const pagePath = path.replace('/admin', '') || '/'

    const route = this.routes[pagePath]
    const routeTitle = route.charAt(0).toUpperCase() + route.slice(1)

    document.title = routeTitle + ' | Administrator' || '404'

    await this.loadPage(route || '404')
  }

  async loadPage (filename) {
    const response = await fetch(`src/pages/${filename}.html`)
    const cssFile = await import(`@assets/components/${filename}/${filename}.css?inline`)
    const css = cssFile.default
    this.setupStyles(css)
    const html = await response.text()

    document.startViewTransition(() => {
      this.shadowRoot.innerHTML = html
      document.documentElement.scrollTop = 0
    })
  }

  setupStyles (css) {
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(css)
    this.shadowRoot.adoptedStyleSheets = [sheet]
  }
}

customElements.define('page-component', PageComponent)
