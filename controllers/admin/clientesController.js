const pool = require('../../config/db');
const multer = require('multer');

// Configuración de almacenamiento con multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Crear cliente con imagen en binario
exports.createCliente = [upload.single('imagen'), async (req, res) => {
    const { nombre, direccion, telefono, correo } = req.body;
    const imagen = req.file ? req.file.buffer : null;

    try {
        const [result] = await pool.query(
            'INSERT INTO clientes (nombre, direccion, telefono, correo, imagen) VALUES (?, ?, ?, ?, ?)',
            [nombre, direccion, telefono, correo, imagen]
        );
        res.status(201).json({ message: 'Cliente creado', clienteId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el cliente' });
    }
}];

// Obtener todos los clientes
exports.getAllClientes = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, nombre, direccion, telefono, correo FROM clientes');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los clientes' });
    }
};

// Obtener imagen de cliente
exports.getClienteImagen = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT imagen FROM clientes WHERE id = ?', [id]);
        if (rows.length > 0 && rows[0].imagen) {
            res.set('Content-Type', 'image/jpeg');  // Ajusta el tipo de contenido según sea necesario
            res.send(rows[0].imagen);  // Devuelve la imagen binaria
        } else {
            res.status(404).json({ error: 'Imagen no encontrada' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la imagen' });
    }
};

// Actualizar cliente con imagen
exports.updateCliente = [upload.single('imagen'), async (req, res) => {
    const { id } = req.params;
    const { nombre, direccion, telefono, correo } = req.body;
    const imagen = req.file ? req.file.buffer : null;

    try {
        await pool.query(
            'UPDATE clientes SET nombre = ?, direccion = ?, telefono = ?, correo = ?, imagen = ? WHERE id = ?',
            [nombre, direccion, telefono, correo, imagen, id]
        );
        res.status(200).json({ message: 'Cliente actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el cliente' });
    }
}];

// Eliminar cliente
exports.deleteCliente = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM clientes WHERE id = ?', [id]);
        res.status(200).json({ message: 'Cliente eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el cliente' });
    }
};
