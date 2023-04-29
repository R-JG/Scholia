import dotenv from 'dotenv';

dotenv.config();


export const PORT: string = process.env.PORT || '';

export const POSTGRES_PORT: number = 5432;

export const POSTGRES_DATABASE: string = process.env.POSTGRES_DATABASE || '';

export const POSTGRES_USER: string = process.env.POSTGRES_USER || '';

export const POSTGRES_PASSWORD: string = process.env.POSTGRES_PASSWORD || '';

export const POSTGRES_HOST: string = process.env.POSTGRES_HOST || '';

export const JWT_SECRET: string = process.env.JWT_SECRET || '';


export const DOCUMENT_DIR_FILE_PATH: string = process.env.DOCUMENT_DIR_FILE_PATH || '';

export const PDF_WORKER_FILE_PATH: string = process.env.PDF_WORKER_FILE_PATH || '';