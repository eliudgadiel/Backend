import { ProductService } from "../repositories/index.js";
import { PORT } from "../app.js"
import CustomError from "../services/errors/custom_error.js";
import EErros from "../services/errors/enums.js";
import { generateErrorInfo  } from "../services/errors/info.js";


   export const getAllProductsController = async (req, res) => {
     const result = await ProductService.getAllPaginate(req, PORT)
     res.status(result.statusCode).json(result.response)
  }

    export const getProductByIdController = async (req, res) => {
      try {
        const id = req.params.pid;
        const result = await ProductService.getById(id)
    
        if (result === null) {
          return res.status(404).json({ status: 'error', error: 'Not found' })
        }
    
        res.status(200).json({ status: 'success', payload: result })
      } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
      }
    }

    export const createProductController = async (req, res) => {
      try {
          const product = req.body;
      
     
          if (!product.title || !product.price) {
           
            CustomError.createError({
              name: "Product creacion error",
              cause: generateErrorInfo(product),
              message: "Error creacion del Product",
              code: EErros.INVALID_TYPES_ERROR
              
            })
         
     
          }
          const result = await ProductService.create(product);
          const products = await ProductService.getAll();
          req.io.emit('updatedProducts', products);
         res.send({ status: 'success', payload: result })
        } catch( error) {
            res.send({ status: 'error', payload: error })
            
      }
      
  }

    export const updateProductContoller = async (req, res) => {
      try {
        const id = req.params.pid;
        const data = req.body;
        const result = await ProductService(id, data);
    
        if (result === null) {
          return  res.status(404).json({ status: 'error', error: 'Not found' })
        }
       const products = await ProductService.getAll()
       req.io.emit('updatedProducts', products)
       res.status(200).json({ status: 'success', payload: result })
      } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
      }
    }

    export const deleteProductController = async (req, res) => {
      try {
        const id = req.params.pid;
        const result = await ProductService.delete(id);
    
        if (result === null) {
          return res.status(404).json({ status: 'error', error: 'Not found' })
        }
        const products = await ProductService.getAll()
        req.io.emit('updatedProducts', products)
        res.status(200).json({ status: 'success', payload: products })
       
      } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
      }
    }