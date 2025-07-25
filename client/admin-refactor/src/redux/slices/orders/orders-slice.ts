import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Order {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface OrdersState {
  orders: Order[];
  count: number;
  queuedUpdate: boolean;
  searchTerm: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  count: 0,
  queuedUpdate: false,
  searchTerm: null,
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.push(action.payload);
    },
    removeOrder: (state, action: PayloadAction<number>) => {
      state.orders = state.orders.filter(
        (order) => order.id !== action.payload
      );
    },
    editOrder: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex(
        (order) => order.id === action.payload.id
      );
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },
    clearOrders: (state) => {
      state.orders = [];
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
      action: PayloadAction<string | null | undefined>
    ) => {
      state.searchTerm = action.payload || null;
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
  addOrders,
  addOrder,
  removeOrder,
  editOrder,
  clearOrders,
  setCount,
  incrementCount,
  decrementCount,
  setQueuedUpdate,
  setSearchTerm,
  setLoading,
  setError,
} = ordersSlice.actions;

export { ordersSlice };

export default ordersSlice.reducer;
