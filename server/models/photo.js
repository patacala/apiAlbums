const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let photoSchema = new Schema({
    name: { type: String }, 
    url: { type: String},
    size: { type: String},
    extension: { type: String},
    album: { type: String},
    favorite: { type: Boolean },
    date: {type: Date}
});


module.exports = mongoose.model('Photo', photoSchema);