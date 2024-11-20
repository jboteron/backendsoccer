const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// Ruta para crear cliente con imagen
router.post('/clientes', clienteController.upload.single('imagen'), clienteController.crearCliente);

// Ruta para obtener todos los clientes
router.get('/clientes', clienteController.obtenerClientes);

// Ruta para obtener un cliente por ID
router.get('/clientes/:id', clienteController.obtenerClientePorId);

module.exports = router;
