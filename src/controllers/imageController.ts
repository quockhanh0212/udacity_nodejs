import { Request, Response } from 'express';
import path from 'path';
import { resizeImage, ensureDirectoryExists, ResizeOptions } from '../utils/imageUtils';

const uploadPath = path.join(__dirname, '../../uploads');

export const resizeImageController = async (req: Request, res: Response) => {
  const { width, height } = req.query;
  const file = req.file;

  if (!file) {
    return res.status(400).send('No file uploaded');
  }

  if (!width || !height) {
    return res.status(400).send('Width and height are required');
  }

  const resizedImagePath = path.join(uploadPath, `resized-${file.filename}`);
  const options: ResizeOptions = {
    width: parseInt(width as string, 10),
    height: parseInt(height as string, 10),
  };

  ensureDirectoryExists(uploadPath);

  try {
    await resizeImage(file.path, resizedImagePath, options);
    res.sendFile(resizedImagePath);
  } catch (error: any) {
    res.status(500).send(`Error resizing image: ${error.message}`);
  }
};
