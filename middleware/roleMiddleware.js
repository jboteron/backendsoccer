const jwt = require('jsonwebtoken');
const pool = require('../config/db');  // O el método que uses para interactuar con tu base de datos

const authorizeRole = (role) => {
    return async (req, res, next) => {
        try {
            // Obtener el token del encabezado Authorization
            const token = req.header('Authorization')?.replace('Bearer ', '');
            if (!token) return res.status(401).json({ error: 'No token provided' });

            // Verificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            // Comprobar el rol del usuario en la base de datos
            const [user] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [userId]);
            if (!user) return res.status(404).json({ error: 'User not found' });

            // Verificar que el usuario tiene el rol adecuado
            if (user.role !== role) {
                return res.status(403).json({ error: 'Access denied' });
            }

            // Si el rol es correcto, pasar al siguiente middleware o ruta
            req.user = user;
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
};

module.exports = authorizeRole;
