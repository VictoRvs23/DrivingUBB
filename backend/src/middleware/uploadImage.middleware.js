import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/upload/");
  },
  filename: function (req, file, cb) {
    const fileName = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, fileName);
  }
});

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes (jpg, jpeg, png, etc.)"), false);
  }
};

export const uploadImage = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: imageFilter
});

export const handleImageSizeLimit = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: "El tamaño de la imagen excede el límite permitido." });
    }
    return res.status(400).json({ 
      message: `Error al subir archivo: ${err.message}. Verifica que el nombre de la variable (Key) sea el correcto.` 
    });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};