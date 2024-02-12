import { Router } from "express";
import {deleteCart, createCartContoller, getCartByIdContoller, createCartProductController, deleteCartProductController, updateProductCartContoller, deleteCartcontroller, updateProductQtyFromCartController, purchaseController } from "../controllers/cart.controller.js"



const router = Router()

router.post('/', createCartContoller)
router.get('/:cid', getCartByIdContoller)
router.post('/:cid/product/:pid',  createCartProductController)
router.delete('/:cid/product/:pid', deleteCartProductController)
router.put('/:cid', updateProductCartContoller)
router.put('/:cid/product/:pid', updateProductQtyFromCartController)
router.delete('/:cid', deleteCartcontroller)
router.get('/:cid/purchase', purchaseController)
router.delete('/:cid', deleteCart)


  export default router;