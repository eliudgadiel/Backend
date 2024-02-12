import { UserService } from "../repositories/index.js"
import { CartService} from "../repositories/index.js";
import { sendInactiveEmail } from "../controllers/checkout.controller.js"
import moment from 'moment';



// Función para calcular el tiempo inactivo
const calculateInactiveTime = (lastConnection) => {
    if (!lastConnection) {
        // Si lastConnection es nulo, el usuario nunca se ha conectado
        return 'Nunca se ha conectado';
    }

    const currentTime = new Date();
    const inactiveTimeMillis = currentTime - lastConnection;

    const seconds = Math.floor(inactiveTimeMillis / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const formattedTime = [];

    if (days > 0) {
        formattedTime.push(`${days} día(s)`);
    }

    if (hours > 0) {
        formattedTime.push(`${hours} hora(s)`);
    }

    if (minutes > 0) {
        formattedTime.push(`${minutes} minuto(s)`);
    }

    if (seconds > 0) {
        formattedTime.push(`${seconds} segundo(s)`);
    }

    return formattedTime.length > 0 ? formattedTime.join(', ') : 'Recién se ha conectado';
};

export const getUser = async (req, res) => {
    try {
      

        // Obtener todos los usuarios
        const users = await UserService.find({ role: { $ne: 'admin' } }, 'nombre correo tipoCuenta');
  
        const usersDTO = users.map(user => ({
            first_name: user.first_name,
            email: user.email,
            role: user.role,
            lastConnection:  user.lastConnection ? user.lastConnection.toISOString() : null,
            inactiveTime: calculateInactiveTime(user.lastConnection),
            id: user._id
        }));

        res.render('sessions/getUsers', { users: usersDTO });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ status: 'error', error: 'Unhandled error', details: error.message });
    }
};



// Ruta para eliminar usuarios inactivos
export const deleteInactiveUsers = async (req, res) => {
    try {
        const userId = req.params.user_id;
    
      
        // Verifica si el usuario existe antes de intentar eliminarlo
        const existingUser = await UserService.getById(userId);
        
        if (!existingUser) {
          return res.status(404).json({ status: 'error', error: 'User not found' });
        }

        // Verifica la inactividad del usuario durante los últimos 30 minutos
    const lastConnectionTime = moment(existingUser.lastConnection);

    if (moment().diff(lastConnectionTime, 'minutes') <= 30) {  
      // El usuario ha estado activo en los últimos 30 minutos
      return res.status(200).json({ status: 'active', message: 'User has been active recently', userId });
    }

    // Envia un correo por inactividad antes de eliminar al usuario
    await sendInactiveEmail(existingUser);
    
        // Elimina el usuario
        await UserService.delete(existingUser);

  // Elimina el carrito asociado al usuario
  const cartId = existingUser.cart; 

  if (cartId) {
    const existingCart = await CartService.getById(cartId);

    if (existingCart) {
      await CartService.delete(existingCart);
    }
    }
    res.status(200).json({ status: 'success', message: 'User deleted successfully', userId });
      } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ status: 'error', error: 'Error during deletion', details: error.message });
      }
    }

 