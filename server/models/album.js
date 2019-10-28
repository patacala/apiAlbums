const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let albumSchema = new Schema({
    name: { type: String },
    date: {type: Date}
});


module.exports = mongoose.model('Album', albumSchema);