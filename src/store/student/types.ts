import { Status } from "../types";

export interface IStudent {
  _id: string;
  name: string;
  email: string
  image: string
}

export interface IInitialState {
  Students: IStudent[];
  status: Status;
}
