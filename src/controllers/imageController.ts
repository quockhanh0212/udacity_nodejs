import { Request, Response } from 'express';
import sharp from 'sharp';
import path from 'path';
import { ensureDirectoryExists, ResizeOptions } from '../utils/imageUtils';

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
    await sharp(file.path)
      .resize(options.width, options.height)
      .toFile(resizedImagePath);

    res.sendFile(resizedImagePath);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(`Error resizing image: ${error.message}`);
    } else {
      res.status(500).send('Unknown error occurred');
    }
  }
};

export const resizeImageBase64 = async (req: Request, res: Response) => {
  const { width, height, image } = req.query;

  if (!image || typeof image !== 'string') {
    return res.status(400).send('Image data is required');
  }

  if (!width || !height) {
    return res.status(400).send('Width and height are required');
  }

  const buffer = Buffer.from(image, 'base64');
  const resizedImagePath = path.join(uploadPath, `resized-image.png`);
  const options: ResizeOptions = {
    width: parseInt(width as string, 10),
    height: parseInt(height as string, 10),
  };

  ensureDirectoryExists(uploadPath);

  try {
    await sharp(buffer)
      .resize(options.width, options.height)
      .toFile(resizedImagePath);

    res.sendFile(resizedImagePath);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(`Error resizing image: ${error.message}`);
    } else {
      res.status(500).send('Unknown error occurred');
    }
  }
};

export const resizeImageByFilename = async (req: Request, res: Response) => {
  const { filename, width, height } = req.query;

  if (!filename || typeof filename !== 'string') {
    return res.status(400).send('Filename is required');
  }

  if (!width || !height) {
    return res.status(400).send('Width and height are required');
  }

  const inputPath = path.join(uploadPath, filename);
  const resizedImagePath = path.join(uploadPath, `resized-${filename}`);
  const options: ResizeOptions = {
    width: parseInt(width as string, 10),
    height: parseInt(height as string, 10),
  };

  ensureDirectoryExists(uploadPath);

  try {
    await sharp(inputPath)
      .resize(options.width, options.height)
      .toFile(resizedImagePath);

    res.sendFile(resizedImagePath);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(`Error resizing image: ${error.message}`);
    } else {
      res.status(500).send('Unknown error occurred');
    }
  }
};
