const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../middlewares/auth");

// Registrar usuario
router.post("/register", async (req, res) => {
  const { usuario, password } = req.body;
  try {
    await db.query(
      "INSERT INTO usuarios (usuario, password) VALUES ($1, md5($2))",
      [usuario, password]
    );
    res.json({ message: "Usuario registrado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Iniciar sesión
router.post("/login", async (req, res) => {
  const { usuario, password } = req.body;
  try {
    const result = await db.query(
      "SELECT * FROM usuarios WHERE usuario = $1 AND password = md5($2)",
      [usuario, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, usuario: user.usuario }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ message: "Login exitoso", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

