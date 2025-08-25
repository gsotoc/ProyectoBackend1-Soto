const CartManager = require("../dao/CartsManager"); 
const cartManager = new CartManager(); 

exports.createCart = async (req, res) => {
  try {
    const products = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Debes enviar un array de productos." });
    }
    
    const cart = await cartManager.createCart(products);
    res.status(201).json(cart);
  } catch (error) {
    console.error("Error en createCart:", error);
    res.status(500).json({ error: "Error al crear el carrito", details: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const id = req.params.cid;

    if(!id){
      return res.status(400).json({ error: "Debes ingresar el ID del carrito"});
    }

    const cart = await cartManager.getCartById(id);

    if(!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    } 
    
    res.status(200).json(cart);

  } catch (error) {
      console.error("Error en getById:", error);
      res.status(500).json({ error: "Error al obtener el carrito", details: error.message });
  }
  
};

exports.update = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body; 

  try {

    if (!cid || !pid) {
      return res.status(400).json({ error: "Debes enviar el ID del carrito y del producto" });
    }
    if (typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({ error: "Debes enviar una cantidad válida" });
    }

    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const productIndex = cart.products.findIndex(p => p.id === pid);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ id: pid, quantity });
    }

    const updatedCart = await cartManager.updateCart(cid, cart.products);

    res.status(200).json({ message: "Producto actualizado en el carrito", cart: updatedCart });
  } catch (error) {
    console.error("Error en update:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
