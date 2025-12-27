import { configureStore } from "@reduxjs/toolkit";
import categorySlice from "./category/categorySlice";
import courseSlice from "./course/courseSlice";
import lessonSlice from "./lesson/lessonSlice";
import studentSlice from "./student/studentSlice";
import enrollmentSlice from "./enrollment/enrollmentSlice";
import paymentSlice from "./payment/paymentSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      categories: categorySlice,
      courses: courseSlice,
      lessons: lessonSlice,
      students: studentSlice,
      enrollments: enrollmentSlice,
      payments: paymentSlice,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
