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

### Pagina

- http://localhost:8080/products

- http://localhost:8080/products?limit=3

- http://localhost:8080/products?limit=3&page=4

- http://localhost:8080/products?stock=10


## Funcionamiento de  Mongo 

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