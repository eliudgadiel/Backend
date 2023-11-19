import userModel from "../models/user.model.js"

export default class UserMongoDAO {
    getAll = async() => await userModel.find().lean().exec()
    getById = async(id) => await userModel.findById(id).populate().lean().exec()
    create = async(data) => await userModel.create(data)
    update = async(id, data) => await userModel.findByIdAndUpdate(id, data, { returnDocument: 'after' })
    delete = async(id) => userModel.findByIdAndDelete(id)  
    findOne = async (query) => await userModel.findOne(query)
    
}