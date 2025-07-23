import {
  createSlice,
  PayloadAction,
  Draft,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import { BaseEntity, EntityState } from "../types/state";

export function createEntitySlice<T extends BaseEntity>({
  name,
  initialItems = [],
  extraReducers = {},
}: {
  name: string;
  initialItems?: T[];
  extraReducers?: SliceCaseReducers<EntityState<T>>;
}) {
  const initialState: EntityState<T> = {
    items: initialItems,
    count: initialItems.length,
    loading: false,
    error: null,
    searchTerm: {},
    draftFilters: {},
    queuedUpdate: false,
  };

  return createSlice({
    name,
    initialState,
    reducers: {
      addItem: (state, action: PayloadAction<T>) => {
        state.items.push(action.payload as Draft<T>);
      },
      addItems: (state, action: PayloadAction<T[]>) => {
        state.items = action.payload as Draft<T[]>;
        state.count = action.payload.length;
      },
      removeItem: (state, action: PayloadAction<number>) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      },
      editItem: (state, action: PayloadAction<T>) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) state.items[index] = action.payload as Draft<T>;
      },
      clearItems: (state) => {
        state.items = [];
        state.count = 0;
      },
      setSearchTerm: (state, action: PayloadAction<Record<string, any>>) => {
        state.searchTerm = action.payload;
      },
      initDraftFilters: (state) => {
        state.draftFilters = { ...state.searchTerm };
      },
      setDraftFilters: (state, action: PayloadAction<Record<string, any>>) => {
        state.draftFilters = action.payload;
      },
      applyDraftFilters: (state) => {
        state.searchTerm = { ...state.draftFilters };
      },
      clearFilters: (state) => {
        state.searchTerm = {};
        state.draftFilters = {};
      },
      setCount: (state, action: PayloadAction<number>) => {
        state.count = action.payload;
      },
      incrementCount: (state) => {
        state.count++;
      },
      decrementCount: (state) => {
        state.count--;
      },
      setQueuedUpdate: (state, action: PayloadAction<boolean>) => {
        state.queuedUpdate = action.payload;
      },
      ...extraReducers,
    },
  });
}
