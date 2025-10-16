const db = require('../config/database');

const valoracionController = {
  // Obtener todas las valoraciones
  getAll: async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT v.*, p.nombre, p.apellido 
        FROM valoraciones v 
        INNER JOIN personas p ON v.id_persona = p.id_persona 
        ORDER BY v.fecha_valoracion DESC
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener valoración con medidas corporales
  getById: async (req, res) => {
    try {
      const [valoracion] = await db.query(
        'SELECT * FROM valoraciones WHERE id_valoracion = ?',
        [req.params.id]
      );
      
      if (valoracion.length === 0) {
        return res.status(404).json({ message: 'Valoración no encontrada' });
      }

      const [medidas] = await db.query(
        'SELECT * FROM medidas_corporales WHERE id_valoracion = ?',
        [req.params.id]
      );

      res.json({
        valoracion: valoracion[0],
        medidas
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear nueva valoración con medidas
  create: async (req, res) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { id_persona, fecha_valoracion, edad, peso, estatura, imc, porcentaje_grasa, observaciones, medidas } = req.body;
      
      const [result] = await connection.query(
        'INSERT INTO valoraciones (id_persona, fecha_valoracion, edad, peso, estatura, imc, porcentaje_grasa, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id_persona, fecha_valoracion, edad, peso, estatura, imc, porcentaje_grasa, observaciones]
      );

      const id_valoracion = result.insertId;

      // Insertar medidas corporales
      if (medidas && medidas.length > 0) {
        for (const medida of medidas) {
          await connection.query(
            'INSERT INTO medidas_corporales (id_valoracion, tipo_medida, valor) VALUES (?, ?, ?)',
            [id_valoracion, medida.tipo_medida, medida.valor]
          );
        }
      }

      await connection.commit();
      res.status(201).json({
        id: id_valoracion,
        message: 'Valoración creada exitosamente'
      });
    } catch (error) {
      await connection.rollback();
      res.status(500).json({ error: error.message });
    } finally {
      connection.release();
    }
  },

  // Obtener evolución de una persona
  getEvolucion: async (req, res) => {
    try {
      const [rows] = await db.query(
        'SELECT * FROM valoraciones WHERE id_persona = ? ORDER BY fecha_valoracion ASC',
        [req.params.id_persona]
      );
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = valoracionController;
