import bcrypt from 'bcrypt';
import { Salt } from '../constents/userConstents';

export const Hashpassword = (Password: string): Promise<string> => {
  return bcrypt.hash(Password, Salt);
};

export const Passwordverification = (password: string, hashPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashPassword);
};
