const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento de multer en memoria (para almacenar como binario)
const storage = multer.memoryStorage();

// Inicializar multer con la configuración de almacenamiento
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limitar el tamaño del archivo (opcional)
  fileFilter: (req, file, cb) => {
    // Filtrar tipos de archivos permitidos (solo imágenes)
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('El archivo debe ser una imagen'));
    }
  }
});

module.exports = upload;
