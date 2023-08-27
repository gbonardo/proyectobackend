import { Router } from "express";
import CartManager from "./CartManager.js";

const cartManager = new CartManager()
const cartsRouter = Router()

cartsRouter.get('/:cid', async (req, res) => {
    const { cid } = req.params
    const cart = await cartManager.getCartById(cid)
    if (cart) {
        res.status(200).send(cart)
    } else {
        res.status(404).send("Carrito no encontrado.")
    }
})

cartsRouter.post('/', async (req, res) => {
    const confirm = await cartManager.createCart()
    if (confirm) {
        res.status(200).send("Carrito creado.")
    } else {
        res.status(400).send("Error al crear carrito.")
    }
})

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params
    const cart = await cartManager.getCartById(cid)
    
    if (cart) {
        const prodIndex = await cartManager.getProductCartById(cid, pid)
        if (prodIndex != -1) {
            await cartManager.addProductCart(cid, pid)
            res.status(200).send("Producto agregado.")
        } else {
            res.status(404).send("Error al agregar el producto.")
        }
    } else {
        res.status(404).send("El carrito no existe.")
    }
})


export default cartsRouter