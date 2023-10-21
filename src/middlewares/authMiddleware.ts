import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';

export default async function (req: Request | any, res: Response, next: NextFunction) {
  if (!req.headers['authorization']) return next(createHttpError.Unauthorized());
  const bearerToken = req.headers['authorization'];
  const token = bearerToken.split(' ')[1];
  const secret: string | any = process.env.ACCESS_TOKEN_SECRET;
  jwt.verify(token, secret, (err: any, payload: any) => {
    if (err) {
      return next(createHttpError.Unauthorized());
    }
    req.user = payload;
    next();
  });
}
