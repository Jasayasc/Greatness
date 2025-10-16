const express = require('express');
const router = express.Router();
const personaController = require('../controllers/personaController');

router.get('/', personaController.getAll); // Solo activos
router.get('/all', personaController.getAllWithStatus); // Todos con estado calculado
router.get('/:id', personaController.getById);
router.get('/:id/details', personaController.getWithDetails);
router.post('/', personaController.create);
router.put('/:id', personaController.update);
router.delete('/:id', personaController.delete);

module.exports = router;
