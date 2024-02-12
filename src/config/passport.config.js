import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import { createHash, isValidPassword } from "../utils.js";
import { UserService } from "../repositories/index.js";
import {CartService} from "../repositories/index.js"
import config from '../config/config.js';  
import logger from "../logger.js";

const localStrategy = local.Strategy;

const initializePassport = () => {
  UserService.findOne({ email: 'adminCoder@coder.com' })
    .then(admin => {
      if (!admin) {
        const adminUser = {
          first_name: 'admin',
          last_name: 'admin',
          email: config.admin.email,
          age: 25, 
          password: createHash(config.admin.password), 
          cart: null, 
          role: 'admin'
        };

        UserService.create(adminUser)
          .then(result => {
            logger.info('Usuario administrador creado con éxito.');
          })
          .catch(err => {
            logger.error('Error al crear el usuario administrador:', err);
          });
        } })

  passport.use(
    "register",
    new localStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        if (!email || email.trim() === '') {
          return done(new Error('El email es obligatorio'));
        }
        try {
          const user = await UserService.findOne({
            email: username,
          });
        
          if (user) {
            return done(null, false);
            
          }

          const result = await UserService.create({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            role: (email === 'adminCoder@coder.com') ? 'admin' : 'user',
            lastConnection: new Date(),
          });
 
          if (result) {
            const cartForNewUser = await CartService.create({ email });
            await cartForNewUser.save();
            result.cart = cartForNewUser._id;
            await result.save();
            return done(null, result);
          }
        } catch (err) {
          return done(err)
        }
      }
    )
  );

  passport.use(
    "login",
    new localStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const user = await UserService.findOne({
            email: username,
          });
          if (!user) {
            return done(null, false);
          }
          if (!isValidPassword(user, password)) return done(null, false);
          
          return done(null, user);
        } catch (err) {}
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: config.github.clientId,
        clientSecret: config.github.githubSecret,
        callbackURL: config.github.githubCallbackUrl,
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        try {
          const user = await UserService.findOne({
            email: profile._json.email,
          })
          if (user) {
            return done(null, user)
          }
          const cartForNewUser = await CartService.create({})
          const newUser = await UserService.create({
            first_name: profile._json.name,
            last_name: profile._json.name,
            email: profile._json.email,
            password: "",
            cart: cartForNewUser._id,
            lastConnection: new Date()
          });
          return done(null, newUser);
        } catch (err) {
          return done(`Error to login with github: ${err.message}`)
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await UserService.getById(id);
    done(null, user);
  });
};

export default initializePassport;
