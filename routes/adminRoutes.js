const express = require('express');
const router = express.Router();

// Controladores de las canchas
const { createCancha, getCanchas, updateCancha, deleteCancha } = require('../controllers/admin/canchasController');

// Controladores de los clientes
const { createCliente, getAllClientes, getClienteImagen, updateCliente, deleteCliente } = require('../controllers/admin/clientesController');

// Controladores de las preguntas
const { createPregunta, getPreguntas, deletePregunta } = require('../controllers/admin/preguntasController');

// Controladores de las reservas
const { getReservaById, getReservas, updateReserva, deleteReserva } = require('../controllers/admin/reservasController');

// Controladores de los usuarios
const userController = require('../controllers/admin/usuariosController');
const { upload } = require('../controllers/admin/usuariosController');  // Middleware de multer
const adminController = require('../controllers/admin/dashboardController');

// Rutas de canchas
router.post('/canchas', createCancha);               // Crear cancha
router.get('/canchas', getCanchas);                 // Obtener canchas
router.put('/canchas/:id', updateCancha);           // Actualizar cancha por ID
router.delete('/canchas/:id', deleteCancha);        // Eliminar cancha por ID

// Rutas de clientes
router.post('/clientes', createCliente);            // Crear cliente
router.get('/clientes', getAllClientes);            // Obtener todos los clientes
router.get('/clientes/:id/imagen', getClienteImagen); // Obtener imagen de un cliente por ID
router.put('/clientes/:id', updateCliente);         // Actualizar cliente por ID
router.delete('/clientes/:id', deleteCliente);      // Eliminar cliente por ID

// Rutas de preguntas
router.post('/preguntas', createPregunta);         // Crear pregunta
router.get('/preguntas', getPreguntas);             // Obtener todas las preguntas
router.delete('/preguntas/:id', deletePregunta);   // Eliminar pregunta por ID

// Rutas de reservas
router.get('/reservas', getReservas);               // Obtener todas las reservas
router.get('/reservas/:id', getReservaById);        // Obtener una reserva por ID
router.put('/reservas/:id', updateReserva);         // Actualizar una reserva por ID
router.delete('/reservas/:id', deleteReserva);      // Eliminar reserva por ID

// Rutas de usuarios
router.post('/usuarios', upload.single('foto'), userController.createUser);  // Crear un nuevo usuario con foto
router.get('/usuarios', userController.getAllUsers);  // Obtener todos los usuarios
router.get('/usuarios/:id', userController.getUserById);  // Obtener un usuario por ID
router.put('/usuarios/:id', upload.single('foto'), userController.updateUser);  // Actualizar un usuario con foto
router.delete('/usuarios/:id', userController.deleteUser);  // Eliminar un usuario por ID

// Obtener datos del dashboard
router.get('/dashboard', adminController.getDashboardData);

// Obtener las canchas más reservadas
router.get('/top-canchas', adminController.getTopCanchasReservadas);

// Obtener los clientes más activos
router.get('/top-clientes', adminController.getTopClientesActivos);


module.exports = router;

