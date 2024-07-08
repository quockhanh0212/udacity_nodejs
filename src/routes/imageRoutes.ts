import express from 'express';
import multer from 'multer';
import { resizeImageController, resizeImageBase64, resizeImageByFilename } from '../controllers/imageController';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/resize', upload.single('image'), resizeImageController);
router.get('/resize-base64', resizeImageBase64);
router.get('/resize', resizeImageByFilename); // Ensure this line is present

export default router;
