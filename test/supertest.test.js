import { expect } from 'chai'
import supertest from 'supertest'


const requester = supertest('http://localhost:8080')

describe('Testing', () => {
    let cookie;
    const mockUser = {
        first_name: 'eliud',
        last_name: 'gadiel',
        email: 'eliudgadiel@gmail.com',
        age: '30',
        password: 'ramirez'
    }
    describe('Test de Session', () => {

        it ('debe registrar un usuario', async() => {
            const {_body} = await requester.post('/session/register').send(mockUser)

      console.log('body:', _body);

            expect(_body.payload).to.be.ok
            
      console.log('payload:', payload);
        })

        it('El endpoint POST /session/login debería iniciar sesión con un usuario', async () => {

            const result = await requester.post('/session/login')
            .send({ email: mockUser.email, contraseña: mockUser.password })
                .expect(302);

                console.log(' sesión:', );

            const cookieResult = result.headers['set-cookie'][0];

            console.log('Cookie de sesión:', cookieResult);

            
            expect(result.headers.location).to.equal('/products');
        });
    });
 

    describe('Testing Product', () => {
        it('El endpoint GET /api/products debería obtener productos después del inicio de sesión', async () => {
            // Realizar la solicitud de inicio de sesión
            const loginResult = await requester.post('/session/login')
                .send({ email, contraseña })
                .expect(302);

                const cookieResult = result.header['set-cookie'][0]
            
            expect(cookieResult).to.be.ok

            it('El endpoint GET /api/products debería obtener productos después del inicio de sesión', async () => {
                const response = await requester.get("/api/produts")
                .set("Cookei", sesionCookie)
                .expect(200)
                expect(response.body.status).to.equal("seccess")
            })
        });
    });
   

    xdescribe('Test de Cart', () => {
    })
    it('El usuario debería ver los productos en su carrito', async () => {
        try {
            // Realiza la solicitud de inicio de sesión para obtener el token de autenticación
            const loginCredentials = {
                email: 'gadiel-3@hotmail.com',
                contraseña: 'ramirez',
            };
    
            const loginResponse = await requester.post('/session/login').send(loginCredentials);
            const authToken = loginResponse.body.token;
    
            // Realiza la solicitud GET para obtener los detalles del carrito y sus productos
            const getCartDetailsResponse = await requester.get('/carts/:cid').set('Authorization', `Bearer ${authToken}`);
    
        } catch (error) {
            
        }
    });
  

  
})
