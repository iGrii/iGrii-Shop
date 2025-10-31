const API_URL = "http://localhost:3000";
const token = localStorage.getItem("token");
if (!token) window.location.href = "login.html";

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "index.html";
});

// ========= CATEGORÍAS =========
const formCategoria = document.getElementById("formCategoria");
formCategoria.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombreCategoria").value;
  await fetch(`${API_URL}/categorias`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nombre }),
  });
  formCategoria.reset();
  cargarCategorias();
  actualizarSelects();
});

async function cargarCategorias() {
  const res = await fetch(`${API_URL}/categorias`);
  const categorias = await res.json();
  const lista = document.getElementById("listaCategorias");
  lista.innerHTML = categorias.map(c => `
    <li class="list-group-item d-flex justify-content-between align-items-center">
      ${c.nombre}
      <div>
        <button class="btn btn-warning btn-sm" onclick="editarCategoria(${c.id})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarCategoria(${c.id})">Eliminar</button>
      </div>
    </li>
  `).join('');

  // actualizar select de productos
  const select = document.getElementById("categoriaProducto");
  select.innerHTML = categorias.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
}

async function eliminarCategoria(id) {
  await fetch(`${API_URL}/categorias/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  cargarCategorias();
}

async function editarCategoria(id) {
  const nombre = prompt("Nuevo nombre:");
  await fetch(`${API_URL}/categorias/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nombre }),
  });
  cargarCategorias();
}

// ========= PRODUCTOS =========
const formProducto = document.getElementById("formProducto");
formProducto.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombreProducto").value;
  const precio = document.getElementById("precioProducto").value;
  const categoria_id = document.getElementById("categoriaProducto").value;

  await fetch(`${API_URL}/productos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nombre, precio, categoria_id }),
  });
  formProducto.reset();
  cargarProductos();
  actualizarSelects();
});

async function cargarProductos() {
  const res = await fetch(`${API_URL}/productos`);
  const productos = await res.json();
  const container = document.getElementById("listaProductos");
  container.innerHTML = productos.map(p => `
    <div class="col-md-4">
      <div class="card p-3 shadow-sm">
        <h5>${p.nombre}</h5>
        <p>Precio: S/. ${p.precio}</p>
        <button class="btn btn-warning btn-sm" onclick="editarProducto(${p.id})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${p.id})">Eliminar</button>
      </div>
    </div>
  `).join('');

  // actualizar select de imágenes
  const selectImg = document.getElementById("selectProductoImg");
  selectImg.innerHTML = productos.map(p => `<option value="${p.id}">${p.nombre}</option>`).join('');
}

async function eliminarProducto(id) {
  await fetch(`${API_URL}/productos/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  cargarProductos();
}

async function editarProducto(id) {
  const nombre = prompt("Nuevo nombre:");
  const precio = prompt("Nuevo precio:");
  const categoria_id = prompt("Nuevo ID categoría:");
  await fetch(`${API_URL}/productos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nombre, precio, categoria_id }),
  });
  cargarProductos();
}

// ========= IMÁGENES =========
const formImagen = document.getElementById("formImagen");
formImagen.addEventListener("submit", async (e) => {
  e.preventDefault();
  const url = document.getElementById("urlImagen").value;
  const producto_id = document.getElementById("selectProductoImg").value;

  await fetch(`${API_URL}/imagenes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ url, producto_id }),
  });
  formImagen.reset();
  cargarImagenes();
});

// ✅ Cargar TODAS las imágenes (no solo del producto 1)
async function cargarImagenes() {
  const resProductos = await fetch(`${API_URL}/productos`);
  const productos = await resProductos.json();

  const lista = document.getElementById("listaImagenes");
  lista.innerHTML = "";

  for (const p of productos) {
    const res = await fetch(`${API_URL}/imagenes/${p.id}`);
    const imagenes = await res.json();

    if (imagenes.length > 0) {
      imagenes.forEach(i => {
        lista.innerHTML += `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <img src="${i.url}" alt="${p.nombre}" width="60" height="40" class="rounded me-2">
              <strong>${p.nombre}</strong> (ID ${i.id})
            </div>
            <div>
              <button class="btn btn-warning btn-sm" onclick="editarImagen(${i.id}, '${i.url}', ${p.id})">Editar</button>
              <button class="btn btn-danger btn-sm" onclick="eliminarImagen(${i.id})">Eliminar</button>
            </div>
          </li>
        `;
      });
    }
  }
}

async function eliminarImagen(id) {
  await fetch(`${API_URL}/imagenes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  cargarImagenes();
}

async function editarImagen(id, urlActual, productoId) {
  const nuevaURL = prompt("Nueva URL de la imagen:", urlActual);
  if (!nuevaURL) return;

  await fetch(`${API_URL}/imagenes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ url: nuevaURL, producto_id: productoId }),
  });
  cargarImagenes();
}

async function actualizarSelects() {
  await cargarCategorias();
  await cargarProductos();
  await cargarImagenes();
}

cargarCategorias();
cargarProductos();
cargarImagenes();
