import { Schema, model } from 'mongoose';
import { IUser } from '../interfaces/user.interface';

const userSchema = new Schema(
  {
    fname: {
      type: String,
      required: true
    },
    lname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default model<IUser>('User', userSchema);
