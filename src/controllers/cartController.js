import CartManagerMongo from "../dao/cartManager.js";

const cartManager = new CartManagerMongo();

// Crear carrito
export const createCart = async (req, res) => { 
  try {
    const cart = await cartManager.createCart();
    res.status(201).json({
      status: 'success',
      payload: cart
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Obtener carrito por ID y renderizar vista
export const cartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);

    const cartObj = cart.toObject();

    let total = 0;
    cartObj.products = cartObj.products.map(item => {
      const subtotal = item.quantity * item.productId.price;
      total += subtotal;
      return { 
        ...item, 
        subtotal 
      };
    });

    cartObj.total = total;

    res.render("cart", {
      title: "Mi Carrito",
      cart: cartObj
    });

  } catch (error) {
    res.status(404).render("error", {
      title: "Error",
      message: error.message
    });
  }
};

// Agregar/actualizar producto en carrito
export const update = async (req, res) => { 
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;
    
    const cart = await cartManager.addProductToCart(cid, pid, quantity);
    
    res.json({
      status: 'success',
      payload: cart
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Actualizar todo el carrito con un array de productos
export const updateCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({
        status: 'error',
        message: 'Se requiere un array de productos'
      });
    }

    const cart = await cartManager.updateCart(cid, products);

    res.json({
      status: 'success',
      payload: cart
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Actualizar solo la cantidad de un producto específico
export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'La cantidad debe ser mayor a 0'
      });
    }

    const cart = await cartManager.updateProductQuantity(cid, pid, quantity);

    res.json({
      status: 'success',
      payload: cart
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Eliminar un producto específico del carrito
export const removeProduct = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    
    const cart = await cartManager.removeProductFromCart(cid, pid);

    res.json({
      status: 'success',
      payload: cart
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Eliminar todos los productos del carrito
export const clearCart = async (req, res) => {
  try {
    const { cid } = req.params;
    
    const cart = await cartManager.clearCart(cid);

    res.json({
      status: 'success',
      payload: cart
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};