import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  username: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends Document {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  toSafeObject(): Omit<IUser, 'password'> & { _id: string };
}

export interface IUserModel extends Model<IUserDocument> {}

const UserSchema: Schema<IUserDocument> = new mongoose.Schema<IUserDocument>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.toSafeObject = function () {
  const { _id, username, email, role, createdAt, updatedAt } = this.toObject();
  return { _id: _id.toString(), username, email, role, createdAt, updatedAt };
};

const User: IUserModel = mongoose.models.User || mongoose.model<IUserDocument, IUserModel>('User', UserSchema);

export default User;

