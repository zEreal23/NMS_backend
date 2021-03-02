const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')
const cors = require('cors')
const {readdirSync} = require("fs")

//import router
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order')

dotenv.config()

//midldleware
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())

 //routes
readdirSync('./routes').map((r) => app.use('/api', require('./routes/'+ r)))
app.use('/api' ,authRoutes)
app.use('/api' ,userRoutes)
app.use('/api' ,categoryRoutes)
app.use('/api' ,productRoutes)
app.use('/api' ,orderRoutes)
const port = process.env.PORT || 8000

app.listen(port , () =>{
    console.log(`PORT:${port}`);
})

//db connection
mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true 
}).then(()=> console.log('DB connected'))