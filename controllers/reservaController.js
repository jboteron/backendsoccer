const pool = require('../config/db');  // Conexión a la base de datos
const mysql = require('mysql2'); // Si no tienes esta dependencia, debes instalarla

// Función para convertir el BLOB de la imagen a base64
const convertBlobToBase64 = (blob) => {
    return blob.toString('base64');
};

// Obtener todos los clientes con su imagen
exports.getClientes = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM clientes');
        // Convertir las imágenes BLOB a base64 antes de enviar la respuesta
        const clientes = results.map(cliente => {
            if (cliente.imagen) {
                cliente.imagen = convertBlobToBase64(cliente.imagen);
            }
            return cliente;
        });

        res.status(200).json(clientes); // Enviar lista de clientes con imagen en base64
    } catch (err) {
        console.error('Error al obtener los clientes:', err); // Registro del error en consola
        res.status(500).json({ message: 'Error al obtener los clientes', error: err.message });
    }
};

// Obtener las canchas, filtradas opcionalmente por cliente_id
exports.getCanchas = async (req, res) => {
    const clienteId = req.query.cliente_id; // Obtener el cliente_id de los parámetros de consulta
    try {
        let query = 'SELECT * FROM canchas';
        const params = [];

        // Si se especifica un cliente_id, filtrar las canchas por cliente
        if (clienteId) {
            query += ' WHERE cliente_id = ?'; // Agregar la condición para filtrar por cliente_id
            params.push(clienteId);
        }

        const [results] = await pool.query(query, params);
        res.status(200).json(results); // Enviar la lista de canchas filtradas
    } catch (err) {
        console.error('Error al obtener las canchas:', err); // Registro del error en consola
        res.status(500).json({ message: 'Error al obtener las canchas', error: err.message });
    }
};

// Realizar una reserva
exports.makeReserva = async (req, res) => {
    const { cancha_id, fecha, hora_inicio, hora_fin, nombre_cliente } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!cancha_id || !fecha || !hora_inicio || !hora_fin || !nombre_cliente) {
        return res.status(400).json({ message: 'Todos los campos son requeridos para la reserva' });
    }

    try {
        // Verificar si la cancha ya está reservada en el horario especificado
        const [existingReserva] = await pool.query(
            'SELECT * FROM reservas WHERE cancha_id = ? AND fecha = ? AND hora_inicio < ? AND hora_fin > ?',
            [cancha_id, fecha, hora_fin, hora_inicio]
        );

        // Si ya existe una reserva en el horario solicitado, devolver un error 409 (conflicto)
        if (existingReserva.length > 0) {
            return res.status(409).json({ message: 'La cancha ya está reservada en ese horario' });
        }

        // Crear una nueva reserva si la cancha está disponible
        const reserva = { cancha_id, fecha, hora_inicio, hora_fin, nombre_cliente };
        const [results] = await pool.query('INSERT INTO reservas SET ?', reserva);

        // Enviar respuesta con el ID de la nueva reserva y los detalles
        res.status(201).json({ id: results.insertId, ...reserva });
    } catch (err) {
        console.error('Error al reservar la cancha:', err); // Registro del error en consola
        res.status(500).json({ message: 'Error al reservar la cancha', error: err.message });
    }
};
