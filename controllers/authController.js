const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const pool = require('../config/db');
const jwtConfig = require('../config/jwtConfig');

// Función para registrar un nuevo usuario
exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, correo, password } = req.body;

    try {
        const [existingUser] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        if (existingUser.length > 0) {
            return res.status(409).json({ message: 'El correo ya está registrado' });
        }

        const hashedPassword = bcrypt.hashSync(password, 8);
        const [result] = await pool.query('INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)', [nombre, correo, hashedPassword]);

        const token = jwt.sign({ id: result.insertId }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });

        res.status(201).json({ auth: true, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error en el servidor', error: 'No se pudo registrar el usuario' });
    }
};

// Función para iniciar sesión
exports.login = async (req, res) => {
    // Validar errores en la solicitud
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { correo, password } = req.body;

    try {
        // Buscar usuario en la base de datos
        const [results] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = results[0];
        
        // Verificar contraseña
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ auth: false, token: null, message: 'Contraseña incorrecta' });
        }

        // Incluir el rol en el payload del token
        const token = jwt.sign(
            { id: user.id, role: user.role }, // Aquí incluimos el rol del usuario
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn }
        );

        // Enviar el token y el rol como respuesta
        res.status(200).json({ auth: true, token, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error en el servidor', error: 'No se pudo iniciar sesión' });
    }
};

// Función para obtener la información del usuario
exports.user = async (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'No se proporcionó token.' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), jwtConfig.secret);
        const usuarioId = decoded.id;

        const [user] = await pool.query('SELECT nombre, correo FROM usuarios WHERE id = ?', [usuarioId]);

        if (user.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.status(200).json(user[0]);
    } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Token inválido.' });
        }
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

// Función para logout
exports.logout = (req, res) => {
    // Normalmente el logout se maneja eliminando el token del frontend
    res.status(200).json({ auth: false, token: null, message: 'Logout exitoso' });
};
