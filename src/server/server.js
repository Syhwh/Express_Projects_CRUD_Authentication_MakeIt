const app =require('./app');
const config = require('./config/config');
const port = config.port;




//Inizialization
app.listen(port, () => console.log(`Server runing in the port ${port}`));