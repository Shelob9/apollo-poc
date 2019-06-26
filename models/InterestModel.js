const mongoose = require('./client');
const Schema = mongoose.Schema;

const InterestSchema = new Schema({
	_id: mongoose.Types.ObjectId,
	listId: String,
	categoryId: String,
	intrestId: String,
	name: String,
	type: String,
	displayOrder: Number,
});

const InterestModel = mongoose.model('Interest', InterestSchema);

module.exports = {
	byList: (listId) => InterestModel.find({ listId }),
	byCategoryId: (categoryId) => InterestModel.find({ categoryId }),
	deleteAllForList: (listId) => InterestModel.deleteMany({ listId }),
	create: (args) => InterestModel(args).save(),
};
