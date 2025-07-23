import { createEntitySlice } from "@/redux/core/createEntitySlice";
import { User } from "./types";
import { PayloadAction } from "@reduxjs/toolkit";

const userSlice = createEntitySlice<User>({
  name: "users",
  extraReducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.items.push(action.payload);
    },
    addUsers: (state, action: PayloadAction<User[]>) => {
      state.items = action.payload;
    },
    removeUser: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((user) => user.id !== action.payload);
    },
    editUser: (state, action: PayloadAction<User>) => {
      const index: number = state.items.findIndex(
        (user) => user.id === Number(action.payload.id)
      );
      state.items[index] = action.payload;
    },
    clearUsers: (state) => {
      state.items = [];
    },
    setSearchTerm: (state, action: PayloadAction<{}>) => {
      state.searchTerm = action.payload;
    },
    initDraftFilters: (state) => {
      state.draftFilters = state.searchTerm;
    },
    setDraftFilters: (state, action: PayloadAction<{}>) => {
      state.draftFilters = action.payload;
    },
    applyDraftFilters: (state) => {
      state.searchTerm = state.draftFilters;
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
  },
});

export const {
  addItem: addUser,
  addItems: addUsers,
  removeItem: removeUser,
  editItem: editUser,
  clearItems: clearUsers,
  setSearchTerm,
  initDraftFilters,
  setDraftFilters,
  applyDraftFilters,
  clearFilters,
  setCount,
  incrementCount,
  decrementCount,
  setQueuedUpdate,
} = userSlice.actions;

export default userSlice.reducer;
