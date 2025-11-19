import multer from "multer";

const storage = multer.diskStorage({
  filename: (_req, file, callback) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    callback(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, callback) => {
    // Allowed mimetypes
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      return callback(
        new Error("Only JPG, JPEG, PNG, and WEBP image formats are allowed") as unknown as null,
        false
      );
    }

    callback(null, true);
  },
});

export default upload;
