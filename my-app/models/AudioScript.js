var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scriptSchema = new Schema( {
	title: String,
	url: String,
	result: String,
	date_created: { type: Date, default: Date.now },
	date_updated: { type: Date, default: Date.now }
});

scriptSchema.statics.findOneByTitle = function ( title ) {
	return this.findOne( { title });
};

module.exports = mongoose.model('AudioScript', scriptSchema);
