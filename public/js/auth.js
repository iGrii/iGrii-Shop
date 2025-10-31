const API_URL = "https://igrii-shop.onrender.com";

// Iniciar sesión
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const usuario = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, password }),
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("token", data.token);
    window.location.href = "admin.html";
  } else {
    document.getElementById("msg").textContent = data.message;
  }
});

// Registrar usuario nuevo
async function registrar() {
  const usuario = prompt("Nuevo usuario:");
  const password = prompt("Contraseña:");
  if (!usuario || !password) return alert("Datos incompletos");

  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, password }),
  });

  const data = await res.json();
  if (res.ok) {
    alert("Usuario registrado correctamente ✅");
  } else {
    alert("Error: " + data.error);
  }
}

