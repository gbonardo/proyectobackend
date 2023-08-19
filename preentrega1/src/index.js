import express from "express";
import prodsRouter from "./routes/products.routes.js"; 
import cartsRouter from "./routes/carts.routes.js"; 
import { __dirname } from "./path.js";
import path from 'path';
import multer from 'multer';
const PORT = 8080
const app = express()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img')
    },
    filename: (req,file,cb) => {
        cb(null, `${Date.now()}${file.originalname}`)
    }
})
//Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
const upload = multer({ storage: storage})
//Routes
app.use('/api/products', prodsRouter)
app.use('/api/carts', cartsRouter)
app.use('/static', express.static(path.join(__dirname, '/public')))
app.post('/upload', upload.single('product'), (req,res) => {
    console.log(req.file)
    console.log(req.body)
    res.status(200).send("Imagen subida")
})
//console.log(path.join(__dirname, '/public'))
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})