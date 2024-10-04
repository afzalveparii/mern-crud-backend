import multer from 'multer';
import fs from 'fs';
import path from 'path';
// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// storage config
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadsDir);
  },
  filename: (req, file, callback) => {
    const filename = `image-${Date.now()}.${file.originalname}`;
    callback(null, filename);
  }
});

// filter 
const filefilter: multer.Options['fileFilter'] = (req, file, callback) => {
  // File size validation
  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB
  if (file.size > MAX_FILE_SIZE) {
    return callback(new Error("File size exceeds 1 MB limit"));
  }

  // MIME type validation
  switch (file.mimetype) {
    case "image/png":
    case "image/jpg":
    case "image/jpeg":
      callback(null, true);
      break;
    default:
      callback(null, false);
      return callback(new Error("Only .png, .jpg & .jpeg formats are allowed"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: filefilter
});

export default upload;