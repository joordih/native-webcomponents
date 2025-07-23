import style from './categories-component.css?inline'

class CategoriesComponent extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })

    const sheet = new CSSStyleSheet()
    sheet.replaceSync(style)
    this.shadow.adoptedStyleSheets = [sheet]

    this.data = {
      categories: [
        {
          id: 1,
          name: 'Brake System',
          slug: 'brake-system',
          subcategories: [
            { name: 'Electric Brakes' },
            { name: 'Emergency Brakes' },
            { name: 'Hydraulic Brakes' },
            { name: 'Mechanical Brakes' }
          ],
          image: [
            './brake.webp_50x50?url',
            './brake.webp_100x100?url',
            './brake.webp_150x150?url',
            './brake.webp_200x200?url'
          ]
        },
        {
          id: 2,
          name: 'Lighting',
          slug: 'lighting',
          subcategories: [
            { name: 'Fog Lights' },
            { name: 'Turn Signals' },
            { name: 'Tail Lights' },
            { name: 'Switches & Relays' }
          ],
          image: [
            './lighting.webp_50x50?url',
            './lighting.webp_100x100?url',
            './lighting.webp_150x150?url',
            './lighting.webp_200x200?url'
          ]
        },
        {
          id: 3,
          name: 'Tires & Wheels',
          slug: 'tires-wheels',
          subcategories: [
            { name: 'Atturo Tires' },
            { name: 'Moto Metals' },
            { name: 'Wheels Tires' },
            { name: 'XD Wheels' }
          ],
          image: [
            './tires.webp_50x50?url',
            './tires.webp_100x100?url',
            './tires.webp_150x150?url',
            './tires.webp_200x200?url'
          ]
        }
      ]
    }
  }

  connectedCallback () {
    this.render()
  }

  renderCategories () {
    const footer = document.createElement('footer')
    const section = document.createElement('section')
    section.className = 'categories'

    this.data.categories.forEach(category => {
      const categoryDiv = document.createElement('div')
      categoryDiv.className = 'category'

      const categoryInfo = document.createElement('div')
      categoryInfo.className = 'category-info'

      const titleDiv = document.createElement('div')
      titleDiv.className = 'category-title'
      const title = document.createElement('h2')
      title.textContent = category.name
      titleDiv.appendChild(title)

      const subcategories = document.createElement('div')
      subcategories.className = 'sub-categories'
      const subcategoriesList = document.createElement('ul')
      category.subcategories.forEach(subcategory => {
        const subcategoryItem = document.createElement('li')
        subcategoryItem.textContent = subcategory.name
        subcategoriesList.appendChild(subcategoryItem)
      })
      subcategories.appendChild(subcategoriesList)

      const linkDiv = document.createElement('div')
      linkDiv.className = 'category-link'
      const link = document.createElement('a')
      link.href = '#'
      link.textContent = 'shop all'
      linkDiv.appendChild(link)

      categoryInfo.appendChild(titleDiv)
      categoryInfo.appendChild(subcategories)
      categoryInfo.appendChild(linkDiv)

      const categoryImage = document.createElement('div')
      categoryImage.className = 'category-image'
      const img = document.createElement('img')

      const width = window.innerWidth
      img.src =
        category.image[
          width > 1920 ? 3 : width > 1024 ? 2 : width > 768 ? 1 : 0
        ]

      img.alt = category.name
      categoryImage.appendChild(img)

      categoryDiv.appendChild(categoryInfo)
      categoryDiv.appendChild(categoryImage)
      section.appendChild(categoryDiv)
    })

    footer.appendChild(section)
    return footer.innerHTML
  }

  render () {
    this.shadow.innerHTML = `${this.renderCategories()}`
  }
}

window.customElements.define('categories-component', CategoriesComponent)
