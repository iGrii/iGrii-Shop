const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../middlewares/auth");

// Registrar usuario
router.post("/register", async (req, res) => {
  const { usuario, password } = req.body;
  try {
    await db.query("INSERT INTO usuarios (usuario, password) VALUES (?, MD5(?))", [usuario, password]);
    res.json({ message: "Usuario registrado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Iniciar sesión
router.post("/login", async (req, res) => {
  const { usuario, password } = req.body;
  try {
    const [rows] = await db.query(
      "SELECT * FROM usuarios WHERE usuario = ? AND password = MD5(?)",
      [usuario, password]
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }

    const user = rows[0];
    const token = jwt.sign({ id: user.id, usuario: user.usuario }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ message: "Login exitoso", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
