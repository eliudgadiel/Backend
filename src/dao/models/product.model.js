import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
    products: {
        type: [{
            _id: false,
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product"
            },
            title: String,
            price: Number,
            stock: String,
            description: String,
            code: String,
            category: String
        }],
        
    }
});

mongoose.set('strictQuery', false);


productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model('products', productSchema);


const options = {
    page: 1,
    limit: 10
  };
  

  productModel.paginate({}, options)
    .then(result => {
      console.log(result);
    })
    .catch(error => {
      console.error(error);
    });

export default productModel;
