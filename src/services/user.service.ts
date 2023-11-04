import createHttpError from 'http-errors';
import { UserModel } from '../models';

export const findUser = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) throw createHttpError.BadRequest('expire jwt');
  return user;
};

export const searchUsers = async (keyword: string, userId: string) => {
  const users = await UserModel.find({
    $or: [
      {
        name: { $regex: keyword, $options: 'i' }
      },
      {
        email: { $regex: keyword, $options: 'i' }
      }
    ]
  }).find({
    _id: { $ne: userId }
  });
  return users;
};
