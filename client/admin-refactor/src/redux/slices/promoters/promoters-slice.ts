import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Promoter {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

interface PromotersState {
  promoters: Promoter[];
  count: number;
  queuedUpdate: boolean;
  searchTerm: Record<string, any> | null;
  draftFilters: Record<string, any>;
  loading: boolean;
  error: string | null;
}

const initialState: PromotersState = {
  promoters: [],
  count: 0,
  queuedUpdate: false,
  searchTerm: null,
  draftFilters: {},
  loading: false,
  error: null,
};

const promotersSlice = createSlice({
  name: "promoters",
  initialState,
  reducers: {
    addPromoters: (state, action: PayloadAction<Promoter[]>) => {
      state.promoters = action.payload;
    },
    addPromoter: (state, action: PayloadAction<Promoter>) => {
      state.promoters.push(action.payload);
    },
    removePromoter: (state, action: PayloadAction<number>) => {
      state.promoters = state.promoters.filter(
        (promoter) => promoter.id !== action.payload
      );
    },
    editPromoter: (state, action: PayloadAction<Promoter>) => {
      const index = state.promoters.findIndex(
        (promoter) => promoter.id === action.payload.id
      );
      if (index !== -1) {
        state.promoters[index] = action.payload;
      }
    },
    clearPromoters: (state) => {
      state.promoters = [];
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
    setSearchTerm: (
      state,
      action: PayloadAction<Record<string, any> | string | null | undefined>
    ) => {
      if (typeof action.payload === "string") {
        state.searchTerm = { search: action.payload };
      } else {
        state.searchTerm = action.payload || null;
      }
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
      state.searchTerm = null;
      state.draftFilters = {};
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addPromoters,
  addPromoter,
  removePromoter,
  editPromoter,
  clearPromoters,
  setCount,
  incrementCount,
  decrementCount,
  setQueuedUpdate,
  setSearchTerm,
  initDraftFilters,
  setDraftFilters,
  applyDraftFilters,
  clearFilters,
  setLoading,
  setError,
} = promotersSlice.actions;

export default promotersSlice.reducer;
