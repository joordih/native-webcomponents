# native-webcomponents

```
wc-v3
├─ .claude
│  └─ settings.local.json
├─ .vercel
│  └─ project.json
├─ api
│  ├─ nodemon.json
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ pnpm-lock.yaml
│  ├─ src
│  │  ├─ config
│  │  │  └─ config.json
│  │  ├─ controllers
│  │  │  ├─ admin
│  │  │  │  ├─ etc
│  │  │  │  │  └─ promoter.controller.ts
│  │  │  │  ├─ orders
│  │  │  │  │  └─ order.controller.ts
│  │  │  │  ├─ router.controller.ts
│  │  │  │  └─ users
│  │  │  │     └─ user.controller.ts
│  │  │  ├─ auth
│  │  │  │  └─ router.controller.ts
│  │  │  └─ landing
│  │  │     └─ router.controller.ts
│  │  ├─ database
│  │  │  └─ index.ts
│  │  ├─ events
│  │  │  ├─ events.ts
│  │  │  └─ impl
│  │  │     ├─ new-user.event.ts
│  │  │     └─ test.event.ts
│  │  ├─ index.ts
│  │  ├─ middleware
│  │  │  ├─ impl
│  │  │  │  └─ info.middleware.ts
│  │  │  └─ middlewares.ts
│  │  ├─ migrations
│  │  │  ├─ 20241111135415-create-user-table.js
│  │  │  ├─ 20241111135419-create-emailerror-table.js
│  │  │  ├─ 20241111135419-create-orders-table.js
│  │  │  ├─ 20241111135419-create-sentmail-table.js
│  │  │  ├─ 20250103000000-create-promoters-table.js
│  │  │  └─ 20250626103857-users-table-modification.js
│  │  ├─ models
│  │  │  ├─ emailError.ts
│  │  │  ├─ order.ts
│  │  │  ├─ promoter.ts
│  │  │  ├─ sentMail.ts
│  │  │  └─ user.ts
│  │  ├─ repositories
│  │  │  ├─ order.repository.ts
│  │  │  ├─ promoter.repository.ts
│  │  │  └─ user.repository.ts
│  │  ├─ routes
│  │  │  ├─ admin
│  │  │  │  ├─ orders
│  │  │  │  │  └─ orders.routes.ts
│  │  │  │  ├─ promoters
│  │  │  │  │  └─ promoters.routes.ts
│  │  │  │  ├─ router.routes.ts
│  │  │  │  └─ users
│  │  │  │     └─ users.route.ts
│  │  │  ├─ auth
│  │  │  │  └─ router.routes.ts
│  │  │  ├─ index.ts
│  │  │  └─ landing
│  │  │     └─ router.routes.ts
│  │  ├─ services
│  │  │  ├─ impl
│  │  │  │  ├─ email.service.ts
│  │  │  │  └─ redis.service.ts
│  │  │  └─ services.ts
│  │  ├─ templates
│  │  │  └─ emails
│  │  │     └─ es
│  │  │        └─ activation-url.ejs
│  │  └─ types
│  │     └─ express
│  │        └─ index.d.ts
│  └─ tsconfig.json
├─ client
│  ├─ admin
│  │  ├─ .vite
│  │  │  └─ deps
│  │  │     └─ _metadata.json
│  │  ├─ eslint.config.js
│  │  ├─ index.html
│  │  ├─ package-lock.json
│  │  ├─ package.json
│  │  ├─ src
│  │  │  ├─ assets
│  │  │  │  ├─ components
│  │  │  │  │  ├─ orders
│  │  │  │  │  │  ├─ forms.css
│  │  │  │  │  │  ├─ orders.css
│  │  │  │  │  │  ├─ overview.css
│  │  │  │  │  │  └─ table.css
│  │  │  │  │  ├─ promoters
│  │  │  │  │  │  ├─ datatable.css
│  │  │  │  │  │  ├─ filters.css
│  │  │  │  │  │  ├─ forms.css
│  │  │  │  │  │  └─ promoters.css
│  │  │  │  │  ├─ ui
│  │  │  │  │  │  └─ edit-menu.css
│  │  │  │  │  └─ users
│  │  │  │  │     ├─ datatable.css
│  │  │  │  │     ├─ filters.css
│  │  │  │  │     └─ users.css
│  │  │  │  ├─ favico.ico
│  │  │  │  ├─ icons
│  │  │  │  │  ├─ arrow-left-icon.svg
│  │  │  │  │  ├─ arrow-right-icon.svg
│  │  │  │  │  ├─ create-icon.svg
│  │  │  │  │  ├─ delete-icon.svg
│  │  │  │  │  ├─ general-icon.svg
│  │  │  │  │  ├─ menu-edit-icon.svg
│  │  │  │  │  ├─ menu-trash-icon.svg
│  │  │  │  │  ├─ misc-icon.svg
│  │  │  │  │  ├─ order-delete-icon.svg
│  │  │  │  │  ├─ order-edit-icon.svg
│  │  │  │  │  ├─ plus-icon.svg
│  │  │  │  │  ├─ save-icon.svg
│  │  │  │  │  └─ user.jpg
│  │  │  │  └─ style.css
│  │  │  ├─ components
│  │  │  │  ├─ header
│  │  │  │  │  ├─ header-component.js
│  │  │  │  │  ├─ menu-component.js
│  │  │  │  │  └─ title-component.js
│  │  │  │  ├─ orders
│  │  │  │  │  ├─ forms-component.js
│  │  │  │  │  ├─ overview-component.js
│  │  │  │  │  └─ table-component.js
│  │  │  │  ├─ page-component.js
│  │  │  │  ├─ promoters
│  │  │  │  │  ├─ datatable-component.js
│  │  │  │  │  ├─ filters-component.js
│  │  │  │  │  ├─ forms-component.js
│  │  │  │  │  └─ table-component.js
│  │  │  │  ├─ ui
│  │  │  │  │  ├─ button-component.js
│  │  │  │  │  ├─ categories-component.css
│  │  │  │  │  ├─ categories-component.js
│  │  │  │  │  ├─ edit-component.js
│  │  │  │  │  └─ popup-component.js
│  │  │  │  └─ users
│  │  │  │     ├─ datatable-component.js
│  │  │  │     ├─ filters-component.js
│  │  │  │     ├─ forms-component.js
│  │  │  │     ├─ overview-component.js
│  │  │  │     └─ table-component.js
│  │  │  ├─ index.js
│  │  │  ├─ pages
│  │  │  │  ├─ 404.html
│  │  │  │  ├─ orders.html
│  │  │  │  ├─ promoters.html
│  │  │  │  └─ users.html
│  │  │  ├─ redux
│  │  │  │  ├─ slices
│  │  │  │  │  ├─ orders
│  │  │  │  │  │  ├─ forms-slice.js
│  │  │  │  │  │  ├─ orders-slice.js
│  │  │  │  │  │  └─ overview-slice.js
│  │  │  │  │  ├─ promoters
│  │  │  │  │  │  ├─ forms-slice.js
│  │  │  │  │  │  └─ promoters-slice.js
│  │  │  │  │  └─ users
│  │  │  │  │     ├─ forms-slice.js
│  │  │  │  │     └─ users-slice.js
│  │  │  │  └─ store.js
│  │  │  └─ utils
│  │  │     └─ components-mapping.js
│  │  └─ vite.config.js
│  ├─ admin-refactor
│  │  ├─ eslint.config.js
│  │  ├─ index.html
│  │  ├─ package.json
│  │  ├─ pnpm-lock.yaml
│  │  ├─ src
│  │  │  ├─ assets
│  │  │  │  ├─ components
│  │  │  │  │  ├─ 404
│  │  │  │  │  │  └─ 404-component.css
│  │  │  │  │  ├─ orders
│  │  │  │  │  ├─ promoters
│  │  │  │  │  ├─ ui
│  │  │  │  │  │  ├─ categories-component.css
│  │  │  │  │  │  └─ edit-menu.css
│  │  │  │  │  └─ users
│  │  │  │  ├─ icons
│  │  │  │  │  ├─ arrow-left-icon.svg
│  │  │  │  │  ├─ arrow-right-icon.svg
│  │  │  │  │  ├─ create-icon.svg
│  │  │  │  │  ├─ delete-icon.svg
│  │  │  │  │  ├─ general-icon.svg
│  │  │  │  │  ├─ menu-edit-icon.svg
│  │  │  │  │  ├─ menu-trash-icon.svg
│  │  │  │  │  ├─ misc-icon.svg
│  │  │  │  │  ├─ order-delete-icon.svg
│  │  │  │  │  ├─ order-edit-icon.svg
│  │  │  │  │  ├─ plus-icon.svg
│  │  │  │  │  └─ save-icon.svg
│  │  │  │  ├─ orders.css
│  │  │  │  ├─ promoters.css
│  │  │  │  ├─ root.css
│  │  │  │  ├─ styles.css
│  │  │  │  └─ users.css
│  │  │  ├─ components
│  │  │  │  ├─ 404
│  │  │  │  │  ├─ 404-component.css
│  │  │  │  │  ├─ 404-component.html
│  │  │  │  │  └─ 404-component.ts
│  │  │  │  ├─ header
│  │  │  │  │  ├─ header-component.ts
│  │  │  │  │  ├─ menu-component.ts
│  │  │  │  │  └─ title-component.ts
│  │  │  │  ├─ orders
│  │  │  │  │  ├─ datatable-component.ts
│  │  │  │  │  ├─ orders-component.ts
│  │  │  │  │  ├─ orders-config.ts
│  │  │  │  │  └─ table-component.ts
│  │  │  │  ├─ page-component.ts
│  │  │  │  ├─ promoters
│  │  │  │  │  ├─ promoters-component.ts
│  │  │  │  │  └─ promoters-config.ts
│  │  │  │  ├─ ui
│  │  │  │  │  ├─ button-component.ts
│  │  │  │  │  ├─ categories-component.ts
│  │  │  │  │  ├─ edit-component.ts
│  │  │  │  │  ├─ generic-datatable.ts
│  │  │  │  │  ├─ generic-forms.ts
│  │  │  │  │  └─ popup-component.ts
│  │  │  │  ├─ users
│  │  │  │  │  ├─ forms-component.ts
│  │  │  │  │  ├─ users-component.ts
│  │  │  │  │  └─ users-config.ts
│  │  │  │  └─ visual-form-builder.ts
│  │  │  ├─ main.ts
│  │  │  ├─ pages
│  │  │  │  ├─ 404.html
│  │  │  │  ├─ orders.html
│  │  │  │  ├─ promoters.html
│  │  │  │  └─ users.html
│  │  │  ├─ redux
│  │  │  │  ├─ core
│  │  │  │  │  └─ createEntitySlice.ts
│  │  │  │  ├─ slices
│  │  │  │  │  ├─ orders
│  │  │  │  │  │  ├─ forms-slice.ts
│  │  │  │  │  │  └─ orders-slice.ts
│  │  │  │  │  ├─ promoters
│  │  │  │  │  │  ├─ forms-slice.ts
│  │  │  │  │  │  └─ promoters-slice.ts
│  │  │  │  │  └─ users
│  │  │  │  │     ├─ forms-slice.ts
│  │  │  │  │     ├─ index.ts
│  │  │  │  │     └─ types.ts
│  │  │  │  ├─ store.ts
│  │  │  │  └─ types
│  │  │  │     └─ state.ts
│  │  │  ├─ types
│  │  │  ├─ utils
│  │  │  │  ├─ contrast-utils.ts
│  │  │  │  └─ form-builder.d.ts
│  │  │  └─ vite-env.d.ts
│  │  ├─ tsconfig.json
│  │  └─ vite.config.ts
│  ├─ auth
│  │  ├─ eslint.config.js
│  │  ├─ index.html
│  │  ├─ package-lock.json
│  │  ├─ package.json
│  │  ├─ pnpm-lock.yaml
│  │  ├─ pnpm-workspace.yaml
│  │  ├─ src
│  │  │  ├─ assets
│  │  │  │  └─ root.css
│  │  │  ├─ components
│  │  │  │  ├─ 404
│  │  │  │  │  ├─ 404-component.css
│  │  │  │  │  ├─ 404-component.html
│  │  │  │  │  └─ 404-component.ts
│  │  │  │  ├─ builder
│  │  │  │  │  ├─ builder-component.css
│  │  │  │  │  ├─ builder-component.html
│  │  │  │  │  ├─ builder-component.ts
│  │  │  │  │  ├─ builder-demo-component.ts
│  │  │  │  │  ├─ index.ts
│  │  │  │  │  └─ svgs
│  │  │  │  │     ├─ builder-icon.svg
│  │  │  │  │     ├─ calculator-icon.svg
│  │  │  │  │     ├─ chart-icon.svg
│  │  │  │  │     ├─ close-icon.svg
│  │  │  │  │     ├─ code-icon.svg
│  │  │  │  │     ├─ contact-icon.svg
│  │  │  │  │     ├─ date-icon.svg
│  │  │  │  │     ├─ email-icon.svg
│  │  │  │  │     ├─ eye-icon.svg
│  │  │  │  │     ├─ folder-icon.svg
│  │  │  │  │     ├─ laptop-icon.svg
│  │  │  │  │     ├─ lock-icon.svg
│  │  │  │  │     ├─ pallete-icon.svg
│  │  │  │  │     ├─ paper-icon.svg
│  │  │  │  │     ├─ pen-icon.svg
│  │  │  │  │     ├─ person-icon.svg
│  │  │  │  │     ├─ save-icon.svg
│  │  │  │  │     ├─ select-icon.svg
│  │  │  │  │     ├─ text-icon.svg
│  │  │  │  │     ├─ trash-icon.svg
│  │  │  │  │     └─ writebook-icon.svg
│  │  │  │  ├─ forms
│  │  │  │  │  ├─ form-builder.ts
│  │  │  │  │  ├─ form-schema.ts
│  │  │  │  │  └─ index.ts
│  │  │  │  ├─ login
│  │  │  │  │  ├─ login-component.css
│  │  │  │  │  ├─ login-component.html
│  │  │  │  │  └─ login-component.ts
│  │  │  │  ├─ page-component.ts
│  │  │  │  ├─ register
│  │  │  │  │  ├─ register-component.css
│  │  │  │  │  ├─ register-component.html
│  │  │  │  │  ├─ register-component.ts
│  │  │  │  │  └─ svgs
│  │  │  │  │     ├─ error.svg
│  │  │  │  │     └─ success.svg
│  │  │  │  └─ swapy
│  │  │  │     ├─ swapy-component.css
│  │  │  │     ├─ swapy-component.html
│  │  │  │     └─ swapy-component.ts
│  │  │  ├─ main.ts
│  │  │  ├─ utils
│  │  │  │  ├─ contrast-utils.ts
│  │  │  │  └─ form-builder.d.ts
│  │  │  └─ vite-env.d.ts
│  │  ├─ tsconfig.json
│  │  └─ vite.config.ts
│  ├─ landing
│  │  ├─ eslint.config.js
│  │  ├─ index.html
│  │  ├─ package-lock.json
│  │  ├─ package.json
│  │  ├─ pnpm-lock.yaml
│  │  ├─ postcss.config.cjs
│  │  ├─ src
│  │  │  ├─ assets
│  │  │  │  ├─ font
│  │  │  │  │  ├─ hero.ttf
│  │  │  │  │  └─ Ndot-57.otf
│  │  │  │  └─ root.css
│  │  │  ├─ components
│  │  │  │  ├─ 404
│  │  │  │  │  ├─ 404-component.css
│  │  │  │  │  └─ 404-component.html
│  │  │  │  ├─ home
│  │  │  │  │  ├─ home-component.css
│  │  │  │  │  ├─ home-component.html
│  │  │  │  │  ├─ home-component.ts
│  │  │  │  │  ├─ impl
│  │  │  │  │  │  ├─ services-component.css
│  │  │  │  │  │  └─ services-component.ts
│  │  │  │  │  └─ svgs
│  │  │  │  │     ├─ documentation.svg
│  │  │  │  │     ├─ error.svg
│  │  │  │  │     ├─ pricing.svg
│  │  │  │  │     └─ success.svg
│  │  │  │  ├─ navbar
│  │  │  │  │  ├─ navbar-component.css
│  │  │  │  │  ├─ navbar-component.ts
│  │  │  │  │  └─ svgs
│  │  │  │  │     └─ icon.svg
│  │  │  │  └─ page-component.ts
│  │  │  ├─ main.ts
│  │  │  ├─ types
│  │  │  │  └─ uikit.d.ts
│  │  │  └─ vite-env.d.ts
│  │  ├─ tailwind.config.js
│  │  ├─ tsconfig.json
│  │  └─ vite.config.ts
│  └─ promoters
│     ├─ auth
│     ├─ eslint.config.js
│     ├─ index.html
│     ├─ package.json
│     ├─ pnpm-lock.yaml
│     ├─ src
│     │  ├─ assets
│     │  │  ├─ components
│     │  │  │  └─ promoters
│     │  │  │     ├─ datatable.css
│     │  │  │     ├─ filters.css
│     │  │  │     └─ promoters.css
│     │  │  └─ styles.css
│     │  ├─ components
│     │  │  ├─ header
│     │  │  │  ├─ header-component.ts
│     │  │  │  ├─ menu-component.ts
│     │  │  │  └─ title-component.ts
│     │  │  ├─ page-component.ts
│     │  │  └─ promoters
│     │  │     ├─ datatable-component.ts
│     │  │     ├─ filters-component.ts
│     │  │     ├─ forms-component.ts
│     │  │     ├─ header-component.ts
│     │  │     ├─ overview-component.ts
│     │  │     ├─ promoters-component.css
│     │  │     ├─ promoters-component.html
│     │  │     └─ promoters-component.ts
│     │  ├─ main.ts
│     │  └─ vite-env.d.ts
│     ├─ tsconfig.json
│     └─ vite.config.ts
├─ gitfolio
│  ├─ index.html
│  ├─ package.json
│  ├─ pnpm-lock.yaml
│  ├─ src
│  │  ├─ api
│  │  ├─ assets
│  │  │  └─ franken-ui.css
│  │  ├─ components
│  │  │  ├─ card
│  │  │  │  └─ card-component.ts
│  │  │  └─ stats
│  │  ├─ main.ts
│  │  ├─ types
│  │  │  └─ uikit.d.ts
│  │  └─ vite-env.d.ts
│  ├─ tsconfig.json
│  └─ vite.config.ts
├─ README.md
└─ youthing
   ├─ api
   │  ├─ .sequelizerc
   │  ├─ config
   │  │  ├─ config.json
   │  │  └─ database.config.ts
   │  ├─ dist
   │  │  ├─ config
   │  │  │  ├─ config.json
   │  │  │  ├─ database.config.js
   │  │  │  └─ database.config.js.map
   │  │  ├─ database
   │  │  │  ├─ index.js
   │  │  │  └─ index.js.map
   │  │  ├─ dist
   │  │  │  ├─ database.config.js
   │  │  │  └─ database.config.js.map
   │  │  ├─ index.js
   │  │  ├─ index.js.map
   │  │  ├─ migrations
   │  │  │  ├─ 001-create-users.js
   │  │  │  ├─ 001-create-users.js.map
   │  │  │  ├─ 002-create-user-activation-tokens.js
   │  │  │  ├─ 002-create-user-activation-tokens.js.map
   │  │  │  ├─ 005-create-customers.js
   │  │  │  ├─ 005-create-customers.js.map
   │  │  │  ├─ 009-create-promoters.js
   │  │  │  ├─ 009-create-promoters.js.map
   │  │  │  ├─ 013-create-towns.js
   │  │  │  ├─ 013-create-towns.js.map
   │  │  │  ├─ 014-create-spots.js
   │  │  │  ├─ 014-create-spots.js.map
   │  │  │  ├─ 017-create-sent-emails.js
   │  │  │  ├─ 017-create-sent-emails.js.map
   │  │  │  ├─ 021-create-event-categories.js
   │  │  │  ├─ 021-create-event-categories.js.map
   │  │  │  ├─ 022-create-events.js
   │  │  │  ├─ 022-create-events.js.map
   │  │  │  ├─ 023-create-event-prices.js
   │  │  │  ├─ 023-create-event-prices.js.map
   │  │  │  ├─ 024-create-event-occurrences.js
   │  │  │  ├─ 024-create-event-occurrences.js.map
   │  │  │  ├─ 026-create-bots.js
   │  │  │  └─ 026-create-bots.js.map
   │  │  ├─ models
   │  │  │  ├─ impl
   │  │  │  │  ├─ bot.js
   │  │  │  │  ├─ bot.js.map
   │  │  │  │  ├─ customer.js
   │  │  │  │  ├─ customer.js.map
   │  │  │  │  ├─ event.js
   │  │  │  │  ├─ event.js.map
   │  │  │  │  ├─ eventCategory.js
   │  │  │  │  ├─ eventCategory.js.map
   │  │  │  │  ├─ eventOccurrence.js
   │  │  │  │  ├─ eventOccurrence.js.map
   │  │  │  │  ├─ eventPrice.js
   │  │  │  │  ├─ eventPrice.js.map
   │  │  │  │  ├─ promoter.js
   │  │  │  │  ├─ promoter.js.map
   │  │  │  │  ├─ sentEmail.js
   │  │  │  │  ├─ sentEmail.js.map
   │  │  │  │  ├─ spot.js
   │  │  │  │  ├─ spot.js.map
   │  │  │  │  ├─ town.js
   │  │  │  │  ├─ town.js.map
   │  │  │  │  ├─ user.js
   │  │  │  │  ├─ user.js.map
   │  │  │  │  ├─ userActivationToken.js
   │  │  │  │  └─ userActivationToken.js.map
   │  │  │  ├─ index.js
   │  │  │  └─ index.js.map
   │  │  └─ scripts
   │  │     ├─ build.js
   │  │     ├─ build.js.map
   │  │     ├─ migrate.js
   │  │     └─ migrate.js.map
   │  ├─ nodemon.json
   │  ├─ package.json
   │  ├─ pnpm-lock.yaml
   │  ├─ src
   │  │  ├─ config
   │  │  │  └─ config.json
   │  │  ├─ database
   │  │  │  └─ index.ts
   │  │  ├─ index.ts
   │  │  ├─ migrations
   │  │  │  ├─ 001-create-users.ts
   │  │  │  ├─ 002-create-user-activation-tokens.ts
   │  │  │  ├─ 005-create-customers.ts
   │  │  │  ├─ 009-create-promoters.ts
   │  │  │  ├─ 013-create-towns.ts
   │  │  │  ├─ 014-create-spots.ts
   │  │  │  ├─ 017-create-sent-emails.ts
   │  │  │  ├─ 021-create-event-categories.ts
   │  │  │  ├─ 022-create-events.ts
   │  │  │  ├─ 023-create-event-prices.ts
   │  │  │  ├─ 024-create-event-occurrences.ts
   │  │  │  └─ 026-create-bots.ts
   │  │  ├─ models
   │  │  │  ├─ impl
   │  │  │  │  ├─ bot.ts
   │  │  │  │  ├─ customer.ts
   │  │  │  │  ├─ event.ts
   │  │  │  │  ├─ eventCategory.ts
   │  │  │  │  ├─ eventOccurrence.ts
   │  │  │  │  ├─ eventPrice.ts
   │  │  │  │  ├─ promoter.ts
   │  │  │  │  ├─ sentEmail.ts
   │  │  │  │  ├─ spot.ts
   │  │  │  │  ├─ town.ts
   │  │  │  │  ├─ user.ts
   │  │  │  │  └─ userActivationToken.ts
   │  │  │  └─ index.ts
   │  │  ├─ scripts
   │  │  │  ├─ build.ts
   │  │  │  └─ migrate.ts
   │  │  └─ types
   │  │     └─ sequelize.d.ts
   │  └─ tsconfig.json
   └─ client

```