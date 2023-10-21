import { Secret } from 'jsonwebtoken';
import { sign, verify } from '../utils';

export const generateToken = async (payload: any, expiresIn: any, secret: any) => {
  const token = await sign(payload, expiresIn, secret);
  return token;
};

export const verifyToken = async (token: string, secret: Secret | any) => {
  const check = await verify(token, secret);
  return check;
};
