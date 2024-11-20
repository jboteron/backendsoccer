// Dashboard del administrador
const pool = require('../../config/db');

// Obtener estadísticas generales para el dashboard
exports.getDashboardData = async (req, res) => {
    try {
        // Obtener el número total de canchas
        const [canchaCount] = await pool.query('SELECT COUNT(*) AS total FROM canchas');

        // Obtener el número total de clientes
        const [clienteCount] = await pool.query('SELECT COUNT(*) AS total FROM clientes');

        // Obtener el número total de reservas
        const [reservaCount] = await pool.query('SELECT COUNT(*) AS total FROM reservas');

        // Obtener el número total de preguntas
        const [preguntaCount] = await pool.query('SELECT COUNT(*) AS total FROM preguntas');

        // Obtener el número total de usuarios
        const [usuariosCount] = await pool.query('SELECT COUNT(*) AS total FROM usuarios');

        // Preparar los datos para el dashboard
        const dashboardData = {
            totalUsuarios: usuariosCount[0].total,
            totalCanchas: canchaCount[0].total,
            totalClientes: clienteCount[0].total,
            totalReservas: reservaCount[0].total,
            totalPreguntas: preguntaCount[0].total,
        };

        res.status(200).json(dashboardData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los datos del dashboard' });
    }
};

// Obtener detalles de las canchas más reservadas
exports.getTopCanchasReservadas = async (req, res) => {
    try {
        const [topCanchas] = await pool.query(
            `SELECT canchas.nombre, COUNT(reservas.id) AS reservasCount
             FROM canchas
             LEFT JOIN reservas ON canchas.id = reservas.cancha_id
             GROUP BY canchas.id
             ORDER BY reservasCount DESC
             LIMIT 5`
        );
        res.status(200).json(topCanchas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las canchas más reservadas' });
    }
};

// Obtener detalles de los clientes más activos
exports.getTopClientesActivos = async (req, res) => {
    try {
        const [topClientes] = await pool.query(
            `SELECT clientes.nombre, COUNT(reservas.id) AS reservasCount
             FROM clientes
             LEFT JOIN reservas ON clientes.id = reservas.nombre_cliente
             GROUP BY clientes.id
             ORDER BY reservasCount DESC
             LIMIT 5`
        );
        res.status(200).json(topClientes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los clientes más activos' });
    }
};
