const express = require("express");
const { engine } = require("express-handlebars");
const productsRouter = require("./src/routes/productsRouter.js");
const cartsRouter = require("./src/routes/cartsRouter.js");
const { PORT } = require("./src/config/config.js");
const ProductManager = require("./src/dao/ProductManager.js");
const path = require("node:path");
const http = require("node:http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);
const io = new Server(server);

const productManager = new ProductManager();

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "src", "views"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "src", "public")));

// Routers
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Vistas
app.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("home", { products });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.render("home", { products: [], error: "Error al cargar productos" });
  }
});

app.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", { products });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.render("realTimeProducts", { products: [], error: "Error al cargar productos" });
  }
});

// Websockets
io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado ✅");

  try {
    const products = await productManager.getProducts();
    socket.emit("updateProducts", products);

    // Escuchar creación de producto
    socket.on("createProduct", async (product) => {
      try {
        if (!product.title || !product.description || !product.code || 
            !product.price || !product.stock || !product.category) {
          socket.emit("error", { message: "Todos los campos son obligatorios" });
          return;
        }

        if (product.price <= 0) {
          socket.emit("error", { message: "El precio debe ser mayor a 0" });
          return;
        }

        if (product.stock <= 0) {
          socket.emit("error", { message: "El stock debe ser mayor o igual a 1" });
          return;
        }

        // Agregar el producto
        await productManager.addProduct(product);
        const updated = await productManager.getProducts();
        
        // Emitir a todos los clientes conectados
        io.emit("updateProducts", updated);
        socket.emit("productCreated", product);
        
        console.log("Producto creado:", product.title);
      } catch (error) {
        console.error("Error al crear producto:", error);
        socket.emit("error", { message: "Error al crear el producto" });
      }
    });

    // Escuchar eliminación de producto
    socket.on("deleteProduct", async (id) => {
      try {
        if (!id) {
          socket.emit("error", { message: "ID de producto requerido" });
          return;
        }

        const deleted = await productManager.deleteProduct(id);
        
        if (!deleted) {
          socket.emit("error", { message: "Producto no encontrado" });
          return;
        }

        const updated = await productManager.getProducts();
        
        io.emit("updateProducts", updated);
        socket.emit("productDeleted", id);
        
        console.log("Producto eliminado:", id);
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        socket.emit("error", { message: "Error al eliminar el producto" });
      }
    });

    // Escuchar actualización de producto
    socket.on("updateProduct", async ({ id, updates }) => {
      try {
        if (!id) {
          socket.emit("error", { message: "ID de producto requerido" });
          return;
        }

        if (!updates || Object.keys(updates).length === 0) {
          socket.emit("error", { message: "Debes proporcionar al menos un campo para actualizar" });
          return;
        }

        // Validaciones de los campos actualizados
        if (updates.price !== undefined && updates.price <= 0) {
          socket.emit("error", { message: "El precio debe ser mayor a 0" });
          return;
        }

        if (updates.stock !== undefined && updates.stock < 0) {
          socket.emit("error", { message: "El stock no puede ser negativo" });
          return;
        }

        // Verificar si el producto existe
        const existingProduct = await productManager.getProductById(id);
        if (!existingProduct) {
          socket.emit("error", { message: "Producto no encontrado" });
          return;
        }

        // Si se está actualizando el código, verificar que no exista otro producto con ese código
        if (updates.code && updates.code !== existingProduct.code) {
          const products = await productManager.getProducts();
          const codeExists = products.some(p => p.id !== id && p.code === updates.code);
          if (codeExists) {
            socket.emit("error", { message: "Ya existe un producto con ese código" });
            return;
          }
        }

        const updatedProduct = await productManager.updateProduct(id, updates);
        
        if (!updatedProduct) {
          socket.emit("error", { message: "Error al actualizar el producto" });
          return;
        }

        const allProducts = await productManager.getProducts();
        
        // Emitir a todos los clientes conectados
        io.emit("updateProducts", allProducts);
        socket.emit("productUpdated", updatedProduct);
        
        console.log("Producto actualizado:", updatedProduct.title);
      } catch (error) {
        console.error("Error al actualizar producto:", error);
        socket.emit("error", { message: error.message || "Error al actualizar el producto" });
      }
    });

    // Manejar desconexión
    socket.on("disconnect", () => {
      console.log("Cliente desconectado ❌");
    });

  } catch (error) {
    console.error("Error en conexión de socket:", error);
    socket.emit("error", { message: "Error de conexión" });
  }
});

// Manejo de errores del servidor
server.on("error", (error) => {
  console.error("Error del servidor:", error);
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});