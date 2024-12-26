// store.js
import { configureStore } from '@reduxjs/toolkit'
import{rootReducer} from './slice/Userslice';

export const store = configureStore({
  reducer: rootReducer,
});
