import mongoose from "mongoose";
import Product from "../models/Products.js";

class ProductManagerMongo {
  async getProducts({ limit = 10, page = 1, sort, query, available, baseUrl = "/api/products" } = {}) {
    try {
      const filter = {};

      if (available === "true") {
        filter.status = true;
      }

      if (query) {
        filter.$or = [
          { title: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } }
        ];
      }

      let sortOption = {};
      if (sort) {
        sortOption.price = sort === "asc" ? 1 : -1;
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: Object.keys(sortOption).length > 0 ? sortOption : undefined,
        lean: true,
      };

      const result = await Product.paginate(filter, options);

      const buildLink = (targetPage) => {
        const params = new URLSearchParams();
        params.set('page', targetPage);
        params.set('limit', limit);
        if (sort) params.set('sort', sort);
        if (query) params.set('query', query);
        if (available === "true") params.set('available', 'true');
        
        return `${baseUrl}?${params.toString()}`;
      };

      const prevLink = result.hasPrevPage ? buildLink(result.prevPage) : null;
      const nextLink = result.hasNextPage ? buildLink(result.nextPage) : null;

      return {
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: prevLink,
        nextLink: nextLink
      };
    } catch (error) {
      console.error('ERROR en getProducts:', error);
      return {
        status: "error",
        message: error.message,
      };
    }
  }

  //Unicamente utilizo este método en websockets ya que ahí si muestro todos los productos sin paginación
  async getAllProducts() {
    try {
      const products = await Product.find().lean();
      return products.map(product => ({
        ...product,
        id: product._id.toString()
      }));
    } catch (error) {
      throw new Error(`Error al obtener todos los productos: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("ID inválido");
      }

      const product = await Product.findById(id).lean();
      if (!product) {
        throw new Error("Producto no encontrado");
      }

      return product;
    } catch (error) {
      throw new Error(`Error al obtener producto: ${error.message}`);
    }
  }

  async addProduct(product) {
    try {
      const existingProduct = await Product.findOne({ code: product.code.toUpperCase() });
      if (existingProduct) throw new Error("Ya existe un producto con ese código");

      if (product.stock === 0) {
        product.status = false;
      }

      const newProduct = new Product(product);
      const savedProduct = await newProduct.save();

      return { ...savedProduct.toObject(), id: savedProduct._id.toString() };
    } catch (error) {
      if (error.code === 11000) throw new Error("Ya existe un producto con ese código");
      throw new Error(`Error al crear producto: ${error.message}`);
    }
  }

  async updateProduct(id, updates) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("ID inválido");

      if (updates.code) {
        const existingProduct = await Product.findOne({
          code: updates.code.toUpperCase(),
          _id: { $ne: id },
        });
        if (existingProduct) throw new Error("Ya existe un producto con ese código");
      }

      if (updates.stock !== undefined) {
        if (updates.stock === 0) {
          updates.status = false;
        } else if (updates.stock > 0 && updates.status === undefined) {
          updates.status = true;
        }
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

      if (!updatedProduct) throw new Error("Producto no encontrado");

      return { ...updatedProduct.toObject(), id: updatedProduct._id.toString() };
    } catch (error) {
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("ID inválido");

      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) throw new Error("Producto no encontrado");

      return true;
    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  }
}

export default ProductManagerMongo;