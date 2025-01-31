import { cartModel } from "../models/cart.model.js";

class CartDao {
  // Obtener todos los carritos
  async getAll() {
    return await cartModel.find();
  }

  // Obtener un carrito por ID
  async getById(id) {
    return await cartModel.findById(id);
  }

  // Paginación de productos dentro de un carrito
  async pagAll(query, options) {
    return await cartModel.paginate(query, options);
  }

  // Crear un nuevo carrito
  async create(data) {
    return await cartModel.create(data);
  }

  // Actualizar un carrito por ID
  async update(id, data) {
    return await cartModel.findByIdAndUpdate(id, data, { new: true });
  }

  // Eliminar un carrito por ID
  async delete(id) {
    return await cartModel.findByIdAndDelete(id);
  }

  // Eliminar un producto específico de un carrito
  async deleteProductInCart(cid, pid) {
    const cart = await cartModel.findById(cid);
    if (!cart) throw new Error(`Cart with id ${cid} not found`);

    // Filtrar los productos para eliminar el especificado
    cart.products = cart.products.filter(
      (product) => product.product.toString() !== pid
    );
    await cart.save();

    return cart; // Retornar el carrito actualizado
  }
  //vaciar carrito
  async deleteAllProductsInCart(cid) {
    const cart = await cartModel.findById(cid);
    if (!cart) throw new Error(`Cart with id ${cid} not found`);

    cart.products = [];

    await cart.save();

    return cart;
  }

  // Actualizar los productos de un carrito
  async updateCartProducts(cid, products) {
    const cart = await cartModel.findById(cid);
    if (!cart) throw new Error(`Cart with id ${cid} not found`);

    // Reemplazar los productos del carrito
    cart.products = products;
    await cart.save();

    return cart; // Retornar el carrito actualizado
  }

  async updateProductQuantity(cid, pid, quantity) {
    const updatedCart = await cartModel.findOneAndUpdate(
      { _id: cid, "products.product": pid }, 
      { $set: { "products.$.quantity": quantity } }, 
      { new: true } 
    );
  
    if (!updatedCart) {
      throw new Error(`Producto con id ${pid} no encontrado en el carrito ${cid}`);
    }
  
    return updatedCart;
  }
}

export const cartDao = new CartDao();
