const db = require('../config/database');

const mensualidadController = {
  // Obtener todas las mensualidades
  getAll: async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT m.*, p.nombre, p.apellido, p.nombre_completo 
        FROM mensualidades m 
        INNER JOIN personas p ON m.id_persona = p.id_persona 
        ORDER BY m.fecha_vencimiento DESC
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener mensualidades vencidas
  getVencidas: async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT m.*, p.nombre, p.apellido, p.celular 
        FROM mensualidades m 
        INNER JOIN personas p ON m.id_persona = p.id_persona 
        WHERE m.estado_pago = 'VENCIDO' OR 
              (m.estado_pago = 'PENDIENTE' AND m.fecha_vencimiento < CURDATE())
        ORDER BY m.fecha_vencimiento ASC
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear nueva mensualidad
  create: async (req, res) => {
    try {
      const { id_persona, fecha_pago, fecha_vencimiento, valor, duracion, observaciones } = req.body;
      
      // Determinar estado automáticamente
      const hoy = new Date();
      const vencimiento = new Date(fecha_vencimiento);
      let estado_pago = 'PENDIENTE';
      
      if (vencimiento >= hoy) {
        estado_pago = 'PAGADO';
      } else {
        estado_pago = 'VENCIDO';
      }

      const [result] = await db.query(
        'INSERT INTO mensualidades (id_persona, fecha_pago, fecha_vencimiento, valor, duracion, estado_pago, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id_persona, fecha_pago, fecha_vencimiento, valor, duracion, estado_pago, observaciones]
      );
      
      res.status(201).json({
        id: result.insertId,
        message: 'Mensualidad creada exitosamente'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar estado de pago
  updateEstado: async (req, res) => {
    try {
      const { estado_pago } = req.body;
      const [result] = await db.query(
        'UPDATE mensualidades SET estado_pago = ? WHERE id_mensualidad = ?',
        [estado_pago, req.params.id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Mensualidad no encontrada' });
      }
      res.json({ message: 'Estado actualizado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar mensualidad
  delete: async (req, res) => {
    try {
      const [result] = await db.query(
        'DELETE FROM mensualidades WHERE id_mensualidad = ?',
        [req.params.id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Mensualidad no encontrada' });
      }
      res.json({ message: 'Mensualidad eliminada exitosamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = mensualidadController;
