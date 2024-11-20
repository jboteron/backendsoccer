const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const reservaController = require('../controllers/reservaController'); // Asegúrate de que el nombre del archivo sea correcto

const router = express.Router();

// Definir la ruta para obtener clientes
router.get('/getClientes', reservaController.getClientes);

// Definir la ruta para obtener canchas
router.get('/getCanchas', reservaController.getCanchas);

// Obtener todas las reservas
router.get('/makeReserva', async (req, res) => {
    try {
        const [reservas] = await pool.query('SELECT * FROM reservas');
        res.status(200).json(reservas); // Respuesta exitosa con lista de reservas
    } catch (err) {
        console.error('Error al obtener reservas:', err); // Registro del error en consola
        res.status(500).json({ message: 'Error al obtener reservas', error: err.message });
    }
});

// Crear reserva
router.post('/makeReserva', [
    body('cancha_id').notEmpty().withMessage('El ID de la cancha es requerido'),
    body('fecha').notEmpty().withMessage('La fecha es requerida'),
    body('hora_inicio').notEmpty().withMessage('La hora de inicio es requerida'),
    body('hora_fin').notEmpty().withMessage('La hora de fin es requerida'),
    body('nombre_cliente').notEmpty().withMessage('El nombre del cliente es requerido'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Devolver errores de validación
    }

    const { cancha_id, fecha, hora_inicio, hora_fin, nombre_cliente } = req.body;

    // Reserva a insertar
    const reserva = { cancha_id, fecha, hora_inicio, hora_fin, nombre_cliente };

    try {
        // Verificar disponibilidad antes de insertar
        const [existingReserva] = await pool.query(
            'SELECT * FROM reservas WHERE cancha_id = ? AND fecha = ? AND hora_inicio < ? AND hora_fin > ?',
            [cancha_id, fecha, hora_fin, hora_inicio]
        );

        // Si ya existe una reserva en el horario solicitado, devolver un error 409 (conflicto)
        if (existingReserva.length > 0) {
            return res.status(409).json({ message: 'La cancha ya está reservada en ese horario' });
        }

        // Insertar la nueva reserva
        const [results] = await pool.query('INSERT INTO reservas SET ?', reserva);
        res.status(201).json({ id: results.insertId, ...reserva }); // Respuesta exitosa con la nueva reserva
    } catch (err) {
        console.error('Error al reservar la cancha:', err); // Registro del error en consola
        res.status(500).json({ message: 'Error al reservar la cancha', error: err.message });
    }
});

module.exports = router;
