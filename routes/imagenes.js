const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyToken } = require("../middlewares/auth");

// Ver imágenes de un producto
router.get("/:producto_id", async (req, res) => {
  const { producto_id } = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM imagenes_productos WHERE producto_id = $1",
      [producto_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Agregar imagen
router.post("/", verifyToken, async (req, res) => {
  const { url, producto_id } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO imagenes_productos (url, producto_id) VALUES ($1, $2) RETURNING id, url, producto_id",
      [url, producto_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar imagen
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM imagenes_productos WHERE id = $1", [id]);
    res.json({ mensaje: "Imagen eliminada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
