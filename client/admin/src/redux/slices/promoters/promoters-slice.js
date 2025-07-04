import { createSlice } from '@reduxjs/toolkit'

export const promotersSlice = createSlice({
  name: 'promoters',
  initialState: {
    promoters: [],
    count: 0,
    loading: false,
    error: null,
    searchTerm: {},
    draftFilters: {},
    queuedUpdate: false
  },
  reducers: {
    addPromoter: (state, action) => {
      state.promoters.push(action.payload)
    },
    addPromoters: (state, action) => {
      state.promoters = action.payload
    },
    removePromoter: (state, action) => {
      state.promoters = state.promoters.filter(
        promoter => promoter.id !== action.payload
      )
    },
    editPromoter: (state, action) => {
      const index = state.promoters.findIndex(
        promoter => promoter.id === Number(action.payload.id)
      )
      state.promoters[index] = action.payload
    },
    clearPromoters: state => {
      state.promoters = []
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
  addPromoter,
  addPromoters,
  removePromoter,
  editPromoter,
  clearPromoters,
  setSearchTerm,
  setCount,
  incrementCount,
  decrementCount,
  setQueuedUpdate,
  initDraftFilters,
  setDraftFilters,
  applyDraftFilters,
  clearFilters
} = promotersSlice.actions

export default promotersSlice.reducer
