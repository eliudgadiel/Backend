import { Router } from "express";
import ProductManager from "../productManager.js"

const router = Router()

const productManager = new ProductManager('./data/products.json');

router.get("/", async (req, res) => {
    const products = await productManager.getProducts()
    res.render("home", { products })
    }) 

router.get('/realTimeProducts', async (req, res) => {
    const products = await productManager.getProducts()
res.render('realTimeProducts', { products })
}) 


export default router