import logger from '../config/logger.config';
import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { searchUsers as searchUsersService } from '../services';

export const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const keyword: any = req.query.search;
    if (!keyword) {
      logger.error('please add search query');
      throw createHttpError.BadRequest('Oops...smt went wrong!');
    }
    const users = await searchUsersService(keyword);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
