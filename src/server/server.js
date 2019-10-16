const express=require('express');
const mongoose= require('mongoose');
const morgan=require('morgan');
//Config files
const config= require('./config/config');
const port=config.port;
const db = config.mongoose.db;

//Routes
const routes = require('./routes/routes');

// application
const app = express();

//Database
mongoose.connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
})
    .then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log(`DB Connection Error: ${err.message}`);
    });

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//static files
app.use(express.static(config.static));
//routes
app.use(routes);
app.use(morgan('dev'));

//Inizialization
app.listen(port,()=>console.log(`Server runing in the port ${port}`));