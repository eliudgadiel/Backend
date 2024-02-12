import Stripe from 'stripe'
import config from '../config/config.js';
import { CartService } from "../repositories/index.js"
import ticketModel from '../models/ticket.model.js';

const stripe = new Stripe(config.pay.stripe)

export const createSession = async (req, res) => {
    try {
        
        const id = req.user.cart
        

        // Buscar el carrito del usuario 
        const userCart = await CartService.getById(`${id}`.toString())
        if (!userCart) {
            return res.status(404).json({ error: 'Carrito del usuario no encontrado' });
        }

        const lineItems = userCart.products.map(item => ({
            price_data: {
                product_data: {
                    name: item.product.title,
                    description: item.product.description
                },
                currency: 'usd',
                unit_amount: item.product.price 
            },
            quantity: item.quantity
        }));
     
        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: 'payment',
            success_url: `http://localhost:8080/pay/success/${userCart._id.toString()}`,
            cancel_url: 'http://localhost:8080/pay/cancel',
            payment_intent_data: {
            metadata: {
                cartId: userCart._id.toString(),  // Agregar el ID del carrito como metadato
                userEmail: req.user.email  // Agregar el correo del usuario como metadato, ajusta según tus necesidades
                // Agrega otros metadatos si es necesario
            },
        },  
        });

        return res.json(session);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al crear la sesión de pago' });
    }
};

export const afterPay = async (req, res,) => {
    try {
      
        
        const ticket = req.params.tickets

     const ticketDetails = await ticketModel.findOne({ ticket });
     if (!ticketDetails) {
        return res.status(404).json({ error: 'ticket del usuario no encontrado' });
    }

   
     const ticketDTO = {
        code: ticketDetails.code,
        products: ticketDetails.products.map(product => ({
            quantity: product.quantity,
            productId: product.product,
            price: product.price
        })),
        amount: ticketDetails.amount,
        purchaser: ticketDetails.purchaser,
        purchase_datetime: ticketDetails.purchase_datetime
    };

        // Acceder al correo electrónico del usuario desde req.user (o de donde sea que lo obtengas)
        const userEmail = req.user.email; 
       

        res.render('ticket', { userEmail, ticketDetails, ticketDTO });
    } catch (error) {
        console.error('Error en la función afterPay:', error);
        return res.status(500).json({ error: 'Error al renderizar la vista' });
    }
};



export const cancel = async (req, res,) => {
    try {
         const userId = req.session.user
         const carrito = req.user.carts
         console.log('userId:',userId);
         console.log('carrito:',carrito);
     
         
         if (!carrito) {
            console.log(`Carrito no encontrado para el usuario con ID: ${userId}`);
            return res.status(404).json({ error: 'Carrito no encontrado para el usuario' });
        }
        const carritoOriginal = await CartService.getById(carrito);
        console.log('carritoOriginal:',carritoOriginal);
        if (!carritoOriginal) {
            console.log(`CarritoOriginal no encontrado: ${userId}`);
            return res.status(404).json({ error: 'CarritoOriginal no encontrado p ' });
        }
 // Restaura el contenido original del carrito desde el almacenamiento temporal
 const updatedCart = await CartService.update(carrito, { products: carritoOriginal.products });
 console.log('updatedCart:',updatedCart);
 if (updatedCart) {
    console.log(`Error al restaurar el carrito: ${userId}`);
    return res.status(500).json({ error: 'Error al restaurar el carrito' });
  }
  if (!updatedCart || updatedCart.error) {
    console.log(`Error al restaurar el carrito: ${userId}`);
    return res.status(500).json({ error: 'Error al restaurar el carrito' });
  }
        res.redirect(302, `/carts/${carrito}`);
    }  catch (error) {
        console.error('Error en la función cancel:', error);
        return res.status(500).json({ error: 'Error al cancelar la compra' });
    }
    
};
