import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose'
import session from 'express-session';
import MongoStore from 'connect-mongo';
import Sockets from './sockets.js'
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import config from "./config/config.js"
import logger from './logger.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express'

import cartrouter from './routers/cartrouter.js'
import productrouter from './routers/productrouter.js'
import viewrouter from './routers/viewrouter.js'
import chatrouter from './routers/chatrouter.js'
import loggerrouter from './routers/routerlogger.js';
import sessionviewrouter from './routers/session.view.router.js'
import sessionrouter from './routers/sessionrouter.js'
import checkoutrouter  from './routers/checkoutrouter.js';
import generateProductrouter  from './routers/generateProduct.reouter.js';
import errorHandler from './middlewares/error.js'

export const swaggerOptions = {
  definition: {
    openapi: '3.1.0',
    info: {
    title: 'Ecommerce Look Fashion',
    description: ' Esta API proporciona acceso a los recursos de una tienda de ropa online, incluyendo productos, categorías, carrito de compras, y más.',
    version: '1.0.0',
  }
  },
  apis: [
    `./docs/**/*.yaml`,
  ],
}
const specs = swaggerJsdoc(swaggerOptions)

const MONGO_URI = config.mongo.uri
const MONGO_DB_NAME = config.mongo.dbname
export const PORT = config.apiserver.port


const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/docs', swaggerUiExpress.serve,swaggerUiExpress.setup(specs));

app.use(session ({
  store: MongoStore.create({
    mongoUrl: MONGO_URI,
    dbName: MONGO_DB_NAME
  }),
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())


// setear handlebars
app.use(express.static('./src/public'))
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')


try {
  await mongoose.connect(MONGO_URI , {
   dbName: MONGO_DB_NAME ,
   useUnifiedTopology: true
  })
  logger.info('DB connected');
  const server = app.listen(PORT, () => logger.http('server up'))
  const io = new Server(server)
  app.use((req, res, next) => {
    req.io = io
    next()
  })


app.use('/', sessionviewrouter)
app.use('/api/products', productrouter)
app.use('/api/carts', cartrouter)
app.use('/session', sessionrouter)
app.use('/products', viewrouter )
app.use('/carts', viewrouter)
app.use('/chat', chatrouter)
app.use('/checkout', checkoutrouter)
app.use('/mockingproducts', generateProductrouter)
app.use('/loggerTest', loggerrouter)
app.use(errorHandler)


Sockets(io)

} catch(err){
  logger.error('Cannot connet to DB', err.message)
  process.exit(-1)
}





