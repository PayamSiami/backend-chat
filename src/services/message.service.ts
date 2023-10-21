import MessageModel, { IMessage } from '../models/messageModel';
import createHttpError from 'http-errors';
import logger from '../config/logger.config';

export const createMessage = async (messageData: IMessage) => {
  const { sender, message, conversation, files } = messageData;

  if (!message || (!conversation && !files)) {
    logger.error('please provide conversation id message files');
    throw createHttpError.BadRequest('smt went wrong');
  }

  const data = {
    sender,
    message,
    conversation,
    files
  };

  const newMessage = await MessageModel.create(data);
  if (!newMessage) throw createHttpError.BadRequest('smt went wrong');

  return newMessage;
};

export const populateMessage = async (messageId: string) => {
  const msg = await MessageModel.findById(messageId)
    .populate({
      path: 'sender',
      select: 'name picture',
      model: 'UserModel'
    })
    .populate({
      path: 'conversation',
      select: 'name isGroup users',
      model: 'ConversationModel',
      populate: {
        path: 'users',
        select: 'name email picture status',
        model: 'UserModel'
      }
    });
  if (!msg) throw createHttpError.BadRequest('smt went wrong');
  return msg;
};

export const getConMessages = async (conId: string) => {
  const messages = await MessageModel.find({ conversation: conId })
    .populate('sender', 'name picture email status')
    .populate('conversation')
    .sort({ updatedAt: -1 });

  if (!messages) throw createHttpError.BadRequest('smt went wrong');
  return messages;
};
