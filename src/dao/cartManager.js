import mongoose from "mongoose";
import Cart from "../models/Carts.js";
import Product from "../models/Products.js";

class CartManagerMongo {
  async getCarts() {
    try {
      const carts = await Cart.find().populate('products.productId');
      return carts;
    } catch (error) {
      throw new Error(`Error al obtener carritos: ${error.message}`);
    }
  }
  
  async createCart(products = []) {
    try {
      // Validar que los productos existan si se proporcionan
      if (products.length > 0) {
        for (const item of products) {
          if (!mongoose.Types.ObjectId.isValid(item.productId)) {
            throw new Error(`ID de producto inválido: ${item.productId}`);
          }
          
          const productExists = await Product.findById(item.productId);
          if (!productExists) {
            throw new Error(`Producto no encontrado: ${item.productId}`);
          }
        }
      }
  
      const newCart = new Cart({
        products: products
      });
  
      await newCart.save();
      await newCart.populate('products.productId');
      
      return newCart;
    } catch (error) {
      throw new Error(`Error al crear carrito: ${error.message}`);
    }
  }
  
  async getCartById(cartId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(cartId)) {
        throw new Error("ID de carrito inválido");
      }
  
      const cart = await Cart.findById(cartId).populate('products.productId');
      
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
  
      return cart;
    } catch (error) {
      throw new Error(`Error al obtener carrito: ${error.message}`);
    }
  }
  
  async updateCart(cartId, newProducts) {
    try {
      if (!mongoose.Types.ObjectId.isValid(cartId)) {
        throw new Error("ID de carrito inválido");
      }
  
      // Validar que los productos existan
      for (const item of newProducts) {
        if (!mongoose.Types.ObjectId.isValid(item.productId)) {
          throw new Error(`ID de producto inválido: ${item.productId}`);
        }
        
        const productExists = await Product.findById(item.productId);
        if (!productExists) {
          throw new Error(`Producto no encontrado: ${item.productId}`);
        }
      }
  
      const updatedCart = await Cart.findByIdAndUpdate(
        cartId,
        { 
          products: newProducts,
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      ).populate('products.productId');
  
      if (!updatedCart) {
        throw new Error("Carrito no encontrado");
      }
  
      return updatedCart;
    } catch (error) {
      throw new Error(`Error al actualizar carrito: ${error.message}`);
    }
  }
  
  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      cartId = cartId.toString().trim();
      productId = productId.toString().trim();
      
      // Validar formato de ObjectId
      if (!mongoose.Types.ObjectId.isValid(cartId) || cartId.length !== 24) {
        throw new Error("ID de carrito inválido");
      }

      if (!mongoose.Types.ObjectId.isValid(productId) || productId.length !== 24) {
        throw new Error("ID de producto inválido");
      }

      // Verificar que el producto existe
      const productExists = await Product.findById(productId);
      if (!productExists) {
        throw new Error("Producto no encontrado");
      }

      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const existingProductIndex = cart.products.findIndex(
        item => item.productId.toString() === productId
      );

      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }

      cart.updatedAt = new Date();
      await cart.save();
      await cart.populate('products.productId');

      return cart;
    } catch (error) {
      throw new Error(`Error al agregar producto al carrito: ${error.message}`);
    }
  }
  
  async removeProductFromCart(cartId, productId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(cartId)) {
        throw new Error("ID de carrito inválido");
      }
  
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error("ID de producto inválido");
      }
  
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
  
      // Filtrar el producto del carrito
      cart.products = cart.products.filter(
        item => item.productId.toString() !== productId
      );
  
      cart.updatedAt = new Date();
      await cart.save();
      await cart.populate('products.productId');
  
      return cart;
    } catch (error) {
      throw new Error(`Error al remover producto del carrito: ${error.message}`);
    }
  }
  
  async updateProductQuantity(cartId, productId, quantity) {
    try {
      if (!mongoose.Types.ObjectId.isValid(cartId)) {
        throw new Error("ID de carrito inválido");
      }
  
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error("ID de producto inválido");
      }
  
      if (quantity <= 0) {
        throw new Error("La cantidad debe ser mayor a 0");
      }
  
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
  
      const productIndex = cart.products.findIndex(
        item => item.productId.toString() === productId
      );
  
      if (productIndex === -1) {
        throw new Error("Producto no encontrado en el carrito");
      }
  
      cart.products[productIndex].quantity = quantity;
      cart.updatedAt = new Date();
      
      await cart.save();
      await cart.populate('products.productId');
  
      return cart;
    } catch (error) {
      throw new Error(`Error al actualizar cantidad: ${error.message}`);
    }
  }
  
  async clearCart(cartId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(cartId)) {
        throw new Error("ID de carrito inválido");
      }
  
      const updatedCart = await Cart.findByIdAndUpdate(
        cartId,
        { 
          products: [],
          updatedAt: new Date()
        },
        { new: true }
      );
  
      if (!updatedCart) {
        throw new Error("Carrito no encontrado");
      }
  
      return updatedCart;
    } catch (error) {
      throw new Error(`Error al limpiar carrito: ${error.message}`);
    }
  }
  
}

export default CartManagerMongo;

