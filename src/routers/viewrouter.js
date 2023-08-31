import { Router } from "express";
import ProductManager from "../productManager.js"

const router = Router()

const productManager = new ProductManager('./data/products.json');

router.get("/", async (req, res) => {
    const products = await productManager.getProducts({})
    res.render("home", { products })
    }) 

router.get("/realtimeproducts", (req, res) => {
res.render("realtimeproducts", { products })
}) 




export default router