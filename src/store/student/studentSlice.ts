import { createSlice } from "@reduxjs/toolkit";

import { Status } from "../types";
import { AppDispatch } from "../store";
import api from "@/config/api";
import { IInitialState } from "./types";

const datas: IInitialState = {
  Students: [],
  status: Status.Loading,
  MyCourses: [],
  Lessons: [],
  ActiveLesson: null,
};

const studentSlice = createSlice({
  name: "student",
  initialState: datas,
  reducers: {
    setStatus(state, action) {
      state.status = action.payload;
    },
    setStudents(state, action) {
      state.Students = action.payload;
    },
    setMyCourses(state, action) {
      state.MyCourses = action.payload;
    },
    setLessons(state, action) {
      state.Lessons = action.payload;
    },
    setLesson(state, action) {
      const lesson = state.Lessons.find(
        (lesson) => lesson._id === action.payload
      );

      state.ActiveLesson = lesson || null;
    },

    // removeLesson(state, action) {
    //   const index = state.Students.findIndex(
    //     (lesson) => lesson._id == action.payload
    //   );
    //   if (index !== -1) {
    //     state.Students.splice(index, 1);
    //   }
    // },
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

export const { setStudents, setStatus, setMyCourses, setLessons, setLesson } =
  studentSlice.actions;
export default studentSlice.reducer;

export function fetchStudents() {
  return async function fetchStudentsThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.Loading));

    try {
      const res = await api.get(`students`);

      if (res.data.success) {
        dispatch(setStudents(res.data.data));
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

export function fetchMyCourses() {
  return async function fetchMyCoursesThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.Loading));

    try {
      const res = await api.get(`students/my-course`);

      if (res.data.success) {
        dispatch(setMyCourses(res.data.data));
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

export function fetchMyLessons(id: string) {
  return async function fetchMyLessonsThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.Loading));

    try {
      const res = await api.get(`students/lessons?courseId=${id}`);

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

export function fetchMyLesson(id: string) {
  return async function fetchMyLessonThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.Loading));

    try {
      dispatch(setLesson(id));
      dispatch(setStatus(Status.Success));
    } catch (error) {
      console.error(error);
      dispatch(setStatus(Status.Error));
    }
  };
}

// export function createLesson(data: z.infer<typeof lessonCreateSchema>) {
//   return async function createLessonThunk(dispatch: AppDispatch) {
//     try {
//       const res = await api.post("lesson", data);

//       if (res.data.success) {
//         dispatch(addLesson(res.data.data));
//       }
//     } catch (error) {
//       console.error(error);
//       dispatch(setStatus(Status.Error));
//     }
//   };
// }

// export function deleteLesson(id: string) {
//   return async function deleteLessonThunk(dispatch: AppDispatch) {
//     try {
//       const res = await api.delete(`lesson/${id}`);

//       if (res.data.success) {
//         dispatch(removeLesson(id));
//       }
//     } catch (error) {
//       console.error(error);
//       dispatch(setStatus(Status.Error));
//     }
//   };
// }

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
