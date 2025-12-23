import { createSlice } from "@reduxjs/toolkit";
import { Status } from "../types";
import { AppDispatch } from "../store";
import api from "@/config/api";
import z from "zod";
import { IInitialState } from "./types";
import { enrollmentCreateSchema, enrollmentUpdateSchema } from "@/schemas/enrollmentSchema";

const datas: IInitialState = {
  Enrollments: [],
  status: Status.Loading,
};

const EnrollmentSlice = createSlice({
  name: "category",
  initialState: datas,
  reducers: {
    setStatus(state, action) {
      state.status = action.payload;
    },
    setEnrollments(state, action) {
      state.Enrollments = action.payload;
    },
    addEnrollment(state, action) {
      state.Enrollments.push(action.payload);
    },
    removeEnrollment(state, action) {
      const index = state.Enrollments.findIndex(
        (enrollment) => enrollment._id == action.payload
      );
      if (index !== -1) {
        state.Enrollments.splice(index, 1);
      }
    },
    editEnrollment(state, action) {
      const updatedEnrollment = action.payload;
      const index = state.Enrollments.findIndex(
        (enrollment) => enrollment._id === updatedEnrollment._id
      );

      if (index !== -1) {
        state.Enrollments[index] = updatedEnrollment;
      }
    },
  },
});

export const {
  setEnrollments,
  setStatus,
  addEnrollment,
  editEnrollment,
  removeEnrollment,
} = EnrollmentSlice.actions;
export default EnrollmentSlice.reducer;

export function fetchEnrollements() {
  return async function fetchEnrollmentsThunk(dispatch: AppDispatch) {
    try {
      const res = await api.get("enrollment");

      if (res.data.success) {
        dispatch(setStatus(Status.Loading));
        dispatch(setEnrollments(res.data.data));
      } else {
        dispatch(setStatus(Status.Error));
      }
    } catch (error) {
      console.log(error);
      dispatch(setStatus(Status.Error));
    }
  };
}

export function createEnrollment(data: z.infer<typeof enrollmentCreateSchema>) {
  return async function createEnrollmentThunk(dispatch: AppDispatch) {
    try {
      const res = await api.post("enrollment", data);

      if (res.data.success) {
        dispatch(addEnrollment(res.data.data));
      }
    } catch (error) {
      console.error(error);
      dispatch(setStatus(Status.Error));
    }
  };
}

export function deleteEnrollment(id: string) {
  return async function deleteEnrollmentThunk(dispatch: AppDispatch) {
    try {
      const res = await api.delete(`enrollment/${id}`);

      if (res.data.success) {
        dispatch(removeEnrollment(id));
      }
    } catch (error) {
      console.error(error);
      dispatch(setStatus(Status.Error));
    }
  };
}

export function updateEnrollment(
  id: string,
  data: z.infer<typeof enrollmentUpdateSchema>
) {
  return async function updateCategoryThunk(dispatch: AppDispatch) {
    try {
      const res = await api.put(`enrollment/${id}`, data);

      if (res.data.success) {
        dispatch(editEnrollment(res.data.data));
      }
    } catch (error) {
      console.error(error);
      dispatch(setStatus(Status.Error));
    }
  };
}
