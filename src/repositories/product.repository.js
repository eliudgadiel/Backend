export default class ProductRepository {
    constructor(dao) {
    this.dao = dao
}
getAll = async() => await this.dao.getAll()
getById = async(id) => await this.dao.getById(id)
getAllPaginate = async(req, PORT) => await this.dao.getAllPaginate(req, PORT)
create = async(data) => await this.dao.create(data)
update = async(id, data) => await this.dao.update(id, data)
delete = async(id) => await this.dao.delete(id)
findById = async (id) => await this.dao.findById(id)
}


