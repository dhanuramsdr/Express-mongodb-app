import { Request } from 'express';

export interface user {
  name: string;
  email: string;
  password: string;
  roles: string;
}

export interface userRequestLogin {
  email: string;
  password: string;
}

export interface userResponse {
  _id?: string;
  name: string;
  email: string;
  roles: string;
}

export interface Authrequest extends Request {
  user?: {
    userid: string;
    email: string;
    roles: string;
  };
}

// Error handlers
export interface errorInterface {
  message: string;
  statuscode: number;
}

export interface ErrorWithStatus extends Error {
  statusCode?: number;
}

export interface Product {
  name: string;
  quantity: number;
  url?: string[];
  categorey: string;
  sellerid: string;
}
