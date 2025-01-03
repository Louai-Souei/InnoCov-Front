export class RegisterRequest {
  firstname!: string;
  lastname!: string;
  phone!: string;
  email!: string;
  password!: string;
  role!: string;
  occupation!: string;
  userImage!: File | null;
}
