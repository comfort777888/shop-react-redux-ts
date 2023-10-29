import axios from 'axios';
import { Pizza, SearchPizzaParams } from './types';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchPizzas = createAsyncThunk<Pizza[], SearchPizzaParams>(
  'pizzas/fetchPizzasStatus',
  async (params) => {
    const { sortBy, order, category, search, currentPage } = params;
    const { data } = await axios.get<Pizza[]>(
      `https://652d06acf9afa8ef4b26a53e.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`,
    );

    return data;
  },
);
