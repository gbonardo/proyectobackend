import express from 'express';
import mongoose from 'mongoose';
//import multer from 'multer';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { __dirname } from "./path.js";
import path from 'path';
import userRouter from './routes/users.routes.js';
import productRouter from './routes/products.routes.js';
import cartRouter from './routes/cart.routes.js';
import messageRouter from './routes/messages.routes.js';
import { messageModel } from './dao/models/messages.models.js';
import { productModel } from './dao/models/products.models.js';

const app = express()
const PORT = 8080

//Mongoose
mongoose.connect('mongodb+srv://gbonardo:password@cluster0.2wx3ldq.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('BDD conectada'))
    .catch(() => console.log('Error en conexion a BDD'))

//Middleware    
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))
app.use('/static', express.static(path.join(__dirname, '/public')))
app.use('/realtimeproducts', express.static(path.join(__dirname, '/public')))
app.use('/chat', express.static(path.join(__dirname, '/public')))

//Routes
app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/messages', messageRouter)

//Routes
//app.use('/api/products', prodsRouter)
//app.use('/api/carts', cartsRouter)

const serverExpress = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
    })

//Server Socket.io
const io = new Server(serverExpress)

io.on('connection', async (socket) => {
    console.log("Servidor Socket.io conectado")
    socket.on('mensajeConexion', (info) => {
        console.log(info)
        if (user.rol === "Admin") {
            socket.emit('credencialesConexion', "Usuario valido")
        } else {
            socket.emit('credencialesConexion', "Usuario no valido")
        }
    })

    socket.on('newMessage', async ({email, mensaje}) => {
        console.log(mensaje)
        await messageModel.create({ email: email, message: mensaje}) 
        const messages = await messageModel.find()
        socket.emit("showMessages", messages)
    })

    socket.on('loadChats', async() => {
        const messages = await messageModel.find()
        socket.emit("showMessages", messages)
    })

    socket.on('addProduct', async (newProduct) => {
        const { title, description, price, stock, category, code, thumbnail } = newProduct
        await productModel.create({title, description, price, stock, category, code, thumbnail})
        //await productManager.addProduct(newProduct)
        //const products = await productManager.getProducts()
        const products = await productModel.find();
        socket.emit('dataProducts', products)
    })

    socket.on('realTimeProducts', async () => {
        const products = await productModel.find();
        socket.emit('dataProducts', products)
    })

    socket.on('deleteProductCode', async (code) => {
        await productModel.findOneAndDelete(code)
        const products = await productModel.find();
        socket.emit('dataProducts', products)
    })
})

app.get('/static', (req, res) => {
    res.render('index', {
        css: "style.css",
        title: "Productos",
        js: "index.js"
    })
})

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {
        css: "products.css",
        title: "Administrar productos",
        js: "realTimeProducts.js"
    })
})

app.get('/chat', (req, res) => {
    res.render('chat', {
        globalCss: 'style.css',
        title: 'Chat',
        js: 'chat.js',
    });
});

//Storage
/*
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img')
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}${file.originalname}`)
        }
    })
const upload = multer({ storage: storage })
*/

/*
app.post('/upload', upload.single('product'), (req, res) => {
    console.log(req.file)
    console.log(req.body)
    res.status(200).send("Imagen subida")
})
//console.log(path.join(__dirname, '/public'))
*/