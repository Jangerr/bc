var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var sourceSchema = new Schema(
    {
        name: { type: String, required: true, lowercase: true },
        short_handle: { type: String, required: true, lowercase: true },
        link: { type: String, required: true, lowercase: true },
    }
);

//Export model
module.exports = mongoose.model('sources', sourceSchema);