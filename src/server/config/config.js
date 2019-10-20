const path = require('path');
const config = {
    port: process.env.PORT || 3000,
    static: path.join(__dirname, '../../public'),
    mongoose: {
        db: process.env.MONGO_URI,
        options: {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        },
    },
    cookieSession: {
        secret: 'secret Key',
        name: 'pjs_uid',
        maxAge: 3 * 60 * 1000
    },

}
module.exports = config;