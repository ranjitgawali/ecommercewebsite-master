//import { createSlice } from '@reduxjs/toolkit';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; 

export const fetchCartProducts = createAsyncThunk(
  'custcartSlice/fetchCartProducts',
  async (customerId) => {
    const response = await axios.get(`https://freeapi.gerasim.in/api/BigBasket/GetCartProductsByCustomerId?id=${customerId}`);
    return response.data;
  }
);

const initialState = {
  cartProducts: [],

};

const custcartSlice = createSlice({
  name: 'custcartSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.cartProducts = action.payload.data;
      })
      
  },
});


/********* user slice*** */ 
export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLoggedIn: false,
    custObj:{} ,
  },
  reducers: {
    login: (state, action) => { 
      state.isLoggedIn = true;
      state.custObj=action.payload;
    },
    logout: state => {
      state.isLoggedIn = false;
      state.custId = null;
    },
  },
});



export const selectCartProducts = (state) => state.custcartSlice.cartProducts;
export const { login, logout } = userSlice.actions;
export const selectIsLoggedIn = state => state.user.isLoggedIn;
export const selectCustomerObj=state => state.user.custObj;
export const rootReducer = {
  user: userSlice.reducer,
  custcartSlice:custcartSlice.reducer,
 
};
