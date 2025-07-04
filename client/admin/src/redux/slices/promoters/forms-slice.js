import { createSlice } from '@reduxjs/toolkit'

export const promotersForms = createSlice({
  name: 'promoters_forms',
  initialState: {
    currentTab: 'general',
    inputs: {}
  },
  reducers: {
    addElement: (state, action) => {
      state.inputs[action.payload.id] = action.payload.element
    },
    removeElement: (state, action) => {
      delete state.inputs[action.payload]
    },
    editElement: (state, action) => {
      state.inputs[action.payload.id] = action.payload.element
    },
    createElement: (state, action) => {
      state.inputs[action.payload.id] = action.payload.element
      state.currentTab = 'create'
    },
    setCurrentTab: (state, action) => {
      state.currentTab = action.payload
    }
  }
})

export const {
  addElement,
  removeElement,
  editElement,
  setCurrentTab,
  createElement
} = promotersForms.actions
export const broadcastInputs = state => state.forms.inputs
export default promotersForms.reducer
