import logger from '../config/logger.config';
import { NextFunction, Response } from 'express';
import createHttpError from 'http-errors';
import { searchUsers as searchUsersService } from '../services';

export const searchUsers = async (req: any, res: Response, next: NextFunction) => {
  try {
    const keyword: any = req.query.search;
    if (!keyword) {
      logger.error('please add search query');
      throw createHttpError.BadRequest('Oops...smt went wrong!');
    }
    const users = await searchUsersService(keyword, req?.user?.userId);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
