import express, { Application } from 'express';
import { resizeImageByFilename } from '../controllers/imageController';
import fs from 'fs';
import path from 'path';
import http from 'http';

const app: Application = express();
const uploadPath = path.join(__dirname, '../../uploads');

// Create a route for testing
app.get('/resize', resizeImageByFilename);

// Ensure the upload path exists for testing
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Copy a test image to the upload path before running tests
const testImagePath = path.join(uploadPath, 'vertexvista.png');
beforeAll(() => {
  fs.copyFileSync(path.join(__dirname, 'image.png'), testImagePath);
});

// Clean up resized images after tests
afterAll(() => {
  const resizedImagePath = path.join(uploadPath, 'resized-vertexvista.png');
  if (fs.existsSync(resizedImagePath)) {
    fs.unlinkSync(resizedImagePath);
  }
});

const sendRequest = (options: http.RequestOptions, callback: (res: http.IncomingMessage) => void) => {
  const req = http.request(options, callback);
  req.end();
};

describe('GET /resize', () => {
  let server: http.Server;

  beforeAll((done) => {
    server = app.listen(3000, () => done());
  });

  afterAll((done) => {
    server.close(() => done());
  });

  it('should resize the image with given width and height', (done) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/resize?filename=vertexvista.png&width=100&height=100',
      method: 'GET',
    };

    sendRequest(options, (res) => {
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toBe('image/png');

      const resizedImagePath = path.join(uploadPath, 'resized-vertexvista.png');
      res.on('end', () => {
        expect(fs.existsSync(resizedImagePath)).toBe(true);
        done();
      });
    });
  });

  it('should return 400 if filename is not provided', (done) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/resize?width=100&height=100',
      method: 'GET',
    };

    sendRequest(options, (res) => {
      expect(res.statusCode).toBe(400);
      res.setEncoding('utf8');
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        expect(data).toBe('Filename is required');
        done();
      });
    });
  });

  it('should return 400 if width or height is not provided', (done) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/resize?filename=vertexvista.png&width=100',
      method: 'GET',
    };

    sendRequest(options, (res) => {
      expect(res.statusCode).toBe(400);
      res.setEncoding('utf8');
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        expect(data).toBe('Width and height are required');
        done();
      });
    });
  });

  it('should return 500 if the image cannot be resized', (done) => {
    // Rename the test image to simulate a missing file
    fs.renameSync(testImagePath, testImagePath + '.bak');

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/resize?filename=vertexvista.png&width=100&height=100',
      method: 'GET',
    };

    sendRequest(options, (res) => {
      expect(res.statusCode).toBe(500);
      res.setEncoding('utf8');
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        expect(data).toContain('Error resizing image');
        // Restore the test image
        fs.renameSync(testImagePath + '.bak', testImagePath);
        done();
      });
    });
  });
});
