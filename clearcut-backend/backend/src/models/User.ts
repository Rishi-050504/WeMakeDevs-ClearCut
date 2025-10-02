import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: 'user' | 'admin';
  apiUsage: {
    documentsAnalyzed: number;
    questionsAsked: number;
    lastReset: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    apiUsage: {
      documentsAnalyzed: { type: Number, default: 0 },
      questionsAsked: { type: Number, default: 0 },
      lastReset: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
  }
);
userSchema.index({ createdAt: -1 });

export const User = mongoose.model<IUser>('User', userSchema);