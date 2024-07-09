import request from 'supertest';
import app from './app';
import path from 'path';

describe('API Endpoints', () => {
    it('should return 200 for the root endpoint', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Welcome to the Image Processing API');
    });

    it('should resize an image via /resize endpoint', async () => {
        const response = await request(app)
            .post('/resize')
            .attach('image', path.join(__dirname, 'assets', 'sample.jpg'))
            .field('width', '200')
            .field('height', '200');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('image/jpeg');
    });

    it('should return an error for missing image file in /resize endpoint', async () => {
        const response = await request(app)
            .post('/resize')
            .field('width', '200')
            .field('height', '200');

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Image file is required.');
    });

    it('should convert an image format via /convert endpoint', async () => {
        const response = await request(app)
            .post('/convert')
            .attach('image', path.join(__dirname, 'assets', 'sample.jpg'))
            .field('format', 'png');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('image/png');
    });

    it('should return an error for missing image file in /convert endpoint', async () => {
        const response = await request(app)
            .post('/convert')
            .field('format', 'png');

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Image file is required.');
    });
});
