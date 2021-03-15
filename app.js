const path = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const cors = require('cors');
const multer = require('multer');
const {readdirSync} = require('fs');
const {v4: uuidv4} = require('uuid');
const {clearImageByFilePath} = require('./helpers/file');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './assets/photo');
    },
    filename: (req, file, cb) => {
        const genId = uuidv4();
        const extension = file.mimetype.slice(6, file.mimetype.length); // extract the extension from the mimetype
        cb(null, 'nsn-' + genId + '.' + extension); // adding the extension
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

//import router
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const reportRoutes = require('./routes/report');

dotenv.config();

//midldleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());

//routes
readdirSync('./routes').map((r) => app.use('/api', require('./routes/' + r)));
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', reportRoutes);
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`PORT:${port}`);
});

const upload = multer({storage: fileStorage, fileFilter: fileFilter});
app.use('/assets/photo', express.static(path.join(__dirname, '/assets/photo')));

app.put('/api/post-image', upload.single('photo'), (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({error: 'No file provided!'});
    }
    return res.status(201).json({error: 'File stored.', filePath: req.file.path});
});

//db connection
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('DB connected'));
