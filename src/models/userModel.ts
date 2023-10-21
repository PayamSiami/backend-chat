import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

// 1. Create an interface representing a document in MongoDB.
export interface IUser {
  name: string;
  email: string;
  picture?: string;
  status?: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      require: [true, 'please enter your name']
    },
    email: {
      type: String,
      trim: true,
      require: [true, 'please enter your email'],
      unique: true,
      validator: [validator.isEmail, 'please enter valid email'],
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    picture: {
      type: String
    },
    status: {
      type: String,
      default: 'i am using this app'
    },
    password: {
      type: String,
      require: [true, 'please enter your email'],
      minlength: [6, 'password at least 6 character'],
      maxlength: [128, 'password is less than 128 character']
    }
  },
  { collection: 'users', timestamps: true }
);

userSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    }
    next();
  } catch (error: any) {
    next(error);
  }
});

const UserModel = mongoose.models.UserModel || mongoose.model('UserModel', userSchema);
export default UserModel;
