import express from 'express';
import handlebars from 'express-handlebars';
import cartrouter from './routers/cartrouter.js'
import productrouter from './routers/productrouter.js'
import viewrouter from './routers/viewrouter.js'
import { Server } from 'socket.io';



const app = express();

// setear handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')

app.use(express.json())
app.use('/api/products', productrouter)
app.use('/api/carts', cartrouter)
app.use('/', viewrouter )




const httpServer = app.listen(8080, () => console.log('server Up')) 
const socketServer = new Server(httpServer)

import ProductManager from "../productManager.js"
const  productssocket = new ProductManager('./data/products.json');

socketServer.on('connection',async (socketClient) => {
    console.log(`nuevo cliente conectado: ${socketClient.id}`)
   const listadeproductos = await productssocket.getProducts({})
     socketServer.emit('enviarProducts', listadeproductos)
    
})