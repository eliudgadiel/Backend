import { Router } from "express";
import ProductManager from "../productManager.js"



const router = Router()
const productManager = new ProductManager('./data/products.json');


  router.get('/', async (req, res) => {
  const result = await productManager.getProducts()
  const limit = req.query.limit
  if (typeof result == 'string'){
    const error = result.split(' ')
    return res.status(parseInt(error[0].split(1,4))).json({ error: result.split(6) })
  }
  res.status(200).json({ payload: result.slice(0, limit)})
  });

router.get('/:pid', async (req, res) => {
 const id = req.params.pid
 const products = await productManager.getProductById(id)

 if (!products || Object.keys(products).length === 0) {
   return res.status(404).json({ error: "Product not found"})
 }
 res.status(200).json({ payload: products })
});

router.post('/', async (req, res) => {
    const product = req.body
    const result = await productManager.addProduct(product)
    if (typeof result == "string") {
        const error = result.split(' ')
        return res.status(parseInt(error[0].slice(1,4))).json({ error: result.slice(6)})
    }
    res.status(200).json({ status: 'success', payload: result })
})

router.put('/:pid', async (req, res) => {
  const pid = req.params.pid
  const updatedFields = req.body;

  const result = await productManager.updateProduct(pid, updatedFields); 

  if (typeof result === "string") {
    const error = result.split(' ');
    return res.status(404).json({ error: result.slice(6) });
  }
  res.status(200).json({ status: 'success', payload: result });
});


router.delete('/:pid', async (req, res) => {
  const id = req.params.pid;

  const updatedProducts = await productManager.deleteProduct(id); 

  if (Array.isArray(updatedProducts)) {
    res.status(200).json(updatedProducts); // Envía la lista actualizada de productos
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});


export default router;