const app =require('./app');
//Config files
const config = require('./config/config');
const port = config.port;


//Inizialization
app.listen(port, () => console.log(`Server runing in the port ${port}`));