const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    
    title: {
        type: String,
        required: true,
    },

    body: {
        type: String,
        required: true,
    },
    
    file: {
        type: String
        },
    
    date: {
        type: Date,
        default: Date.now()
    }
    

});

module.exports = mongoose.model('posts', postSchema);