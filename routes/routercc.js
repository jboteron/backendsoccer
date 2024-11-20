const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const upload = require('../controllers/upload'); // Asegúrate de que esta importación sea correcta

// Ruta para crear un cliente (incluye la subida de la imagen)
router.post('/clientes', upload.single('imagen'), clienteController.createCliente);

// Ruta para obtener todos los clientes
router.get('/clientes', clienteController.getClientes);

// Ruta para obtener un cliente por ID
router.get('/clientes/:id', clienteController.getClienteById);

// Ruta para actualizar un cliente (incluye la actualización de la imagen)
router.put('/clientes/:id', upload.single('imagen'), clienteController.updateCliente);

// Ruta para eliminar un cliente
router.delete('/clientes/:id', clienteController.deleteCliente);

module.exports = router;
