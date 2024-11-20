// backend/middleware/verifyToken.js

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No se proporcionó el token' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token no válido' });
        }

        req.userId = decoded.id; // Suponiendo que el id del usuario está en el payload
        next();
    });
};


