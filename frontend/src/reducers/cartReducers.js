//Programmer Name: Jagatiswary mageswaran & Veeshaal saravanan
//Program Name: Cart Reducer
//Descrption: Cart Reducer which sends cart details request
//First written on: 20 May, 2026
//Edited on:


import { ADD_TO_CART, REMOVE_ITEM_CART, SAVE_SHIPPING_INFO } from "../constants/cartConstants";
import { CLEAR_CART } from "../constants/cartConstants";

export const cartReducer = (state = { cartItems: [] , shippingInfo: {} }, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const item = action.payload;
      const isItemExist = state.cartItems.find(
        (i) => i.product === item.product
      );
      if (isItemExist) {
        return {
          ...state,
          cartItems: state.cartItems.map((i) =>
            i.product === isItemExist.product ? item : i
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }

    case REMOVE_ITEM_CART:
      return {
        ...state,
        cartItems: state.cartItems.filter(i => i.product !== action.payload)
      }  

    case CLEAR_CART:
      return {
        ...state,
        cartItems: [],
      };

    case SAVE_SHIPPING_INFO:
      return{
        ...state,
        shippingInfo: action.payload
      }  

    default:
      return state;
  }
};
