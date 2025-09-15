const socket = io();

const statusIndicator = document.getElementById("status-indicator");
const productsList = document.getElementById("products-list");
const productForm = document.getElementById("product-form");
const deleteForm = document.getElementById("delete-form");
const updateForm = document.getElementById("update-form");

// Manejo del estado de conexión
socket.on("connect", () => {
  statusIndicator.textContent = "Conectado";
  statusIndicator.className = "status-indicator status-connected";
});

socket.on("disconnect", () => {
  statusIndicator.textContent = "Desconectado";
  statusIndicator.className = "status-indicator status-disconnected";
});

// Renderizar productos
socket.on("updateProducts", (products) => {
  productsList.innerHTML = "";
  
  if (products.length === 0) {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="product-info">
        <strong>No hay productos disponibles</strong>
        <div class="product-id">Agrega algunos productos para verlos aquí</div>
      </div>
    `;
    productsList.appendChild(li);
    return;
  }

  products.forEach((product) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="product-info">
        <strong>${product.title}</strong> - $${product.price}
        <div class="product-id">ID: ${product.id} | Stock: ${product.stock} | Categoría: ${product.category}</div>
      </div>
    `;
    productsList.appendChild(li);
  });
});

// Formulario agregar producto
productForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const formData = new FormData(productForm);
  const product = {
    // No incluimos ID - se generará en el servidor
    title: formData.get("title"),
    description: formData.get("description"),
    code: formData.get("code"),
    price: parseFloat(formData.get("price")),
    stock: parseInt(formData.get("stock")),
    category: formData.get("category"),
    status: true,
    thumbnails: []
  };

  if (!product.title || !product.description || !product.code || 
      !product.price || !product.stock || !product.category) {
    alert("Por favor, completa todos los campos obligatorios");
    return;
  }

  if (product.price <= 0) {
    alert("El precio debe ser mayor a 0");
    return;
  }

  if (product.stock < 0) {
    alert("El stock no puede ser negativo");
    return;
  }

  socket.emit("createProduct", product);
  productForm.reset();
});

// Formulario eliminar producto
deleteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const id = document.getElementById("delete-id").value.trim();
  
  if (!id) {
    alert("Por favor, ingresa un ID válido");
    return;
  }

  if (confirm(`¿Estás seguro de que deseas eliminar el producto con ID: ${id}?`)) {
    socket.emit("deleteProduct", id);
    deleteForm.reset();
  }
});


updateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const formData = new FormData(updateForm);
  const id = formData.get("update-id").trim();
  const updates = {
    title: formData.get("title") || undefined,
    description: formData.get("description") || undefined,
    code: formData.get("code") || undefined,
    price: formData.get("price") ? parseFloat(formData.get("price")) : undefined,
    stock: formData.get("stock") ? parseInt(formData.get("stock")) : undefined,
    category: formData.get("category") || undefined
  };

  if (!id) {
    alert("Por favor, ingresa el ID del producto a actualizar");
    return;
  }

  socket.emit("updateProduct", { id, updates });
  updateForm.reset();
});

// Manejo de errores del servidor
socket.on("error", (error) => {
  alert(`Error: ${error.message}`);
});

socket.on("productCreated", (product) => {
  console.log("Producto creado:", product);
});

socket.on("productDeleted", (productId) => {
  console.log("Producto eliminado:", productId);
});