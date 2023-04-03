import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from './config';

const hashSaltRounds: number = 10;

export const createPasswordHash = async (password: string): Promise<string> => bcrypt.hash(
    password, hashSaltRounds
);

export const comparePasswordHash = 
    (password: string, passwordHash: string): Promise<boolean> => bcrypt.compare(
        password, passwordHash
);

export const createToken = (payload: string | object): string => jwt.sign(
    payload, JWT_SECRET, { expiresIn: 60*60 }
);

export const verifyToken = (token: string): JwtPayload | string => jwt.verify(
    token, JWT_SECRET
);