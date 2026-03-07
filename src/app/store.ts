import { configureStore} from '@reduxjs/toolkit';
 import userReducer from  '../Slices/userSlice';
import ProductsReducer from  '../Slices/productSlice';
import CartReducer from  '../Slices/CartSlice';



const store = configureStore({
  reducer: {
    user: userReducer,
    products: ProductsReducer,
    cart: CartReducer,

  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
