import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import { createHash, isValidPassword } from "../utils.js";
import UserModel from "../dao/models/user.model.js";
import CartModel from "../dao/models/cart.model.js"


const localStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new localStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          const user = await UserModel.findOne({
            email: username,
          });
          if (user) {
            return done(null, false);
          }
          const cartForNewUser = await CartModel.create({})
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password), cart: cartForNewUser._id, role: (email === 'adminCoder@coder.com') ? 'admin' : 'user'
          };
          const result = await UserModel.create(newUser);
          return done(null, result);
        } catch (err) {
          return done('error al obtener el user');
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
          const user = await UserModel.findOne({
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
        clientID: "Iv1.b241921dc9f7a4bf",
        clientSecret: "6e02dc418f52a2509a739fa20838524c062868da",
        callbackURL: "http://localhost:8080/session/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        try {
          const user = await UserModel.findOne({
            email: profile._json.email,
          });
          if (user) return done(null, user);
          const newUser = await UserModel.create({
            first_name: profile._json.name,
            last_name: "",
            email: profile._json.email,
            password: "",
          });
          return done(null, newUser);
        } catch (err) {
          return done("error to login with github");
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await UserModel.findById(id);
    done(null, user);
  });
};

export default initializePassport;
