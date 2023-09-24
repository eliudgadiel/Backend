import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose'
import cartrouter from './routers/cartrouter.js'
import productrouter from './routers/productrouter.js'
import viewrouter from './routers/viewrouter.js'
import chatrouter from './routers/chatrouter.js'
import { setupChat } from './routers/chatrouter.js';


const MONGO_URI = 'mongodb://0.0.0.0:27017'
const MONGO_DB_NAME = 'ecommerce'
export const PORT = 8080

const app = express();
app.use(express.json())
app.use(express.static('./src/public'))

// setear handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')


try {
  await mongoose.connect(MONGO_URI, {
   dbName: MONGO_DB_NAME ,
   useUnifiedTopology: true
  })
  console.log('DB connected');
  const server = app.listen(PORT, () => console.log('server up'))
  const io = new Server(server)
  app.use((req, res, next) => {
    req.io = io
    next()
  })

  setupChat(io);

app.get('/', (req, res) => res.render('index'))
app.use('/api/products', productrouter)
app.use('/api/carts', cartrouter)
app.use('/products', viewrouter )
app.use('/carts', viewrouter)
app.use('/chat', chatrouter)

} catch(err){
  console.log('Cannot connet to DB', err.message)
  process.exit(-1)
}





