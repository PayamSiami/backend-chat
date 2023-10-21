import mongoose, { Schema } from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;

// 1. Create an interface representing a document in MongoDB.
export interface IMessage {
  sender: typeof ObjectId;
  message: string;
  conversation: typeof ObjectId;
  files: [];
}

const messageSchema = new Schema<IMessage>(
  {
    sender: {
      type: ObjectId,
      ref: 'UserModel'
    },
    message: {
      type: String,
      trim: true
    },
    conversation: {
      type: ObjectId,
      ref: 'ConversationModel'
    },
    files: []
  },
  { collection: 'messages', timestamps: true }
);

const MessageModel = mongoose.models.MessageModel || mongoose.model('MessageModel', messageSchema);
export default MessageModel;
