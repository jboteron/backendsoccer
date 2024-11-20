const pool = require('../../config/db');

// Crear pregunta
exports.createPregunta = async (req, res) => {
    const { nombre, correo, mensaje } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO preguntas (nombre, correo, mensaje) VALUES (?, ?, ?)',
            [nombre, correo, mensaje]
        );
        res.status(201).json({ message: 'Pregunta creada', preguntaId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la pregunta' });
    }
};

// Obtener todas las preguntas
exports.getPreguntas = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM preguntas');
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener preguntas' });
    }
};

// Eliminar pregunta
exports.deletePregunta = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM preguntas WHERE id = ?', [id]);
        res.status(200).json({ message: 'Pregunta eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la pregunta' });
    }
};
