import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchPizzas = createAsyncThunk('pizzas/fetchPizzasStatus', async (params) => {
  const { sortBy, order, category, search, currentPage } = params;
  const { data } = await axios.get(
    `https://652d06acf9afa8ef4b26a53e.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`,
  );
  return data;
});

const initialState = {
  items: [],
  status: 'loading', //loading | success | error
};

export const pizzasSlice = createSlice({
  name: 'pizzas',
  initialState,
  reducers: {
    setItems(state, action) {
      state.items = action.payload;
    },
  },
  extraReducers: {
    [fetchPizzas.pending]: (state) => {
      state.status = 'loading';
      state.items = [];
      console.log('Идет запрос');
    },
    [fetchPizzas.fulfilled]: (state, action) => {
      state.items = action.payload;
      state.status = 'success';
      console.log(state, 'Все ок');
    },
    [fetchPizzas.rejected]: (state, action) => {
      state.status = 'error';
      state.items = [];
      console.log('Была ошибка');
    },
  },
});

export const { setItems } = pizzasSlice.actions;

export default pizzasSlice.reducer;
