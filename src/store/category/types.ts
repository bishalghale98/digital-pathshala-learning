import { Status } from "../types";

export interface ICategories {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface ICategoryInitialState {
  Categories: ICategories[];
  status: Status;
}
