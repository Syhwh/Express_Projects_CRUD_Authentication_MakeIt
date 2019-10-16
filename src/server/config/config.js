const path= require('path');
const config={
    port: process.env.PORT || 3000,
    static: path.join(__dirname,'../../public'),
    mongoose:{
        db: process.env.MONGO_URI || 'mongodb://localhost:27017/projects'
    }
}
module.exports=config;