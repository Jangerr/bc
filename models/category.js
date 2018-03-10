var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var categorySchema = new Schema(
    {
        name: { type: String, required: true},
        image: String
    }
);


//Export model
module.exports = mongoose.model('category', categorySchema);