import { ProductService } from "../repositories/index.js";
import { PORT } from "../app.js"
import CustomError from "../services/errors/custom_error.js";
import EErros from "../services/errors/enums.js";
import { generateErrorInfo  } from "../services/errors/info.js";
import { sendDeletProductEmail } from "../controllers/checkout.controller.js"

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

    export const createProductController = async (req, res, next) => {
      try {
        const product = req.body;
        product.owner = req.session.user.email

        if (!product.title || !product.price) {
          throw CustomError.createError({
            name: "Product creacion error",
            cause: generateErrorInfo(product),
            message: "Error creacion del Product",
            code: EErros.INVALID_TYPES_ERROR
          });
        }

        const result = await ProductService.create(product) 
        const products = await ProductService.getAll();
        req.io.emit('updatedProducts', products);
        res.status(201).json({ status: 'success', payload: result })
    } catch (error) {
        
        next(error);
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
        const id = req.params.pid
        
        if (req.session.user.role === 'admin') {
          // Administrador eliminando producto
          const product = await ProductService.getById(id);
          const ownerEmail = product.owner;
    
          // Enviar correo al dueño
          await sendDeletProductEmail(ownerEmail); 
   
        } else if (req.session.user.role === 'premium') {
            const product = await ProductService.getById(id)
         
            if (product.owner !== req.session.user.email) {
                return res.status(403).json({ status: 'error', error: 'Not Authorized' })
            }
          
        // envia un correo al usuario deño del producto
        await sendDeletProductEmail(product.owner); 
      }  
        const result = await ProductService.delete(id)

        if (result === null) {
            return res.status(404).json({ status: 'error', error: 'Not found' })
        }
         // Obtener la lista actualizada de productos
        const products = await ProductService.getAll()

           // Emitir evento para actualizar productos en tiempo real
          req.io.emit('updatedProducts', products)

        res.status(200).json({ status: 'success', payload: products })
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ status: 'error', error: 'Internal Server Error' });
  }
}