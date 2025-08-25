const { v4: uuidv4 } = require('uuid');
const ProductManager = require("../dao/ProductManager");
const productManager = new ProductManager();

exports.getAll = async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
};

exports.getById = async (req, res) => {
  const { pid } = req.params;
  const product = await productManager.getProductById(pid);
  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  res.json(product);
}

exports.create = async (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const newProduct = {
    id: uuidv4(),
    title,
    description,
    code,
    price,
    status: status !== undefined ? status : true,
    stock,
    category,
    thumbnails: thumbnails || []
  };

  await productManager.addProduct(newProduct);
  res.status(201).json(newProduct);
}

exports.update = async (req, res) => {
  const { pid } = req.params;
  const updates = req.body;

  const updatedProduct = await productManager.updateProduct(pid, updates);
  if (!updatedProduct) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  
  res.json(updatedProduct);
}   

exports.delete = async (req, res) => {
  const { pid } = req.params;

  const deleted = await productManager.deleteProduct(pid);
  if (!deleted) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  res.json({ message: 'Producto eliminado correctamente' });
}   