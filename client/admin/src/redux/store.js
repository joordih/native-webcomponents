import { configureStore } from '@reduxjs/toolkit'

import ordersFormSlice from './slices/orders/forms-slice.js'
import ordersSlice from './slices/orders/orders-slice.js'
import usersFormSlice from './slices/users/forms-slice.js'
import usersSlice from './slices/users/users-slice.js'
import promotersFormsSlice from './slices/promoters/forms-slice.js'
import promotersSlice from './slices/promoters/promoters-slice.js'

export const store = configureStore({
  reducer: {
    orders_forms: ordersFormSlice,
    orders: ordersSlice,
    users_forms: usersFormSlice,
    users: usersSlice,
    promoters_forms: promotersFormsSlice,
    promoters: promotersSlice
  }
})

export default store
