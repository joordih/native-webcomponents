import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormElement {
  value: string;
  type?: string;
  placeholder?: string;
}

interface FormsState {
  inputs: Record<string, FormElement>;
  currentTab: string;
}

const initialState: FormsState = {
  inputs: {},
  currentTab: 'general'
};

const usersFormsSlice = createSlice({
  name: 'users_forms',
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
      const { value, ...otherProps } = action.payload.element;
      state.inputs[action.payload.id] = { value: value || '', ...otherProps };
    },
    setCurrentTab: (state, action: PayloadAction<string>) => {
      state.currentTab = action.payload;
    }
  }
});

export const { addElement, editElement, createElement, setCurrentTab } = usersFormsSlice.actions;
export default usersFormsSlice.reducer;