# ProyectoBackend1-Soto

Este proyecto es el backend de una aplicación, desarrollado por gsotoc.

## Requisitos

- [Node.js](https://nodejs.org/) instalado en tu computadora.
- [npm](https://www.npmjs.com/) (normalmente viene con Node.js).
- Postman.

## Instalación

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/gsotoc/ProyectoBackend1-Soto.git
   cd ProyectoBackend1-Soto
   ```

2. **Instala las dependencias:**

   ```bash
   npm install
   ```

## Ejecución

Para iniciar el proyecto en tu PC, ejecuta el siguiente comando:

```bash
node app.js
```

## Configuración

Idealmente deberías crearte una variable de entorno para elegir el puerto a usar, de momento el puerto está harcodeado para que sea el 8080.



---

¡Listo! Ahora ya sabes cómo instalar y ejecutar el proyecto en tu PC.



****Para asegurarnos de que todo funciona correctamente usaremos Postman!****

Para consumir los datos de productos deberías usar las rutas en Postman:

   **Método get:**
- http://localhost:PORT - Para obtener todos los productos.
- http://localhost:PORT/pid - Para obtener un único producto por su pid(product id).
  
   **Método put:**
- http://localhost:PORT/pid - Para editar un producto y en el body se debe pasar un objeto con con la información a actualizar. Ejemplo:

   {
      "price": x
   }

  **Método post:**
- http://localhost:PORT - Para agregar un nuevo producto, en el body se debe pasar el objeto a agregar sin el productID ya que estos se generan automaticamente. Ejemplo:

  {
    "title": "Kawasaki Ninja 400",
    "description": "Moto deportiva de media cilindrada.",
    "code": "MOT-001",
    "price": 9000,
    "status": true,
    "stock": 7,
    "category": "Motos",
    "thumbnails": [
        "images/kawasaki-ninja400.jpg"
    ]
}

   **Método delete:**
- http://localhost:PORT/pid - Para eliminar un producto




** ** Para consumir los datos de carritos deberías usar las rutas en Postman:****

     **Método get:**
  - http://localhost:PORT/cid - Para obtener un carrito de compras mediante su cid(cartID), de momento hay uno creado que puede usar con id: "c93d603f-d5ab-4d1c-b8d2-b217a3f952f1". Pero sino puedes crear el tuyo antes y se le asignará un ID automático.
 
     **Método post:**
  - http://localhost:PORT - Para crear un carrito de compras. El id se creará automaticamente pero en el body de la request debemos pasar un array de productos con el siguiente formato. Se suguiere usar productIds de productos ya agregados al products.json, por ejemplo, "c3401e79-7404-4c0f-a1a1-2822cc39990a" o "1cad98df-0edd-47a1-8f42-564fb34c5dba".

 [
      {
        "productId": "id",
        "quantity": quantity
      }
    ].

   **Método put:**
- http://localhost:PORT/cid/product/pid - Para actualizar el carrito de compras necesitamos el ID del mismo y del producto a actualizar. En el body de la request debemos pasar un objeto con la cantidad de productos a actualizar. De momento solo se puede agregar más productos. Ejemplo:

  {
     "quanity": x
  }

