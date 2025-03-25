export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  organization: {
    id: string
  }
  type: UserType;
}
export enum UserType {
  USER = 'user',
  SUPERVISOR = 'supervisor',
  EXAMER = "examer",
  ADMIN = 'admin',
}