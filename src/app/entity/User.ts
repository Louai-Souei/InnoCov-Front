import {Occupation} from "./enums/Occupation";
import {Role} from "./enums/Role";

export class User {
  id!: number;
  firstname!: string;
  lastname!: string;
  phone!: string;
  email!: string;
  role!: Role;
  occupation!: Occupation;
  userImage!: any;
}
