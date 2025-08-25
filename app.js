const express = require("express");
const productsRouter = require("./src/routes/products-router.js");
const cartsRouter = require("./src/routes/carts-router.js");
const { PORT } = require("./src/config/config.js");

const app = express();

app.use(express.json());

app.use("/", productsRouter);
app.use("/cart", cartsRouter);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
