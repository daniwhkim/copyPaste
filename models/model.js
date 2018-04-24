var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// see http://mongoosejs.com/docs/schematypes.html

var formSchema = new Schema({
	date: String,
	copy: Number,
	paste: Number,
	successfulCopyPaste: Number,
	dateAdded : { type: Date, default: Date.now }
})

// export "Form" model so we can interact with it in other files
module.exports = mongoose.model("Form", formSchema);
