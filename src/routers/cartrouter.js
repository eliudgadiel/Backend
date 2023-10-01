import { Router } from "express";
import cartModel from "../dao/models/cart.model.js";
import productModel from "../dao/models/product.model.js"


const router = Router()


export const getProductsFromCart = async (req, res) => {
  try {
    const id = req.params.cid
    const result = await cartModel.findById(id).populate('products.product').lean()
    if (result === null) {
      return {
        statusCode: 404,
        response: { status: 'error', error: 'not found'}
      }
    }
    return {
      statusCode: 200,
      response: { status: 'success', payload: result}
    }
  }  catch (err) {
    return {
      statusCode: 500,
      response: { status: 'error', error: err.message}
    }
  }
}


router.post('/',  async (req, res) => {
   try {
    const result = await cartModel.create({})
    res.status(201).json({ status: 'success', payload: result})
   } catch(err) {
    res.status(500).json({ status: 'error', error: err.message})
   }
})

router.get('/:cid',  async (req, res) => {
   const result = await getProductsFromCart(req, res)
   res.status(result.statusCode).json(result.response)
})

router.post('/:cid/product/:pid', async (req, res) => {
try {
  const cid = req.params.cid
  const pid = req.params.pid
  const cartToUpdate = await cartModel.findById(cid)
  if (cartToUpdate === null) {
    return res.status(404).json({ status: 'error', error: `Cart with id=${cid} not found` })
  }
  const productToAdd = await productModel.findById(pid)
  if (productToAdd == null)
  return res.status(404).json({ status: 'error', error: `Product with id=${pid} not found` })

  
  const newProduct = {
    product: productToAdd._id,
    title: productToAdd.title,
    price: productToAdd.price,
    stock: productToAdd.stock,
    description: productToAdd.description,
    code: productToAdd.code,
    category: productToAdd.category,
    quantity: 1,
  };

  cartToUpdate.products.push(newProduct);

  await cartToUpdate.save();

  const updatedCart = await cartModel.findById(cid);
  const payload = updatedCart; 

  return res.status(200).json({ status: 'success', payload: payload });
} catch (error) {
  console.error(error);
  return res.status(500).json({ status: 'error', error: 'Internal server error' });
}
});



  router.delete('/:cid/product/:pid',  async (req, res) => {
    try {
      const cid = req.params.cid
      const pid = req.params.pid
      const carToupdate = await cartModel.findById(cid)
      if (carToupdate === null) {
        return res.status(404).json({ status: 'error', error: `Cart with id=${cid} not found` })
      }
      const productDelete = await productModel.findById(pid)
      if (productDelete === null ) {
        return res.status(404).json({ status: 'error', error: `Product with id=${pid} Not found`})
      }
      const productIndex = carToupdate.products.findIndex(item => item.product == pid)
      if (productIndex === -1) {
        return res.status(400).json({ status: 'error', error: `Product with id=${pid} Not found in Cart with id=${cid}`})
      } else {
        carToupdate.products = carToupdate.products.filter(item => item.product.toString() !== pid)
      }
      const result = await cartModel.findByIdAndUpdate(cid, carToupdate, { returnDocument: 'after'})
      res.status(200).json({ status: 'success', payload: result})
    } catch(err) {
      res.status(500).json({ status: 'error', erorr: err.message})
    }
  })
  

router.put('/:cid',  async (req, res) => {
  try {
    const cid = req.params.cid
    const cartToUpdate = await cartModel.findById(cid)
    if (cartToUpdate === null) {
      return res.status(404).json({status: 'error', error: `Cart with id=${cid} not dound` })
    }
    const products = req.body.products
    if (!products){
    return res.status(400).json({status: 'error', error: 'Filed products is not optional' })
  }
  for (let index = 0; index < products.length; index++) {
   if (!products[index].hasOwnProperty('product') || !products[index].hasOwnProperty('quantity'))
   return res.status(400).json({status: 'error', error: 'Product must have a valid id and a valid quantity' })
 
  if (typeof products[index].quantity !== 'number') {
    return res.status(400).json({status: 'error', error: 'product quantity must be a number' })
  }
  if ( products[index].quantity === 0) {
    return res.status(400).json({status: 'error', error: 'product quantity cannot be 0' })
  }
  const productToAdd = await productModel.findById(products[index].product)
  if (productToAdd === null) {
    return res.status(400).json({status: 'error', error: `Product with id=${products[index].product} doesnot exist. we cannot ` })
  }
} 
    cartToUpdate.products = products
const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, { returnDocument: 'after'})
res.status(200).json({ status: 'succes', payload: result})
  } catch(err) {
    res.status(500).json({ status: 'error', error: err.message})
  }

})


router.put('/:cid/product/:pid',  async (req, res) => {
  try {
    const cid = req.params.cid
    const pid = req.params.pid
    const cartToUdate = await cartModel.findById(cid)
    if (cartToUdate === null) {
      return res.status(404).json({ status: 'error', error: `Cart with id=${cid} not found` })
    }
    const productToUpdate = await productModel.findById(pid)
    if (productToUpdate === null) {
    return res.status(404).json({ status: 'error', error: `Product with id=${pid} not found` })
  }
  const quantity = req.body.quantity
  if (!quantity) {
    return res.status(404).json({ status: 'error', error: 'field quantity is not optional' })
  }
  if (typeof quantity !== 'number'){
    return res.status(400).json({ status: 'error', error: 'product quatity must be a number'})
  }
  if (quantity === 0) {
    return res.status(400).json({ status: 'error', error: 'product quatity cannot be 0'})
  }

} catch (error) {
 
  return res.status(500).json({ status: 'error', error: 'Internal server error' });
}
  
})



router.delete('/:cid',   async (req, res) => {
  try {
    const cid = req.params.cid
    const cartToUpdate = await cartModel.findById(cid)
    if (cartToUpdate === null) {
      return res.status(400).json({ status: 'error', error: `Cart with id=${cdi} not found`})
    }
    cartToUpdate.products = []
    const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, { returnDocument: 'after'})
    res.status(200).json({ status: 'success', payload: result})
  } catch(err) {
    res.status(500).json({ status: 'error', error: err.message})
  }
})

  export default router;