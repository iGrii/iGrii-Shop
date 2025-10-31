const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyToken } = require("../middlewares/auth");

// ✅ Obtener todos los productos con su categoría
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id, 
        p.nombre, 
        CAST(p.precio AS DECIMAL(10,2)) AS precio, 
        p.categoria_id,
        c.nombre AS categoria
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// ✅ Agregar producto
router.post("/", verifyToken, async (req, res) => {
  const { nombre, precio, categoria_id } = req.body;
  try {
    await db.query(
      "INSERT INTO productos (nombre, precio, categoria_id) VALUES (?, ?, ?)",
      [nombre, precio, categoria_id]
    );
    res.json({ message: "Producto agregado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al agregar producto" });
  }
});

// ✅ Editar producto
router.put("/:id", verifyToken, async (req, res) => {
  const { nombre, precio, categoria_id } = req.body;
  try {
    await db.query(
      "UPDATE productos SET nombre=?, precio=?, categoria_id=? WHERE id=?",
      [nombre, precio, categoria_id, req.params.id]
    );
    res.json({ message: "Producto actualizado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
});

// ✅ Eliminar producto
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await db.query("DELETE FROM productos WHERE id=?", [req.params.id]);
    res.json({ message: "Producto eliminado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

module.exports = router;
