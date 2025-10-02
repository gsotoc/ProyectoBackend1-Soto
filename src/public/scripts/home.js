document.addEventListener("DOMContentLoaded", () => {
  
  const categoryFilter = document.querySelector("#category-filter");
  const priceAscBtn = document.querySelector("#price-asc");
  const priceDescBtn = document.querySelector("#price-desc");
  const availableToggle = document.querySelector("#toggle-available");
  const searchInput = document.querySelector("#search-input");
  const goBtn = document.querySelector(".go-btn");
  const clearBtn = document.querySelector(".clear-filters");
  const cartButtons = document.querySelectorAll(".go-cart");
  
  
  async function addToCart(productId) {
    const cartId = window.cartId;
    
    if (!cartId) {
      alert('No hay un carrito activo. Por favor, recarga la página.');
      return;
    }
  
    try {
      const response = await fetch(`/carts/${cartId}/products/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: 1 })
      });
  
      const data = await response.json();
  
      if (data.status === 'success') {
        alert('✓ Producto agregado al carrito');
      } else {
        alert('Error al agregar el producto: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al agregar el producto al carrito');
    }
  }
  
  // Función para construir URL con parámetros
  function buildQueryUrl(params) {
    const url = new URL(window.location);
    
    url.searchParams.delete('sort');
    url.searchParams.delete('query');
    url.searchParams.delete('limit');
    url.searchParams.delete('available');
    
    Object.keys(params).forEach(key => {
      if (params[key]) {
        url.searchParams.set(key, params[key]);
      }
    });
    
    url.searchParams.set('page', '1');
    
    return url.toString();
  }
  
  // Restaurar valores de filtros desde la URL al cargar la página
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('query');
  const sort = urlParams.get('sort');
  const available = urlParams.get('available');
  
  if (query && ['Autos', 'Motos', 'Camionetas', 'SUV'].includes(query)) {
    categoryFilter.value = query;
  }
  
  if (query && !['Autos', 'Motos', 'Camionetas', 'SUV'].includes(query)) {
    searchInput.value = query;
  }
  
  if (sort === 'asc' && priceAscBtn) {
    priceAscBtn.classList.add('active');
  } else if (sort === 'desc' && priceDescBtn) {
    priceDescBtn.classList.add('active');
  }

  // Restaurar estado del botón toggle
  if (available === 'true' && availableToggle) {
    availableToggle.classList.add('active');
    availableToggle.textContent = 'Disponibles ✓';
  }
  
  // Event Listeners
  goBtn.addEventListener("click", () => {
    const category = categoryFilter.value;
    const search = searchInput.value.trim();
    
    const params = {};
    
    if (category && category !== 'all') {
      params.query = category;
    }
    
    if (search) {
      params.query = search; 
    }

    // Mantener el filtro de disponibilidad actual
    const currentAvailable = urlParams.get('available');
    if (currentAvailable === 'true') {
      params.available = 'true';
    }
    
    const newUrl = buildQueryUrl(params);
    window.location.href = newUrl;
  });
  
  if (priceAscBtn) {
    priceAscBtn.addEventListener("click", () => {
      const params = { sort: 'asc' };
      
      const currentQuery = urlParams.get('query');
      const currentAvailable = urlParams.get('available');
      if (currentQuery) params.query = currentQuery;
      if (currentAvailable === 'true') params.available = 'true';
      
      const newUrl = buildQueryUrl(params);
      window.location.href = newUrl;
    });
  }
  
  if (priceDescBtn) {
    priceDescBtn.addEventListener("click", () => {
      const params = { sort: 'desc' };
      
      const currentQuery = urlParams.get('query');
      const currentAvailable = urlParams.get('available');
      if (currentQuery) params.query = currentQuery;
      if (currentAvailable === 'true') params.available = 'true';
      
      const newUrl = buildQueryUrl(params);
      window.location.href = newUrl;
    });
  }

  // Toggle de disponibles
  if (availableToggle) {
    availableToggle.addEventListener("click", () => {
      const currentAvailable = urlParams.get('available');
      const params = {};
      
      const currentQuery = urlParams.get('query');
      const currentSort = urlParams.get('sort');
      
      if (currentQuery) params.query = currentQuery;
      if (currentSort) params.sort = currentSort;
      
      // Si está activado (true), al hacer click se desactiva (no envía el parámetro)
      // Si está desactivado (false o null), al hacer click se activa (available=true)
      if (currentAvailable === 'true') {
        // No agregar available al params, así se muestra todo
      } else {
        params.available = 'true';
      }
      
      const newUrl = buildQueryUrl(params);
      window.location.href = newUrl;
    });
  }
  
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      categoryFilter.value = 'all';
      searchInput.value = '';
      
      window.location.href = window.location.pathname;
    });
  }
  
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
      goBtn.click();
    }
  });

  // Event listeners para agregar al carrito
  cartButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      const productId = e.target.dataset.productId;
      addToCart(productId);
    });
  });
});