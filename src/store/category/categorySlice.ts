import { createSlice } from "@reduxjs/toolkit";
import { ICategoryInitialState } from "./types";
import { Status } from "../types";
import { AppDispatch } from "../store";
import api from "@/config/api";
import z from "zod";
import { categoryCreateSchema } from "@/schemas/categorySchema";

const datas: ICategoryInitialState = {
  Categories: [],
  status: Status.Loading,
};

const categorySlice = createSlice({
  name: "category",
  initialState: datas,
  reducers: {
    setStatus(state, action) {
      state.status = action.payload;
    },
    setCategories(state, action) {
      state.Categories = action.payload;
    },
    addCategory(state, action) {
      state.Categories.push(action.payload);
    },
    removeCategory(state, action) {
      const index = state.Categories.findIndex(
        (category) => category._id == action.payload
      );
      if (index !== -1) {
        state.Categories.splice(index, 1);
      }
    },
    editCategory(state, action) {
      const updatedCategory = action.payload;
      const index = state.Categories.findIndex(
        (category) => category._id === updatedCategory._id
      );

      if (index !== -1) {
        state.Categories[index] = updatedCategory;
      }
    },
  },
});

export const {
  setCategories,
  setStatus,
  addCategory,
  removeCategory,
  editCategory,
} = categorySlice.actions;
export default categorySlice.reducer;

export function fetchCategory() {
  return async function fetchCategoriesThunk(dispatch: AppDispatch) {
    try {
      const res = await api.get("category");

      if (res.data.success) {
        dispatch(setStatus(Status.Loading));
        dispatch(setCategories(res.data.data));
      } else {
        dispatch(setStatus(Status.Error));
      }
    } catch (error) {
      console.log(error);
      dispatch(setStatus(Status.Error));
    }
  };
}

export function createCategory(data: z.infer<typeof categoryCreateSchema>) {
  return async function createCategoryThunk(dispatch: AppDispatch) {
    try {
      const res = await api.post("category", data);

      if (res.data.success) {
        dispatch(addCategory(res.data.data));
      }
    } catch (error) {
      console.error(error);
      dispatch(setStatus(Status.Error));
    }
  };
}

export function deleteCategory(id: string) {
  return async function deleteCategoryThunk(dispatch: AppDispatch) {
    try {
      const res = await api.delete(`category/${id}`);

      if (res.data.success) {
        dispatch(removeCategory(id));
      }
    } catch (error) {
      console.error(error);
      dispatch(setStatus(Status.Error));
    }
  };
}

export function updateCategory(
  id: string,
  data: z.infer<typeof categoryCreateSchema>
) {
  return async function updateCategoryThunk(dispatch: AppDispatch) {
    try {
      const res = await api.put(`category/${id}`, data);

      if (res.data.success) {
        dispatch(editCategory(res.data.data));
      }
    } catch (error) {
      console.error(error);
      dispatch(setStatus(Status.Error));
    }
  };
}
