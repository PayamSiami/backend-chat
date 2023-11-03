import mongoose, { Schema } from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;

// 1. Create an interface representing a document in MongoDB.
export interface IConversation {
  name: string;
  isGroup: boolean;
  picture: string;
  users: typeof ObjectId;
  latestMessage: typeof ObjectId;
  admin: typeof ObjectId;
}

const conversationSchema = new Schema<IConversation>(
  {
    name: {
      type: String,
      require: [true, 'please enter conversation name'],
      trim: true
    },
    picture: {
      type: String,
      required: true
    },
    isGroup: {
      type: Boolean,
      require: [true, 'please enter your email'],
      default: false
    },
    users: [
      {
        type: ObjectId,
        ref: 'UserModel'
      }
    ],
    latestMessage: {
      type: ObjectId,
      ref: 'MessageModel'
    },
    admin: {
      type: ObjectId,
      ref: 'UserModel'
    }
  },
  { collection: 'conversations', timestamps: true }
);

const ConversationModel = mongoose.models.ConversationModel || mongoose.model('ConversationModel', conversationSchema);
export default ConversationModel;
