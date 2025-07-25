import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormElement {
  value: string;
  type?: string;
  placeholder?: string;
}

interface PromotersFormsState {
  inputs: Record<string, FormElement>;
  currentTab: string;
}

const initialState: PromotersFormsState = {
  inputs: {},
  currentTab: 'general'
};

const promotersFormsSlice = createSlice({
  name: 'promoters_forms',
  initialState,
  reducers: {
    addElement: (state, action: PayloadAction<{ id: string; element: FormElement }>) => {
      state.inputs[action.payload.id] = action.payload.element;
    },
    editElement: (state, action: PayloadAction<{ id: string; element: FormElement }>) => {
      if (state.inputs[action.payload.id]) {
        state.inputs[action.payload.id] = { ...state.inputs[action.payload.id], ...action.payload.element };
      }
    },
    createElement: (state, action: PayloadAction<{ id: string; element: FormElement }>) => {
      state.inputs[action.payload.id] = { ...action.payload.element, value: action.payload.element.value || '' };
    },
    setCurrentTab: (state, action: PayloadAction<string>) => {
      state.currentTab = action.payload;
    }
  }
});

export const { addElement, editElement, createElement, setCurrentTab } = promotersFormsSlice.actions;
export default promotersFormsSlice.reducer;