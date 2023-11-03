import { NextFunction, Request, Response } from 'express';
import { createUser, findUser, generateToken, signUser, verifyToken } from '../services';
import createHttpError from 'http-errors';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, picture, status, password } = req.body;
    const newUser = await createUser({
      name,
      email,
      picture,
      status,
      password
    });
    const access_token = await generateToken({ userId: newUser._id }, '1d', process.env.ACCESS_TOKEN_SECRET);
    const refresh_token = await generateToken({ userId: newUser._id }, '30d', process.env.REFRESH_TOKEN_SECRET);

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      path: '/api/v1/auth/refresh-token',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30day
    });

    res.json({
      message: 'register success.',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        picture: newUser.picture,
        status: newUser.status,
        token: access_token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await signUser(email, password);

    const access_token = await generateToken({ userId: user._id }, '1d', process.env.ACCESS_TOKEN_SECRET);
    const refresh_token = await generateToken({ userId: user._id }, '30d', process.env.REFRESH_TOKEN_SECRET);

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      path: '/api/v1/auth/refresh-token',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30day
    });

    res.json({
      message: 'login success.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        status: user.status,
        token: access_token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('refresh_token', {
      path: '/api/v1/auth/refresh-token'
    });
    res.json({
      message: 'logged out!'
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refresh_token = req.cookies.refresh_token;
    console.table(refresh_token);
    if (!refresh_token) throw createHttpError.Unauthorized();

    const check: any = await verifyToken(refresh_token, process.env.REFRESH_TOKEN_SECRET);
    const user = await findUser(check.userId);
    const access_token = await generateToken({ userId: user._id }, '1d', process.env.ACCESS_TOKEN_SECRET);
    res.json({
      message: 'refresh token success.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        status: user.status,
        token: access_token
      }
    });
  } catch (error) {
    next(error);
  }
};
