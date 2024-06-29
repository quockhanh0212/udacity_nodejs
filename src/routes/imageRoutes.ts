import express from 'express';
import multer from 'multer';
import { resizeImageController } from '../controllers/imageController';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/resize', upload.single('image'), resizeImageController);

export default router;
