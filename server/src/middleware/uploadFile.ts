import multer from 'multer';
import { DOCUMENT_FILE_PATH } from '../serverUtils/config';

const storage = multer.diskStorage({
    destination: (_request, _file, cb) => cb(null, DOCUMENT_FILE_PATH),
    filename: (_request, file, cb) => cb(null, file.originalname)
});

const upload = multer({ storage });

export default upload;