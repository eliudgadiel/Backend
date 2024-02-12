import mongoose from "mongoose";

const userCollection = 'users'

const userSchema = new mongoose.Schema({
    first_name: {type: String, required: true  },
    last_name: {type: String, required: true },
    email: {type: String },
    age: {type: Number, },
    password: {type: String},
    cart: {type: mongoose.Schema.Types.ObjectId, ref: "carts" },
    role: { type: String, enum: ['user', 'admin', 'premium'], default: 'user'},
    lastConnection: { type: Date, default: Date.now }
})


mongoose.set('strictQuery', false)
const UserModel = mongoose.model(userCollection, userSchema)

export default UserModel