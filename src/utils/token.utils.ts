import logger from '../config/logger.config';
import jwt from 'jsonwebtoken';

export const sign = async (payload: string | object | Buffer, expiresIn: any, secret: jwt.Secret) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      secret,
      {
        expiresIn: expiresIn
      },
      (error, token) => {
        if (error) {
          logger.error(error);
          reject(error);
        } else {
          resolve(token);
        }
      }
    );
  });
};

export const verify = async (token: string, secret: jwt.Secret | jwt.GetPublicKeyOrSecret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error: any, payload: unknown) => {
      if (error) {
        logger.error(error);
        reject(null);
      } else {
        resolve(payload);
      }
    });
  });
};
