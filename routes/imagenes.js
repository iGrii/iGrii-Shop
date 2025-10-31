// routes/imagenes.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyToken } = require("../middlewares/auth");

// 🔓 Ruta pública: ver imágenes de un producto
router.get("/:producto_id", async (req, res) => {
  const { producto_id } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT * FROM imagenes_productos WHERE producto_id = ?",
      [producto_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔐 Ruta protegida: agregar imagen
router.post("/", verifyToken, async (req, res) => {
  const { url, producto_id } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO imagenes_productos (url, producto_id) VALUES (?, ?)",
      [url, producto_id]
    );
    res.json({ id: result.insertId, url, producto_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔐 Ruta protegida: eliminar imagen
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM imagenes_productos WHERE id = ?", [id]);
    res.json({ mensaje: "Imagen eliminada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

