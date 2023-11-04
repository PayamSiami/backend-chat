import { NextFunction, Request, Response } from 'express';
import { createMessage, populateMessage, updateLatestMessage, getConMessages } from '../services';
import createHttpError from 'http-errors';

export const sendMessage = async (req: Request | any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const { message, con_id, files } = req.body;

    const msgData = {
      sender: userId,
      message,
      conversation: con_id,
      files: files || []
    };
    const newMessage = await createMessage(msgData);
    const populatedMessage = await populateMessage(newMessage._id);
    await updateLatestMessage(con_id, newMessage);
    res.status(200).json(populatedMessage);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conId = req.params.con_id;
    if (!conId) {
      throw createHttpError.BadRequest('please add conversation id');
    }
    const message = await getConMessages(conId);
    res.json(message);
  } catch (error) {
    next(error);
  }
};
