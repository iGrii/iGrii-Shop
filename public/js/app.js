const API_URL = "https://igrii-shop.onrender.com";

document.addEventListener("DOMContentLoaded", async () => {
  await cargarCategorias();
  await cargarProductos(); // Muestra todos los productos al inicio
});

// ================= CARGAR CATEGORÍAS =================
async function cargarCategorias() {
  const res = await fetch(`${API_URL}/categorias`);
  const categorias = await res.json();

  const nav = document.getElementById("categoriasNav");
  nav.innerHTML = `
    <li class="nav-item"><a href="#" class="nav-link" onclick="cargarProductos()">Todos</a></li>
  ` + categorias.map(cat => `
    <li class="nav-item">
      <a href="#" class="nav-link" onclick="cargarProductos(${cat.id}, '${cat.nombre}')">${cat.nombre}</a>
    </li>
  `).join('');
}

// ================= CARGAR PRODUCTOS =================
async function cargarProductos(categoriaId = null, categoriaNombre = "Todos") {
  try {
    const res = await fetch(`${API_URL}/productos`);
    let productos = await res.json();

    if (categoriaId) {
      productos = productos.filter(p => p.categoria_id === categoriaId);
    }

    const container = document.getElementById("productosContainer");

    if (productos.length === 0) {
      container.innerHTML = `<p class="text-center text-muted">No hay productos en la categoría "${categoriaNombre}".</p>`;
      return;
    }

    // Renderiza los productos con su imagen real
    const productosHTML = await Promise.all(productos.map(async (p) => {
      // 🔍 Buscar imagen del producto
      const imgRes = await fetch(`${API_URL}/imagenes/${p.id}`);
      const imagenes = await imgRes.json();

      // Si tiene imagen, usa la primera; sino, una genérica
      const imagen = imagenes.length > 0 && imagenes[0].url
        ? imagenes[0].url
        : "https://placehold.co/300x200?text=Sin+Imagen";

      const precio = Number(p.precio);
      const precioTexto = isNaN(precio) ? "Sin precio" : `S/. ${precio.toFixed(2)}`;

      return `
        <div class="col-md-4 col-lg-3">
          <div class="card h-100 shadow-sm">
            <img src="${imagen}" class="card-img-top object-fit-cover" 
                 alt="${p.nombre}" style="height:200px;object-fit:cover;">
            <div class="card-body text-center">
              <h5 class="card-title">${p.nombre}</h5>
              <p class="card-text text-muted">${precioTexto}</p>
              <button class="btn btn-pastel" onclick="mostrarDetalles(${p.id})">Ver detalles 🍪</button>
            </div>
          </div>
        </div>
      `;
    }));

    container.innerHTML = productosHTML.join('');
  } catch (err) {
    console.error("Error al cargar productos:", err);
  }
}

// ================= DETALLES DE PRODUCTO =================
async function mostrarDetalles(id) {
  const res = await fetch(`${API_URL}/productos`);
  const productos = await res.json();
  const producto = productos.find(p => p.id === id);

  const imgRes = await fetch(`${API_URL}/imagenes/${id}`);
  const imagenes = await imgRes.json();

  const modalBody = `
    <div class="text-center">
      <h4>${producto.nombre}</h4>
      <p class="text-muted">Categoría: ${producto.categoria}</p>
      <p class="fw-bold">Precio: S/. ${Number(producto.precio).toFixed(2)}</p>
      <div class="d-flex justify-content-center flex-wrap gap-2 mt-3">
        ${imagenes.length > 0 
          ? imagenes.map(i => `<img src="${i.url}" width="120" class="rounded shadow-sm">`).join('')
          : '<p class="text-muted">Sin imágenes disponibles</p>'
        }
      </div>
    </div>
  `;

  document.getElementById("modalContent").innerHTML = modalBody;
  const modal = new bootstrap.Modal(document.getElementById("detalleModal"));
  modal.show();
}
