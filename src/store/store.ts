import { configureStore } from "@reduxjs/toolkit";
import categorySlice from "./category/categorySlice";
import courseSlice from "./course/courseSlice";
import lessonSlice from "./lesson/lessonSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      categories: categorySlice,
      courses: courseSlice,
      lessons: lessonSlice,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
