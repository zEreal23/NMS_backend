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

dotenv.config();

//midldleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());

//routes
readdirSync('./routes').map((r) => app.use('/api', require('./routes/' + r)));

// const port = process.env.PORT || 8000;
const port = 3020;

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
    .connect(
        'mongodb+srv://zEreal23:12345@cluster0.5v5iw.mongodb.net/nms?retryWrites=true&w=majority',
        {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        },
    )
    .then(() => console.log('DB connected'));
