import mongoose from "mongoose";

const userCollection = 'users'

const userSchema = new mongoose.Schema({
    first_name: {type: String, required: true  },
    last_name: {type: String, required: true },
    email: {type: String },
    age: {type: Number, },
    password: {type: String},
    role: {type: String, default: 'user' },
    cart: {type: mongoose.Schema.Types.ObjectId, ref: "carts" }
})


mongoose.set('strictQuery', false)
const UserModel = mongoose.model(userCollection, userSchema)

export default UserModel