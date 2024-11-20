// camRoutes.js
const express = require('express');
const router = express.Router();
const cam = require('../controllers/camController');

// Ruta para enviar un mensaje de contacto
router.post('/contact', cam.sendContactMessage);

module.exports = router;
