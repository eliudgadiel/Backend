import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
  user: String,
  message: String
});

mongoose.set('strictQuery', false);
const Message = mongoose.model('message', messageSchema);

export default Message
