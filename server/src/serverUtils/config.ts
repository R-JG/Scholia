import dotenv from 'dotenv';

dotenv.config();


export const PORT: string = process.env.PORT || '';

export const DATABASE_URI: string = process.env.DATABASE_URI || '';

export const DATABASE_PORT: number = Number(process.env.DATABASE_PORT) || 5432;

export const DATABASE_NAME: string = process.env.DATABASE_NAME || '';

export const DATABASE_USER: string = process.env.DATABASE_USER || '';

export const DATABASE_PASSWORD: string = process.env.DATABASE_PASSWORD || '';

export const DATABASE_HOST: string = process.env.DATABASE_HOST || '';


export const JWT_SECRET: string = process.env.JWT_SECRET || '';


export const DOCUMENT_DIR_FILE_PATH: string = process.env.DOCUMENT_DIR_FILE_PATH || '';

export const PDF_WORKER_FILE_PATH: string = process.env.PDF_WORKER_FILE_PATH || '';