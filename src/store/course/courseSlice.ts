import { createSlice } from "@reduxjs/toolkit";

import { Status } from "../types";
import { AppDispatch } from "../store";
import api from "@/config/api";
import { ICoursesInitialState } from "./types";
import { createCourseSchema } from "@/schemas/courseSchema";
import z from "zod";

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
    addCourse(state, action) {
      state.Courses.push(action.payload);
    },
    removeCourse(state, action) {
      const index = state.Courses.findIndex(
        (course) => course._id == action.payload
      );
      if (index !== -1) {
        state.Courses.splice(index, 1);
      }
    },
    editCourse(state, action) {
      const updatedCourse = action.payload;
      const index = state.Courses.findIndex(
        (course) => course._id === updatedCourse?._id
      );
      if (index !== -1) {
        state.Courses[index] = updatedCourse;
      }
    },
  },
});

export const { setCourses, setStatus, addCourse, removeCourse, editCourse } =
  courseSlice.actions;
export default courseSlice.reducer;

export function fetchCourses() {
  return async function fetchCoursesThunk(dispatch: AppDispatch) {
    
    try {
      const res = await api.get("course");

      if (res.data.success) {
        dispatch(setStatus(Status.Success));
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

export function createCourse(data: z.infer<typeof createCourseSchema>) {
  return async function createCourseThunk(dispatch: AppDispatch) {
    try {
      const res = await api.post("course", data);

      if (res.data.success) {
        dispatch(addCourse(res.data.data));
      }
    } catch (error) {
      console.error(error);
      dispatch(setStatus(Status.Error));
    }
  };
}

export function deleteCourse(id: string) {
  return async function deleteCourseThunk(dispatch: AppDispatch) {
    try {
      const res = await api.delete(`course/${id}`);

      if (res.data.success) {
        dispatch(removeCourse(id));
      }
    } catch (error) {
      console.error(error);
      dispatch(setStatus(Status.Error));
    }
  };
}

export function updateCourse(
  id: string,
  data: z.infer<typeof createCourseSchema>
) {
  return async function updateCourseThunk(dispatch: AppDispatch) {
    try {
      const res = await api.put(`course/${id}`, data);

      if (res.data.success) {
        dispatch(editCourse(res.data.data));
      }
    } catch (error) {
      console.error(error);
      dispatch(setStatus(Status.Error));
    }
  };
}
