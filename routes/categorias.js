// routes/categorias.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyToken } = require("../middlewares/auth");

// 🔓 Ruta pública: obtener todas las categorías
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM categorias");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔐 Ruta protegida: crear categoría
router.post("/", verifyToken, async (req, res) => {
  const { nombre } = req.body;
  try {
    const [result] = await db.query("INSERT INTO categorias (nombre) VALUES (?)", [nombre]);
    res.json({ id: result.insertId, nombre });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔐 Ruta protegida: actualizar categoría
router.put("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  try {
    await db.query("UPDATE categorias SET nombre = ? WHERE id = ?", [nombre, id]);
    res.json({ id, nombre });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔐 Ruta protegida: eliminar categoría
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM categorias WHERE id = ?", [id]);
    res.json({ mensaje: "Categoría eliminada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

