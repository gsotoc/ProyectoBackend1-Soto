const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { getFilePath } = require("../config/config");

class CartManager {
  constructor() {
    this.path = getFilePath("carts.json");
  }

  async getCarts() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
        /*ENOENT significa "Error NO ENTry" - No such file or directory, puedo hacer esto de otra forma?*/ 
      if (error.code === 'ENOENT') {
        await fs.promises.writeFile(this.path, JSON.stringify([]));
        return [];
      } else {
        throw error;
      }
    }
  }

  async createCart(products) {
    const carts = await this.getCarts();

    const newCart = {
      id: uuidv4(),
      products: products,
      createdAt: new Date()
    };

    carts.push(newCart);

    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));

    return newCart;
  }

  async getCartById(cartId) {
    const carts = await this.getCarts();
    return carts.find(cart => cart.id === cartId);
  }

  async updateCart(cartId, newProducts) {
    const carts = await this.getCarts();
    const index = carts.findIndex(cart => cart.id === cartId);

    if (index === -1) {
      return null;
    }

    carts[index].products = newProducts;
    carts[index].updatedAt = new Date();

    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));

    return carts[index];
  }
}

module.exports = CartManager;
