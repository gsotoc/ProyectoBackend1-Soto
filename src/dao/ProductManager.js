const fs = require("node:fs");
const { getFilePath } = require("../config/config");
const { v4: uuidv4 } = require("uuid");

class ProductManager {
  constructor() {
    this.path = getFilePath("products.json");
  }

  async getProducts() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      // Si el archivo no existe, crear uno vacío
      if (error.code === 'ENOENT') {
        await fs.promises.writeFile(this.path, JSON.stringify([]));
        return [];
      } else {
        throw error;
      }
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id === id);
  }

  async addProduct(product) {
    const products = await this.getProducts();
    
    // Verificar que el código no se repita
    const existingProduct = products.find(p => p.code === product.code);
    if (existingProduct) {
      throw new Error(`Ya existe un producto con el código: ${product.code}`);
    }
    
    // Generar ID único si no se proporciona
    if (!product.id) {
      product.id = uuidv4();
    }
    
    products.push(product);
    await this.saveProducts(products);
    return product; // Retornamos el producto con el ID generado
  }

  async updateProduct(id, updates) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    // No permitir actualizar el ID
    delete updates.id;
    
    products[index] = { ...products[index], ...updates };
    await this.saveProducts(products);
    return products[index];
  }

  async deleteProduct(id) {
    let products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return false;
    products.splice(index, 1);
    await this.saveProducts(products);
    return true;
  }

  async saveProducts(products) {
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
  }
}

module.exports = ProductManager;