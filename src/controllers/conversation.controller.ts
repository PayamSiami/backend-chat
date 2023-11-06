import createHttpError from 'http-errors';
import logger from '../config/logger.config';
import { NextFunction, Request, Response } from 'express';
import {
  createConversation,
  doesConversationExist,
  findUser,
  populatedConversation,
  getUserConversations
} from '../services';

export const createOpenConversation = async (req: Request | any, res: Response, next: NextFunction) => {
  try {
    const sender_id = req?.user?.userId;
    const { receiver_id } = req?.body;

    // check if receiver_id exist
    if (!receiver_id) {
      logger.error('please provide receiver_id');
      throw createHttpError.BadGateway('smt went wrong');
    }

    // check if exist
    const existed_conversation = await doesConversationExist(sender_id, receiver_id);
    if (existed_conversation) {
      res.json(existed_conversation);
    } else {
      // const receiver_user = await findUser(receiver_id);
      const conData = {
        name: 'conversation name',
        picture: 'conversation picture',
        is_group: false,
        users: [sender_id, receiver_id]
      };
      const newCon = await createConversation(conData);
      const populatedCon = await populatedConversation(newCon._id, 'users', '-password');
      res.status(200).json(populatedCon);
    }
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (req: Request | any, res: Response, next: NextFunction) => {
  try {
    const user_id = req?.user?.userId;
    const get_conversations = await getUserConversations(user_id);

    res.status(200).json(get_conversations);
  } catch (error) {
    logger.error(error);
  }
};
