const express = require('express');
const router = express.Router();
const mensualidadController = require('../controllers/mensualidadController');

router.get('/', mensualidadController.getAll);
router.get('/vencidas', mensualidadController.getVencidas);
router.post('/', mensualidadController.create);
router.put('/:id/estado', mensualidadController.updateEstado);

module.exports = router;
