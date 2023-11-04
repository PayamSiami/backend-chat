import createHttpError from 'http-errors';
import { ConversationModel, UserModel } from '../models';

export const doesConversationExist = async (senderId: string, receiverId: string) => {
  let cons = await ConversationModel.find({
    isGroup: false,
    $and: [{ users: { $elemMatch: { $eq: senderId } } }, { users: { $elemMatch: { $eq: receiverId } } }]
  })
    .populate('users', '-password')
    .populate('latestMessage');

  if (!cons) throw createHttpError.BadRequest('smt went wrong');

  // populate message model
  cons = await UserModel.populate(cons, {
    path: 'latestMessage.sender',
    select: 'name email picture status'
  });

  return cons[0];
};

export const createConversation = async (data: any) => {
  const newConv = await ConversationModel.create(data);
  if (!newConv) createHttpError.BadRequest('smt went wrong');
  return newConv;
};

export const populatedConversation = async (id: any, fieldToPopulate: string | string[], fieldsToRemove: any) => {
  const populatedConv = await ConversationModel.findOne({ _id: id }).populate(fieldToPopulate, fieldsToRemove);
  if (!populatedConv) createHttpError.BadRequest('smt went wrong');
  return populatedConv;
};

export const getUserConversations = async (user_id: string) => {
  let conversation;

  await ConversationModel.find({
    $and: [{ users: { $elemMatch: { $eq: user_id } } }]
  })
    .populate('users', '-password')
    .populate('admin', '-password')
    .populate('latestMessage')
    .sort({ updatedAt: -1 })
    .then(async (results) => {
      results = await UserModel.populate(results, {
        path: 'latestMessage.sender',
        select: 'name email picture status'
      });
      conversation = results;
    })
    .catch((err) => {
      throw createHttpError.BadRequest('smt went wrong');
    });

  if (!conversation) throw createHttpError.BadRequest('smt went wrong');
  return conversation;
};

export const updateLatestMessage = async (con_id: string, msg: string) => {
  const updatedConversation = await ConversationModel.findByIdAndUpdate(con_id, {
    latestMessage: msg
  });
  if (!updatedConversation) throw createHttpError.BadRequest('smt went wrong');
  return updatedConversation;
};
