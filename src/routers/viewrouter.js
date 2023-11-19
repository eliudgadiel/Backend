import { Router } from "express";
import { publicRouter,  handlePolicies } from "../middlewares/auth.middleware.js";
import { getViewProductController, getViewRealTimeProductsController, getViewProductByIdController } from "../controllers/view.controller.js"

const router = Router()

router.get("/", publicRouter, handlePolicies(['USER', 'ADMIN']), getViewProductController) 
router.get('/realTimeProducts', handlePolicies(['USER', 'ADMIN']), getViewRealTimeProductsController) 
router.get('/:cid', handlePolicies(['USER', 'ADMIN']), getViewProductByIdController)

export default router