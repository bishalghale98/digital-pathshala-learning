import { configureStore } from "@reduxjs/toolkit";
import categorySlice from "./category/categorySlice";
import courseSlice from "./course/courseSlice";
import lessonSlice from "./lesson/lessonSlice";
import studentSlice from "./student/studentSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      categories: categorySlice,
      courses: courseSlice,
      lessons: lessonSlice,
      students: studentSlice,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
