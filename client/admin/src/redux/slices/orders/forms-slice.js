import { createSlice } from '@reduxjs/toolkit'

export const formsSlice = createSlice({
  name: 'orders_forms',
  initialState: {
    currentTab: 'general',
    inputs: {},
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
    },
  },
})

export const { addElement, removeElement, editElement, setCurrentTab, createElement } = formsSlice.actions
export const broadcastInputs = state => state.forms.inputs
export default formsSlice.reducer
