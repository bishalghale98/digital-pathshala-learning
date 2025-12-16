import { Status } from "../types";

export interface ICategory {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface ICategoryInitialState {
  Categories: ICategory[];
  status: Status;
}
