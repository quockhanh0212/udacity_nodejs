import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export interface ResizeOptions {
  width: number;
  height: number;
}

export const resizeImage = async (
  inputPath: string,
  outputPath: string,
  options: ResizeOptions
): Promise<void> => {
  try {
    await sharp(inputPath)
      .resize(options.width, options.height)
      .toFile(outputPath);
  } catch (error: unknown) {
    throw new Error(`Error resizing image: ${(error as Error).message}`);
  }
};

export const ensureDirectoryExists = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};
