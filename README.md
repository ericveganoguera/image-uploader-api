# Image Uploader API

REST API for [Image Uploader](https://github.com/ericveganoguera/image-uploader): it receives an image, stores it in MongoDB (GridFS) and returns a public link to share it.

Built with Node.js, Express, Multer and MongoDB GridFS.

## Endpoints

| Method | Route | Description |
|---|---|---|
| `POST` | `/upload` | Uploads one image in the `file` field (multipart/form-data). |
| `GET` | `/files/:name` | Returns the image with that name. |

### `POST /upload`

- Accepts **PNG or JPEG**, up to **2 MB**.
- Each image is saved with a unique random name, so two files with the same original name never overwrite each other.

| Response | When |
|---|---|
| `201` `{ message, filename, url }` | The image was uploaded. `url` is the public link. |
| `400` | No file was sent. |
| `413` | The image is larger than 2 MB. |
| `415` | The file is not a PNG or JPEG. |
| `500` | Unexpected server error. |

Type and size are checked on the server before anything is stored, not only in the browser.

## Run locally

```bash
git clone https://github.com/ericveganoguera/image-uploader-api
cd image-uploader-api
npm install
```

Create a `.env` file:

```
MONGODB_URI=mongodb://127.0.0.1:27017/
ORIGIN=http://localhost:3000
PORT=5005
```

- `MONGODB_URI`: MongoDB connection string (the `images` database is added automatically).
- `ORIGIN`: URL of the frontend allowed by CORS.

```bash
npm run dev
```

The API will be available at `http://localhost:5005`.
