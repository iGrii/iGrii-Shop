const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyToken } = require("../middlewares/auth");

// 🔓 Obtener todas las categorías
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM categorias");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔐 Crear categoría
router.post("/", verifyToken, async (req, res) => {
  const { nombre } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO categorias (nombre) VALUES ($1) RETURNING id, nombre",
      [nombre]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔐 Actualizar categoría
router.put("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  try {
    await db.query("UPDATE categorias SET nombre = $1 WHERE id = $2", [nombre, id]);
    res.json({ id, nombre });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔐 Eliminar categoría
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM categorias WHERE id = $1", [id]);
    res.json({ mensaje: "Categoría eliminada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


