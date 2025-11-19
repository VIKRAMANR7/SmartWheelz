export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: "owner" | "user";
  image: string;
}
