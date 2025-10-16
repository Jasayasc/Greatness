const express = require('express');
const router = express.Router();
const valoracionController = require('../controllers/valoracionController');

router.get('/', valoracionController.getAll);
router.get('/:id', valoracionController.getById);
router.get('/persona/:id_persona/evolucion', valoracionController.getEvolucion);
router.post('/', valoracionController.create);

module.exports = router;
