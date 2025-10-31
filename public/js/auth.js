const API_URL = "https://igrii-shop.onrender.com";

// ====== INICIAR SESIÓN ======
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;

  if (!usuario || !password) {
    return alert("Por favor completa todos los campos");
  }

  try {
    const res = await fetch(`${API_URL}/usuarios/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      window.location.href = "admin.html";
    } else {
      document.getElementById("msg").textContent = data.message || data.error;
    }
  } catch (err) {
    console.error("Error al iniciar sesión:", err);
    document.getElementById("msg").textContent = "Error de conexión";
  }
});

// ====== REGISTRAR NUEVO USUARIO ======
async function registrar() {
  const usuario = prompt("Nuevo usuario:");
  const password = prompt("Contraseña:");

  if (!usuario || !password) return alert("Datos incompletos");

  try {
    const res = await fetch(`${API_URL}/usuarios/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Usuario registrado correctamente ✅");
    } else {
      alert("Error: " + (data.error || data.message));
    }
  } catch (err) {
    console.error("Error al registrar usuario:", err);
    alert("Error de conexión");
  }
}
