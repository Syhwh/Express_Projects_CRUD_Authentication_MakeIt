const mongoose = require('mongoose');

const ProjectSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: Date

})
module.exports = mongoose.model('Project', ProjectSchema);