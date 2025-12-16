import { configureStore } from "@reduxjs/toolkit";
import categorySlice from "./category/categorySlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      categories: categorySlice,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
