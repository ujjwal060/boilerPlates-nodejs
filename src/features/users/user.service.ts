import User, { IUser, IUserDocument } from './user.model';

export async function createUser(payload: Pick<IUser, 'username' | 'email' | 'password'>): Promise<IUserDocument> {
  const user = new User(payload);
  await user.save();
  return user;
}

export async function findUserByEmail(email: string): Promise<IUserDocument | null> {
  return User.findOne({ email }).exec();
}

export async function verifyUserPassword(user: IUserDocument, password: string): Promise<boolean> {
  return user.comparePassword(password);
}

export function toSafeUser(user: IUserDocument) {
  return user.toSafeObject();
}

