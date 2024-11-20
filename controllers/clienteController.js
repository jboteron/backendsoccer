const pool = require('../config/db');
const multer = require('multer');

// Configuración de almacenamiento en memoria con multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.upload = upload;

// Crear nuevo cliente
exports.crearCliente = async (req, res) => {
  const { nombre, direccion, telefono, correo } = req.body;
  const imagen = req.file ? req.file.buffer : null;

  try {
    const [result] = await pool.query(
      'INSERT INTO clientes (nombre, direccion, imagen, telefono, correo, fecha_creacion) VALUES (?, ?, ?, ?, ?, NOW())',
      [nombre, direccion, imagen, telefono, correo]
    );

    res.status(201).json({ message: 'Cliente creado con éxito', clienteId: result.insertId });
  } catch (error) {
    console.error('Error al crear el cliente:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

// Obtener todos los clientes
exports.obtenerClientes = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clientes');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener los clientes:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

// Obtener cliente por ID
exports.obtenerClientePorId = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query('SELECT * FROM clientes WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error al obtener el cliente:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};
