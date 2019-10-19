const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "is required"]
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: [true, "is required"]
    },
    password: {
        type: String,
        required: [true, "is required"]
    },
    date:{
        type: Date,
        default: Date.now()
    }
});


UserSchema.pre("save", function (next) {  
    bcrypt.hash(this.password, 10, (err, hash) => {
        if (err) {
            return next(err);
        }
        this.password = hash;
        next();
    });
});

UserSchema.statics.authenticate = async (email, password) => {  
    const user = await mongoose.model('User').findOne({ email: email });
    if (user) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) reject(err);
                resolve(result === true ? user : null);
            });
        });
    } else {
         return null;
    }
}

module.exports = mongoose.model('User', UserSchema);