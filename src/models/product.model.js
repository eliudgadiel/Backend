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
            title: { type: String, required: true },
            price: { type: Number, required: true },
            stock: { type: String, required: true },
            description: { type: String, required: true },
            code: { type: String, required: true },
            category: { type: String, required: true }
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
