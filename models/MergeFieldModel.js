const mongoose = require('./client');
const Schema = mongoose.Schema;

const MergeFieldSchema = new Schema({
	_id: String,
	mergeId: String,
	tag: String,
	name: String,
	type: String,
	required: Boolean,
	defaultValue: String,
	public: Boolean,
	displayOrder: Number,
	helpText: String,
	listId: String,
});

const MergeFieldModel = mongoose.model('MergeField', MergeFieldSchema);

module.exports = {
	getFields: (listId) =>
		MergeFieldModel.find({ listId })
			.sort({ _id: -1 })
			.exec(),
	deleteFieldsOfList: (listId) => MergeFieldModel.deleteMany({ listId }),
	getField: (_id) => MergeFieldModel.findOne({ _id }).exec(),
	create: (args) => MergeFieldModel(args).save(),
	delete: (args) => {
		const { _id } = args;

		MergeFieldModel.remove({ _id }, (error) => {
			if (error) {
				console.log('Error Removing: ', error);
			}
		});

		return args;
	},
	update: (args) => {
		const {
			mergeId,
			tag,
			name,
			type,
			required,
			defaultValue,
			public,
			displayOrder,
			helpText,
			listId,
			_id,
		} = args;
		MergeFieldModel.update(
			{ _id },
			{
				listId,
				$set: {
					mergeId,
					tag,
					name,
					type,
					required,
					defaultValue,
					public,
					displayOrder,
					helpText,
					listId,
				},
			},
			{ upsert: true },
			(error) => {
				if (error) {
					console.log('Error Updating: ', error);
				}
			},
		);
		return args;
	},
};
