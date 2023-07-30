class ProductManager {
  constructor() {
    this.products = [];
    this.currentId = 1;
  }

  addProduct(product) {
    // Validar que todos los campos sean obligatorios
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock
    ) {
      throw new Error("Todos los campos son obligatorios.");
    }

    // Validar que no se repita el  "code"
    const existingProduct = this.products.find((p) => p.code === product.code);
    if (existingProduct) {
      throw new Error("Ya existe un producto con el mismo código.");
    }

    // Agregar el producto con el id 
    product.id = this.currentId++;
    this.products.push(product);
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      console.error("Not found");
      return null;
    }
    return product;
  }
}


