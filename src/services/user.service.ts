import createHttpError from 'http-errors';
import { UserModel } from '../models';

export const findUser = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) throw createHttpError.BadRequest('expire jwt');
  return user;
};
