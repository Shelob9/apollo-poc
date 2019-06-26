const mongoose = require('./client');
const Schema = mongoose.Schema;
const IntrestCategorySchema = new Schema({
	_id: mongoose.Types.ObjectId,
	listId: String,
	categoryId: String,
	title: String,
	type: String,
	displayOrder: Number,
	interests: [{ type: Schema.Types.ObjectId, ref: 'Interest' }],
});

const IntrestCategoryModel = mongoose.model(
	'IntrestCategory',
	IntrestCategorySchema,
);

module.exports = {
	byList: (listId) => IntrestCategoryModel.find({ listId }),
	deleteAllForList: (listId) => IntrestCategoryModel.deleteMany({ listId }),
	create: (args) => IntrestCategoryModel(args).save(),
};
