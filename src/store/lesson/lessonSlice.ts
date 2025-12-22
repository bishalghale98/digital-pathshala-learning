import { createSlice } from "@reduxjs/toolkit";

import { Status } from "../types";
import { AppDispatch } from "../store";
import api from "@/config/api";
import { createCourseSchema } from "@/schemas/courseSchema";
import z from "zod";
import { ILessonsInitialState } from "./types";
import { lessonCreateSchema } from "@/schemas/lessonSchema";

const datas: ILessonsInitialState = {
  Lessons: [],
  status: Status.Loading,
};

const lessonSlice = createSlice({
  name: "lesson",
  initialState: datas,
  reducers: {
    setStatus(state, action) {
      state.status = action.payload;
    },
    setLessons(state, action) {
      state.Lessons = action.payload;
    },
    addLesson(state, action) {
      state.Lessons.push(action.payload);
    },
    removeLesson(state, action) {
      const index = state.Lessons.findIndex(
        (lesson) => lesson._id == action.payload
      );
      if (index !== -1) {
        state.Lessons.splice(index, 1);
      }
    },
    // editCourse(state, action) {
    //   const updatedCourse = action.payload;
    //   const index = state.Courses.findIndex(
    //     (course) => course._id === updatedCourse?._id
    //   );
    //   if (index !== -1) {
    //     state.Courses[index] = updatedCourse;
    //   }
    // },
  },
});

export const { setLessons, setStatus, addLesson, removeLesson } =
  lessonSlice.actions;
export default lessonSlice.reducer;

export function fetchLessons(id: string) {
  return async function fetchLessonsThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.Loading));

    try {
      const res = await api.get(`/lesson/course/${id}`);

      if (res.data.success) {
        dispatch(setLessons(res.data.data));
        dispatch(setStatus(Status.Success));
      } else {
        dispatch(setStatus(Status.Error));
      }
    } catch (error) {
      console.error(error);
      dispatch(setStatus(Status.Error));
    }
  };
}

export function createLesson(data: z.infer<typeof lessonCreateSchema>) {
  return async function createLessonThunk(dispatch: AppDispatch) {
    try {
      const res = await api.post("lesson", data);

      if (res.data.success) {
        dispatch(addLesson(res.data.data));
      }
    } catch (error) {
      console.error(error);
      dispatch(setStatus(Status.Error));
    }
  };
}

export function deleteLesson(id: string) {
  return async function deleteLessonThunk(dispatch: AppDispatch) {
    try {
      const res = await api.delete(`lesson/${id}`);

      if (res.data.success) {
        dispatch(removeLesson(id));
      }
    } catch (error) {
      console.error(error);
      dispatch(setStatus(Status.Error));
    }
  };
}

// export function updateCourse(
//   id: string,
//   data: z.infer<typeof createCourseSchema>
// ) {
//   return async function updateCourseThunk(dispatch: AppDispatch) {
//     try {
//       const res = await api.put(`course/${id}`, data);

//       if (res.data.success) {
//         dispatch(editCourse(res.data.data));
//       }
//     } catch (error) {
//       console.error(error);
//       dispatch(setStatus(Status.Error));
//     }
//   };
// }
