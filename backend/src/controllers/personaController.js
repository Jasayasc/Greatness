const db = require('../config/database');

const personaController = {
  // Obtener todas las personas ACTIVAS (con mensualidad vigente)
  getAll: async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT 
    p.*,
    m.fecha_vencimiento,
    m.estado_pago,
    CASE 
        WHEN m.fecha_vencimiento >= CURDATE() AND m.estado_pago = 'PAGADO' THEN 'ACTIVO'
        ELSE 'INACTIVO'
    END as estado_calculado
FROM personas p
LEFT JOIN (
    SELECT 
        m1.id_persona,
        m1.fecha_vencimiento,
        m1.estado_pago
    FROM mensualidades m1
    INNER JOIN (
        SELECT 
            id_persona, 
            MAX(fecha_vencimiento) as max_fecha
        FROM mensualidades 
        GROUP BY id_persona
    ) m2 ON m1.id_persona = m2.id_persona AND m1.fecha_vencimiento = m2.max_fecha
) m ON p.id_persona = m.id_persona
WHERE 
    m.fecha_vencimiento >= CURDATE() 
    AND m.estado_pago = 'PAGADO'
ORDER BY p.nombre;
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener TODAS las personas (para la página de gestión de clientes)
  getAllWithStatus: async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT 
          p.*,
          m.fecha_vencimiento,
          m.estado_pago,
          CASE 
            WHEN m.fecha_vencimiento >= CURDATE() AND m.estado_pago = 'PAGADO' THEN 'ACTIVO'
            WHEN m.fecha_vencimiento IS NULL THEN 'SIN MENSUALIDAD'
            ELSE 'INACTIVO'
          END as estado_calculado
        FROM personas p
        LEFT JOIN (
          SELECT 
            id_persona, 
            fecha_vencimiento, 
            estado_pago
          FROM mensualidades m1
          WHERE fecha_vencimiento = (
            SELECT MAX(fecha_vencimiento) 
            FROM mensualidades m2 
            WHERE m2.id_persona = m1.id_persona
          )
        ) m ON p.id_persona = m.id_persona
        ORDER BY p.nombre
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener persona por ID con estado calculado
  getById: async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT 
          p.*,
          m.fecha_vencimiento,
          m.estado_pago,
          CASE 
            WHEN m.fecha_vencimiento >= CURDATE() AND m.estado_pago = 'PAGADO' THEN 'ACTIVO'
            WHEN m.fecha_vencimiento IS NULL THEN 'SIN MENSUALIDAD'
            ELSE 'INACTIVO'
          END as estado_calculado
        FROM personas p
        LEFT JOIN (
          SELECT 
            id_persona, 
            fecha_vencimiento, 
            estado_pago
          FROM mensualidades m1
          WHERE fecha_vencimiento = (
            SELECT MAX(fecha_vencimiento) 
            FROM mensualidades m2 
            WHERE m2.id_persona = m1.id_persona
          )
        ) m ON p.id_persona = m.id_persona
        WHERE p.id_persona = ?
      `, [req.params.id]);
      
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Persona no encontrada' });
      }
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear nueva persona
  create: async (req, res) => {
    try {
      const { nombre, apellido, celular } = req.body;
      const [result] = await db.query(
        'INSERT INTO personas (nombre, apellido, celular) VALUES (?, ?, ?)',
        [nombre, apellido, celular]
      );
      res.status(201).json({
        id: result.insertId,
        message: 'Persona creada exitosamente'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar persona
  update: async (req, res) => {
    try {
      const { nombre, apellido, celular } = req.body;
      const [result] = await db.query(
        'UPDATE personas SET nombre = ?, apellido = ?, celular = ? WHERE id_persona = ?',
        [nombre, apellido, celular, req.params.id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Persona no encontrada' });
      }
      res.json({ message: 'Persona actualizada exitosamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar persona (borrado físico)
  delete: async (req, res) => {
    try {
      const [result] = await db.query(
        'DELETE FROM personas WHERE id_persona = ?',
        [req.params.id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Persona no encontrada' });
      }
      res.json({ message: 'Persona eliminada exitosamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener persona con sus mensualidades y valoraciones
  getWithDetails: async (req, res) => {
    try {
      const [persona] = await db.query(`
        SELECT 
          p.*,
          m.fecha_vencimiento,
          m.estado_pago,
          CASE 
            WHEN m.fecha_vencimiento >= CURDATE() AND m.estado_pago = 'PAGADO' THEN 'ACTIVO'
            WHEN m.fecha_vencimiento IS NULL THEN 'SIN MENSUALIDAD'
            ELSE 'INACTIVO'
          END as estado_calculado
        FROM personas p
        LEFT JOIN (
          SELECT 
            id_persona, 
            fecha_vencimiento, 
            estado_pago
          FROM mensualidades m1
          WHERE fecha_vencimiento = (
            SELECT MAX(fecha_vencimiento) 
            FROM mensualidades m2 
            WHERE m2.id_persona = m1.id_persona
          )
        ) m ON p.id_persona = m.id_persona
        WHERE p.id_persona = ?
      `, [req.params.id]);
      
      if (persona.length === 0) {
        return res.status(404).json({ message: 'Persona no encontrada' });
      }

      const [mensualidades] = await db.query(
        'SELECT * FROM mensualidades WHERE id_persona = ? ORDER BY fecha_vencimiento DESC',
        [req.params.id]
      );

      const [valoraciones] = await db.query(
        'SELECT * FROM valoraciones WHERE id_persona = ? ORDER BY fecha_valoracion DESC',
        [req.params.id]
      );

      res.json({
        persona: persona[0],
        mensualidades,
        valoraciones
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = personaController;
