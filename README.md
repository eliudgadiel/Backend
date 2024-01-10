# Proyecto de Backquend
Funcionalidad y Rutas de la App.

## Rutas Productos
### Get

- http://localhost:8080/api/products = Trae todos los productos.

- http://localhost:8080/api/products?limit=2 = Devuelve por parametro la cantidad de productos que le pidas.

### Delete

- http://localhost:8080/api/products/2 = Elimina el producto y si el producto no existe sale status (404). y si buscas el producto eliminado no lo consigue y sale status (404).

### Put

- http://localhost:8080/api/products/5 = Edita cualquier producto por el parametro que le indiques.

## Carts
### Post

- http://localhost:8080/api/carts = Crea un carrito con su id y un array vacio.

- http://localhost:8080/api/carts/1/product/2 = Agrega un producto al carrito y si agregas el mismo producto se suma el producto en el quantity. si le das id del carro que no existe sale status (404), o un producto que no existe sale status (404).
 
 ### Get

- http://localhost:8080/api/carts/1 = Muestra los el carrito con su productos, si le pasa un id incorrecto sale status (404).



## Websockets Agregar y Eliminar un Producto

### Rutas

- http://localhost:8080/products

- http://localhost:8080/products/realTimeProducts 


## Funcionamiento de  Mongo 


### Pagina

- http://localhost:8080/products

- http://localhost:8080/products?limit=3

- http://localhost:8080/products?limit=3&page=4

- http://localhost:8080/products?stock=10


### api/product

http://localhost:8080/api/products
http://localhost:8080/api/products?limit=3
http://localhost:8080/api/products?limit=3&page=4
http://localhost:8080/api/products?limit=3&page=3sort=asc
http://localhost:8080/api/products?&sort=asc
http://localhost:8080/api/products?&sort=desc
http://localhost:8080/api/products?category=hombre o mujer

### api/carts

- post/ http://localhost:8080/api/carts
- get/ http://localhost:8080/api/carts/65107b3b535f894c489137d4
- post/ http://localhost:8080/api/carts/651081c91ee3ebcb0bd48362/product/65106221b0e9a850d0a5ac90
- delete/ http://localhost:8080/api/carts/651081c91ee3ebcb0bd48362/product/65106221b0e9a850d0a5ac90
- put/ http://localhost:8080/api/carts/651081c91ee3ebcb0bd48362

- put/ http://localhost:8080/api/carts/651081c91ee3ebcb0bd48362/product/65106221b0e9a850d0a5ac94
- este put no me funciono.. por que el thunder cLient se quedaba cargando reinicie la pc. todo y sigue igual. sino le funciona me avisa tutor

- delete/ http://localhost:8080/api/carts/651081c91ee3ebcb0bd48362


### Checkout y Ticket

- Despues de agregar los productos en el carro y precionas en el boton de comprar, hace un checkout y lo envia por correo y sale un alert con los los tus datos con los productos que compraste y pide tu numero de telefono para enviarte un mensaje a tu celular.

- Genera ticket de los datos de la compra 

### Capas, Dao y Endpoints

- Esta separado por capas
- Contiene sus archivos DAO
- Los endpoints estan protegidos por roles
- Contiene DTO para que solo tengo algunos detos personales ruta /profile

### Mocking y Manejo de errores

-  /mockingproducts Ruta para la repuesta de 50 productos.
- /products/realTimeProducts Ruta para creacion de productos  y manejos de errores. 


### Logger

- Ruta o endpoint, para ver los logger /loggerTest.
- El servidor en general esta implementado el logger de winston.
- Sepuede ejecutar el proyecto en etorno desarrollo y productivo, esta implementado los diferentes logger segun el entorno.

### Recuperacion de contraseña por correo, e Impletacion de Owener para el user Premium

- Por medio de un correo, te direcciona a ruta para que puedas recuperar tu contraseña.
- Link del correo  expira después de 1 hora de enviado.
- Si  trata de restablecer la contraseña con la misma contraseña del usuario,  impede e indica que no se puede colocar la misma contraseña.
- Establece un nuevo rol para el schema del usuario llamado “premium” el cual estará habilitado también para crear productos.
- El schema de producto cuenta con un campo “owner”, el cual haga referencia a la persona que creó el producto.
- El campo owner  guarda sólo el _id  del usuario que lo haya creado.
- El usuario premium sólo pueda borrar los productos que le pertenecen.
El admin pueda borrar cualquier producto
- El usuario premium NO pueda agregar a su carrito un producto que le pertenece.
-  La ruta /session/premium/:uid  la cual permite cambiar el rol de un usuario, de “user” a “premium” y viceversa.

## Swagger

### Carts

- GET /carts Get all carts
- POST /carts Create a new cart
- GET /carts/{cartId} Get a cart by ID
- PUT /carts/{cartId} Update a cart by ID
- DELETE /carts/{cartId} Delete a cart by ID
- DELETE /carts/{cartId}/items/{itemId} Delete an item from the cart

### Products

- GET /products Get all Products
- POST /products create a new product
- GET /productsid/{productId} Get a product by ID
- PUT /productseditbyid/{productId} Update a product by ID
- DELETE /productsdeletebyid/delete/{productId} Delete a product by ID

### Schemas

- Cart
- Product

## Test

- Para ejecutar el test = pm run test

## Configuración del Entorno

- Para ejecutar este proyecto, necesitarás configurar las siguientes variables de entorno. Puedes crear un archivo `.env` en la raíz del proyecto y copiar las siguientes líneas, reemplazando los valores con los tuyos:

- PORT=
- MONGO_URI=
- MONGO_DB_NAME=
- PERSISTENCE=
- ADMIN_EMAIL=
- ADMIN_PASS=
- GITHUB_CLIEN_ID=
- GITHUB_CLIENT_SECRET=
- GITHUB_CALLBACK_URL=
- NODEMAILER_USER=      
- NODEMAILER_PASS=
- TWILIO_ACCOUNT_SID=A
- TWILIO_AUTH_TOKEN=
- TWILIO_PHONE_NUMBER=
- ENVIRONMENT=

