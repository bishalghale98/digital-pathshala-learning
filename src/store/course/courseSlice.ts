import { createSlice } from "@reduxjs/toolkit";

import { Status } from "../types";
import { AppDispatch } from "../store";
import api from "@/config/api";
import { ICoursesInitialState } from "./types";


const datas: ICoursesInitialState = {
  Courses: [],
  status: Status.Loading,
};

const courseSlice = createSlice({
  name: "course",
  initialState: datas,
  reducers: {
    setStatus(state, action) {
      state.status = action.payload;
    },
    setCourses(state, action) {
      state.Courses = action.payload;
    },
  },
});

export const { setCourses, setStatus } = courseSlice.actions;
export default courseSlice.reducer;

export function fetchCourses() {
  return async function fetchCoursesThunk(dispatch: AppDispatch) {
    try {
      const res = await api.get("course");

      if (res.data.success) {
        dispatch(setStatus(Status.Loading));
        dispatch(setCourses(res.data.data));
      } else {
        dispatch(setStatus(Status.Error));
      }
    } catch (error) {
      console.log(error);
      dispatch(setStatus(Status.Error));
    }
  };
}

// export function createCategory(data: z.infer<typeof categoryCreateSchema>) {
//   return async function createCategoryThunk(dispatch: AppDispatch) {
//     try {
//       const res = await api.post("category", data);

//       if (res.data.success) {
//         dispatch(addCategory(res.data.data));
//       }
//     } catch (error) {
//       console.error(error);
//       dispatch(setStatus(Status.Error));
//     }
//   };
// }

// export function deleteCategory(id: string) {
//   return async function deleteCategoryThunk(dispatch: AppDispatch) {
//     try {
//       const res = await api.delete(`category/${id}`);

//       if (res.data.success) {
//         dispatch(removeCategory(id));
//       }
//     } catch (error) {
//       console.error(error);
//       dispatch(setStatus(Status.Error));
//     }
//   };
// }

// export function updateCategory(
//   id: string,
//   data: z.infer<typeof categoryCreateSchema>
// ) {
//   return async function updateCategoryThunk(dispatch: AppDispatch) {
//     try {
//       const res = await api.put(`category/${id}`, data);

//       if (res.data.success) {
//         dispatch(editCategory(res.data.data));
//       }
//     } catch (error) {
//       console.error(error);
//       dispatch(setStatus(Status.Error));
//     }
//   };
// }
