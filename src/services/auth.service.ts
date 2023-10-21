import UserModel, { IUser } from '../models/userModel';
import validator from 'validator';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';

export const createUser = async (userData: IUser) => {
  const { name, email, picture, status, password } = userData;

  if (!name || !email || !password) {
    throw createHttpError.BadRequest('please fill values');
  }

  if (!validator.isLength(name, { min: 2, max: 16 })) {
    throw createHttpError.BadRequest('name is not correct');
  }

  // check email
  if (!validator.isEmail(email)) {
    throw createHttpError.BadRequest('email is not correct');
  }

  // check email exist
  const checkDb = await UserModel.findOne({ email });
  if (checkDb) {
    throw createHttpError.BadRequest('email is exist');
  }

  // check password
  if (!validator.isLength(password, { min: 6, max: 128 })) {
    throw createHttpError.BadRequest('password is not correct');
  }

  const user = await new UserModel({
    name,
    email,
    password,
    status,
    picture
  }).save();

  return user;
};

export const signUser = async (email: string, password: string | Buffer) => {
  const user: any = await UserModel.findOne({ email: email.toLowerCase() }).lean();

  // check if user exist
  if (!user) throw createHttpError.NotFound('Invalid credentials');

  // compare passwords
  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) throw createHttpError.NotFound('Invalid credentials');

  return user;
};
