import fs from 'fs';
import path from 'path';
import { resizeImage, convertFormat } from './imageTransforms';

// Helper function to clean up test files
const cleanupTestFiles = (filePaths: string[]) => {
    filePaths.forEach((filePath) => {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    });
};

describe('Image Processing Functions', () => {
    const inputPath = path.join(__dirname, 'assets', 'sample.jpg');
    const resizedOutputPath = path.join(__dirname, 'assets', 'resized-sample.jpg');
    const convertedOutputPath = path.join(__dirname, 'assets', 'converted-sample.png');

    afterAll(() => {
        cleanupTestFiles([resizedOutputPath, convertedOutputPath]);
    });

    describe('resizeImage', () => {
        it('should resize an image to the specified dimensions', async () => {
            const width = 200;
            const height = 200;

            await resizeImage(inputPath, resizedOutputPath, width, height);

            const resizedImage = fs.readFileSync(resizedOutputPath);
            expect(resizedImage).toBeDefined();
        });

        it('should throw an error if the input image does not exist', async () => {
            const invalidInputPath = path.join(__dirname, 'assets', 'non-existent.jpg');
            const width = 200;
            const height = 200;

            await expect(resizeImage(invalidInputPath, resizedOutputPath, width, height)).rejects.toThrow();
        });
    });

    describe('convertFormat', () => {
        it('should convert an image to the specified format', async () => {
            const format = 'png';

            await convertFormat(inputPath, convertedOutputPath, format);

            const convertedImage = fs.readFileSync(convertedOutputPath);
            expect(convertedImage).toBeDefined();
        });

        it('should throw an error if the input image does not exist', async () => {
            const invalidInputPath = path.join(__dirname, 'assets', 'non-existent.jpg');
            const format = 'png';

            await expect(convertFormat(invalidInputPath, convertedOutputPath, format)).rejects.toThrow();
        });
    });
});
