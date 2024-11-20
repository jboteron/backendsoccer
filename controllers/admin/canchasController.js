const pool = require('../../config/db');

// Crear cancha
exports.createCancha = async (req, res) => {
    const { nombre, direccion, cliente_id, disponibilidad } = req.body;

    // Verificar si el cliente existe
    try {
        const [cliente] = await pool.query('SELECT id FROM clientes WHERE id = ?', [cliente_id]);
        
        if (cliente.length === 0) {
            return res.status(400).json({ error: 'Cliente no encontrado' });
        }

        // Crear la cancha si el cliente existe
        const [result] = await pool.query(
            'INSERT INTO canchas (nombre, direccion, cliente_id, disponibilidad) VALUES (?, ?, ?, ?)',
            [nombre, direccion, cliente_id, disponibilidad]
        );
        res.status(201).json({ message: 'Cancha creada', canchaId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la cancha' });
    }
};

// Obtener todas las canchas
exports.getCanchas = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM canchas');
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener canchas' });
    }
};

// Obtener cancha por ID
exports.getCanchaById = async (req, res) => {
    const { id } = req.params;
    try {
        const [cancha] = await pool.query('SELECT * FROM canchas WHERE id = ?', [id]);
        if (cancha.length === 0) {
            return res.status(404).json({ error: 'Cancha no encontrada' });
        }
        res.status(200).json(cancha[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la cancha' });
    }
};

// Actualizar cancha
exports.updateCancha = async (req, res) => {
    const { id } = req.params;
    const { nombre, direccion, cliente_id, disponibilidad } = req.body;

    try {
        // Verificar si el cliente existe
        const [cliente] = await pool.query('SELECT id FROM clientes WHERE id = ?', [cliente_id]);
        if (cliente.length === 0) {
            return res.status(400).json({ error: 'Cliente no encontrado' });
        }

        // Actualizar la cancha
        await pool.query(
            'UPDATE canchas SET nombre = ?, direccion = ?, cliente_id = ?, disponibilidad = ? WHERE id = ?',
            [nombre, direccion, cliente_id, disponibilidad, id]
        );
        res.status(200).json({ message: 'Cancha actualizada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la cancha' });
    }
};

// Eliminar cancha
exports.deleteCancha = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM canchas WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cancha no encontrada' });
        }
        res.status(200).json({ message: 'Cancha eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la cancha' });
    }
};
