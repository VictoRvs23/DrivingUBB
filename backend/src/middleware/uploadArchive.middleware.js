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

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); 
  } else {
    cb(new Error("Solo se permiten comprobantes en formato PDF o imágenes (.jpg, .jpeg, .png)"), false); 
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 8 * 1024 * 1024 
  },
  fileFilter: fileFilter
});

const handleFileSizeLimit = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: "El tamaño del archivo excede el límite de 8 MB" });
    }
    return res.status(400).json({ message: `Error en la carga: ${err.message}` });
  } else if (err) {
    res.status(400).json({ message: err.message });
  } else {
    next();
  }
};

export { upload, handleFileSizeLimit };