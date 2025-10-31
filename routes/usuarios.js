const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../middlewares/auth");

// ---------------- REGISTRAR USUARIO ----------------
router.post("/register", async (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    // Verificar si el usuario ya existe
    const existe = await db.query(
      "SELECT * FROM usuarios WHERE usuario = $1",
      [usuario]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    // Registrar usuario con MD5
    await db.query(
      "INSERT INTO usuarios (usuario, password) VALUES ($1, md5($2))",
      [usuario, password]
    );

    res.json({ message: "Usuario registrado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- LOGIN ----------------
router.post("/login", async (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ message: "Datos incompletos" });
  }

  try {
    const result = await db.query(
      "SELECT * FROM usuarios WHERE usuario = $1 AND password = md5($2)",
      [usuario, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }

    const user = result.rows[0];

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, usuario: user.usuario },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login exitoso", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;



