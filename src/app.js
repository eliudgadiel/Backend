import express from 'express';
import handlebars from 'express-handlebars';
import cartrouter from './routers/cartrouter.js'
import productrouter from './routers/productrouter.js'
import viewrouter from './routers/viewrouter.js'
import { Server } from 'socket.io';



const app = express();
app.use(express.json())
app.use(express.static('./src/public'))

// setear handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')


app.get('/', (req, res) => res.render('index'))
app.use('/api/products', productrouter)
app.use('/api/carts', cartrouter)
app.use('/products', viewrouter )




const server = app.listen(8080, () => console.log('server Up')) 
const io = new Server(server)


io.on('connection', socket => {
    console.log(`nuevo cliente conectado`)
    socket.on('productList', data => {
      io.emit('updatedProducts', data)
    }) 
})