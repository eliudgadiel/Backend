import express from 'express';
import cartrouter from './routers/cartrouter.js'
import productrouter from './routers/productrouter.js'



const app = express();
app.use(express.json())
app.use('/api/products', productrouter)
app.use('/api/carts', cartrouter)

app.listen(8080, () => console.log('server Up')) 