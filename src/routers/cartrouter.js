import { Router } from "express";
import CartManager from "../cartManager.js"
import { productManager } from "../cartManager.js";

const router = Router()
const cartManager = new CartManager('./data/carts.json');

router.post('/', async (req, res) => {
    const result = await cartManager.createCart()
    if (typeof result == 'string' ){
        const error = result.split(' ')
        return res.status(parseInt(error[0].slice(1,4))).json({ error: result.slice(6) })
    }
res.status(200).json({ status: 'success', payload: result})
})

router.get('/:cid', async (req, res) => {
    const id = parseInt(req.params.cid)
    const result = await cartManager.getProductsFromCart(id)
    if (typeof result == 'string'){ 
    const error = result.split(' ')
    return res.status(404).json({ error: result.slice(6) });
}
res.status(200).json({ status: 'success', payload: result})
})

router.post('/:cid/product/:pid', async (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = req.params.pid;
  
    // Verificar si el carrito con el ID cid existe
    const cart = await cartManager.getProductsFromCart(cid);
    if (typeof cart === 'string') {
      const error = cart.split(' ');
      return res.status(404).json({ error: `Cart with ID=${cid} was not found` });
    }
  
    // Verificar si el producto con el ID pid existe
    const product = await productManager.getProductById(pid);
    if (!product) {
      return res.status(404).json({ error: `Product with ID=${pid} was not found` });
    }
  
    // Agregar el producto al carrito y actualizar el archivo
    const result = await cartManager.addProductToCart(cid, pid);
  
    res.status(200).json({ status: 'success', payload: result });
  });
  
  
  
  export default router;