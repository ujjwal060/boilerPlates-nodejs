import { Document } from 'mongoose';

export interface IUser {
    _id?: string;
    username: string;
    email: string;
    password: string;
    role?: 'user' | 'admin';
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {}
