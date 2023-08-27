import crypto from 'crypto'
import { promises as fs } from 'fs'

const pathCart = 'src/data/carts.json'

class Cart {
    constructor(cid) {
        this.cid = cid
        this.products = []
    }
}

class CartManager {
    constructor() {
    }
    async createCart(){
        const cart = new Cart(crypto.randomUUID())
        const carts = JSON.parse(await fs.readFile(pathCart, 'utf-8'))
        carts.push(cart)
        await fs.writeFile(pathCart, JSON.stringify(carts))
        return cart
    }
    async addCart(cart) {
        const carts = JSON.parse(await fs.readFile(pathCart, 'utf-8'))
        const carrito = carts.find(carrit => carrit.cid === cart.cid)
        if (carrito) {
            console.log("El carrito existe.")
        } else {
            carts.push(cart)
            await fs.writeFile(pathCart, JSON.stringify(carts))
        }
    }
    async getCarts() {
        const carts = JSON.parse(await fs.readFile(pathCart, 'utf-8'))
        return carts
    }
    async getCartById(cid) {
        const carritos = JSON.parse(await fs.readFile(pathCart, 'utf-8'))
        const carrito = carritos.find(cart => cart.cid === cid)
        if (carrito) {
            return carrito
        } else {
            console.log("El carrito no existe.")
        }
    }
    async updateCart(cid, products) {
        const carts = JSON.parse(await fs.readFile(pathCart, 'utf-8'))
        const indice = carts.findIndex(cart => cart.cid === cid)
        if (indice != -1) {
            carts[indice].products.quantity = products.quantity
            await fs.writeFile(pathCart, JSON.stringify(carts))
        } else {
            console.log("Carrito no encontrado.")
        }
    }
    async deleteCart(cid) {
        const carts = JSON.parse(await fs.readFile(pathCart, 'utf-8'))
        const carrito = carts.find(cart => cart.cid === cid)
        if(carrito){
            await fs.writeFile(pathCart, JSON.stringify(carts.filter(cart => cart.cid != cid)))
        } else {
            console.log("Carrito no encontrado.")
        }
    }
    async getProductCartById(cid, pid) {
        const carritos = JSON.parse(await fs.readFile(pathCart, 'utf-8'))
        const carrito = carritos.find(cart => cart.cid === cid)
        if (carrito) {
            const productIndex = carrito.products.findIndex(prod => prod.id === pid)
            if(productIndex != -1){
                console.log(productIndex)
                return productIndex
            } else {
                console.log("El producto no existe")
            }
        } else {
            console.log("El carrito no existe.")
        }
    }
    async addProductCart(cid, pid) {
        const carts = JSON.parse(await fs.readFile(pathCart, 'utf-8'))
        const carrito = carts.find(cart => cart.cid === cid)
        console.log(carrito)
        const productIndex = carrito.products.findIndex(prod => prod.id === pid)
        console.log(productIndex)
        if (productIndex != -1) {
            carrito.products[productIndex].quantity += 1
            await fs.writeFile(pathCart, JSON.stringify(carts))
            console.log("Producto agregado.")
        } else {
            carrito.products.push({ id: pid, quantity: 1 })
            await fs.writeFile(pathCart, JSON.stringify(carts))
            console.log("Nuevo producto agregado.")
        }
    }
}



export default CartManager;




