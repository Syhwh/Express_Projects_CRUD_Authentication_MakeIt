const mongoose = require ('mongoose');
const config=require('../config/config');


mongoose.connect(config.mongoose.db,config.mongoose.options)
    .then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log(`DB Connection Error: ${err.message}`);
    });
