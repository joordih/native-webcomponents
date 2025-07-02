import { createSlice } from '@reduxjs/toolkit'

export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    count: 0,
    loading: false,
    error: null,
    searchTerm: {},
    draftFilters: {},
    queuedUpdate: false
  },
  reducers: {
    addUser: (state, action) => {
      state.users.push(action.payload)
    },
    addUsers: (state, action) => {
      state.users = action.payload
    },
    removeUser: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload)
    },
    editUser: (state, action) => {
      const index = state.users.findIndex(
        user => user.id === Number(action.payload.id)
      )
      state.users[index] = action.payload
    },
    clearUsers: state => {
      state.users = []
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload
    },
    initDraftFilters: state => {
      state.draftFilters = state.searchTerm
    },
    setDraftFilters: (state, action) => {
      state.draftFilters = action.payload
    },
    applyDraftFilters: state => {
      state.searchTerm = state.draftFilters
    },
    clearFilters: state => {
      state.searchTerm = {}
      state.draftFilters = {}
    },
    setCount: (state, action) => {
      state.count = action.payload
    },
    incrementCount: state => {
      state.count++
    },
    decrementCount: state => {
      state.count--
    },
    setQueuedUpdate: (state, action) => {
      state.queuedUpdate = action.payload
    }
  }
})

export const {
  addUser,
  addUsers,
  removeUser,
  editUser,
  clearUsers,
  setSearchTerm,
  setCount,
  incrementCount,
  decrementCount,
  setQueuedUpdate,
  initDraftFilters,
  setDraftFilters,
  applyDraftFilters,
  clearFilters
} = usersSlice.actions

export default usersSlice.reducer
