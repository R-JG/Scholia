import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { DOCUMENT_DIR_FILE_PATH } from '../serverUtils/config';

const storage = multer.diskStorage({
    destination: (_request, _file, cb) => cb(null, DOCUMENT_DIR_FILE_PATH),
    filename: (_request, file, cb) => cb(null, `${uuidv4()}_${file.originalname}`)
});

const upload = multer({ storage });

export default upload;