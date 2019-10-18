const path= require('path');
const config={
    port: process.env.PORT || 3000,
    static: path.join(__dirname,'../../public'),
    mongoose:{
        db: process.env.MONGO_URI || 'mongodb://localhost:27017/projects',
        options: {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        },
        dbDev:  "mongodb://localhost:27017/projects-test"
    },
    cookieSession:{
        secret:'secret Key',
        name:'pjs_uid',
        maxAge:2*60*1000
    },
    
}
module.exports=config;