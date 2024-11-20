const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig'); // Asegúrate de que la ruta sea correcta

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).json({ auth: false, message: 'No se proporcionó un token' });
  }

  jwt.verify(token, jwtConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(500).json({ auth: false, message: 'Fallo al autenticar el token' });
    }
    
    // Guardar el id de usuario y rol para usarlo en la solicitud
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

module.exports = verifyToken;
