var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var articleSchema = new Schema(
    {
        link: { type: String, required: true, max: 255 },
        title: { type: String, unique: true },
        description: String,
        tags: String,
        image: String,
        ratio: Number,
        user: { type: Schema.ObjectId, ref: 'user' },
        category: Schema.ObjectId,
        source: { type: Schema.ObjectId, ref: 'sources' },
        language: Schema.ObjectId,
        default_image: Number,
        flags: String,
        views: { type: Number, default: 0 },
        newsletter_state: { type: Number, default: 0 },
        approving_state: { type: Number, default: 0 },
        date_posted: { type: Date, default: Date.now },
        automatic: { type: Number, default: 0 }
    }
);


// Virtual for article's URL
articleSchema
.virtual('url')
.get(function () {
	return "news/" + this.title + ".html";
});

//Export model
module.exports = mongoose.model('article', articleSchema);