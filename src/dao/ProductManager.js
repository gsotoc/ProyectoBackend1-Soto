const fs = require("fs");
const { getFilePath } = require("../config/config");

class ProductManager {
  constructor() {
    this.path = getFilePath("products.json");
  }

  async getProducts() {
    const data = await fs.promises.readFile(this.path, "utf-8");
    return JSON.parse(data);
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id === id);
  }

  async addProduct(product) {
    const products = await this.getProducts();
    products.push(product);
    await this.saveProducts(products);
  }

  async updateProduct(id, updates) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
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
