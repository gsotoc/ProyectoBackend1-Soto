// src/middleware/cartMiddleware.js
import CartManagerMongo from "../dao/cartManager.js";

const cartManager = new CartManagerMongo();

export const cartExists = async (req, res, next) => {
  try {
    // Si ya existe un carrito en la sesión, verificar que existe en la BD
    if (req.session.cartId) {
      try {
        await cartManager.getCartById(req.session.cartId);
        return next();
      } catch (error) {
        console.log('Carrito de sesión no encontrado en BD, creando uno nuevo.');
      }
    }

    const newCart = await cartManager.createCart();
    req.session.cartId = newCart._id.toString();
    
    console.log('Nuevo carrito creado:', req.session.cartId);
    next();
  } catch (error) {
    console.error('Error en middleware de carrito:', error);
    next();
  }
};


export const addCartToLocals = (req, res, next) => {
  res.locals.cartId = req.session.cartId || null;
  next();
};