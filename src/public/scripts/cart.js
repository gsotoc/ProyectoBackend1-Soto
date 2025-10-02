document.addEventListener("DOMContentLoaded", () => {
  const quantityInputs = document.querySelectorAll(".quantity-input");
  const btnQuantities = document.querySelectorAll(".btn-quantity");
  const btnRemoves = document.querySelectorAll(".btn-remove");
  const btnClearCart = document.querySelector(".btn-clear-cart");

  // Función para actualizar la cantidad de un producto
  async function updateQuantity(productId, newQuantity) {
    try {
      const response = await fetch(`/carts/${cartId}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: parseInt(newQuantity) })
      });

      const data = await response.json();

      if (data.status === 'success') {
        // Recargar la página para mostrar los cambios
        window.location.reload();
      } else {
        alert('Error al actualizar la cantidad: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar la cantidad');
    }
  }

  // Función para eliminar un producto del carrito
  async function removeProduct(productId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return;
    }

    try {
      const response = await fetch(`/carts/${cartId}/products/${productId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.status === 'success') {
        window.location.reload();
      } else {
        alert('Error al eliminar el producto: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el producto');
    }
  }

  // Función para vaciar el carrito
  async function clearCart() {
    if (!confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      return;
    }

    try {
      const response = await fetch(`/carts/${cartId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.status === 'success') {
        window.location.reload();
      } else {
        alert('Error al vaciar el carrito: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al vaciar el carrito');
    }
  }

  // Event listeners para los inputs de cantidad
  quantityInputs.forEach(input => {
    input.addEventListener("change", (e) => {
      const productId = e.target.dataset.productId;
      const newQuantity = e.target.value;

      if (newQuantity < 1) {
        e.target.value = 1;
        return;
      }

      updateQuantity(productId, newQuantity);
    });
  });

  // Event listeners para los botones de +/-
  btnQuantities.forEach(button => {
    button.addEventListener("click", (e) => {
      const cartItem = e.target.closest(".cart-item");
      const input = cartItem.querySelector(".quantity-input");
      const productId = input.dataset.productId;
      const action = e.target.dataset.action;
      
      let currentQuantity = parseInt(input.value);

      if (action === "increase") {
        currentQuantity++;
      } else if (action === "decrease" && currentQuantity > 1) {
        currentQuantity--;
      } else {
        return; // No permitir cantidad menor a 1
      }

      input.value = currentQuantity;
      updateQuantity(productId, currentQuantity);
    });
  });

  // Event listeners para los botones de eliminar
  btnRemoves.forEach(button => {
    button.addEventListener("click", (e) => {
      const productId = e.target.dataset.productId;
      removeProduct(productId);
    });
  });

  // Event listener para vaciar carrito
  if (btnClearCart) {
    btnClearCart.addEventListener("click", () => {
      clearCart();
    });
  }
});