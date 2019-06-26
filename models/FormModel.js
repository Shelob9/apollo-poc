const MAILCHIMP = require('./mailchimp');
const mongoose = require('./client');
const Schema = mongoose.Schema;
const FORM = 'Form';
const FIELD = 'FormField';
const PROCESSOR = 'FormProcessor';
const CONDITIONAL = 'FormConditional';
const ENTRY = 'FormEntry';
const ENTRY_VALUE = 'FormEntryValue';

const FormSchema = new Schema({
	_id: Schema.Types.ObjectId,
	ID: String,
	name: String,
});

const FormFieldSchema = new Schema({
	_id: Schema.Types.ObjectId,
	fieldId: String,
	name: String,
	label: String,
	defaultValue: String,
	description: String,
	required: Boolean,
	fieldType: String,
	form: { type: Schema.Types.ObjectId, ref: FORM },
});

const FormProcessorSchema = new Schema({
	_id: Schema.Types.ObjectId,
	processorId: String,
	type: String,
	label: String,
	form: { type: Schema.Types.ObjectId, ref: FORM },
});

const FormConditionalSchema = new Schema({
	_id: Schema.Types.ObjectId,
	type: String,
	name: String,
	fields: Schema.Types.Mixed,
	group: Schema.Types.Mixed,
	form: { type: Schema.Types.ObjectId, ref: FORM },
});

const FormEntrySchmea = new Schema({
	_id: Schema.Types.ObjectId,
	form: { type: Schema.Types.ObjectId, ref: FORM },
	//@todo datestamps and user
});

const FormEntryValueSchema = new Schema({
	_id: Schema.Types.ObjectId,
	entry: { type: Schema.Types.ObjectId, ref: ENTRY },
	field: { type: Schema.Types.ObjectId, ref: FIELD },
	value: String,
});
const FieldModel = mongoose.model(FIELD, FormFieldSchema);
const FormProcessorModel = mongoose.model(PROCESSOR, FormProcessorSchema);
const FormConditionalModel = mongoose.model(CONDITIONAL, FormConditionalSchema);
const FormModel = mongoose.model(FORM, FormSchema);
const FormEntryModel = mongoose.model(ENTRY, FormEntrySchmea);
const FormEntryValue = mongoose.model(ENTRY_VALUE, FormEntryValueSchema);
/**
 * Add fields to a form model
 */
async function addFieldsToForm(form) {
	const fields = await FieldModel.find({ form: form._id });
	form.fields = fields ? fields : [];
	return form;
}

/**
 * Add processors to a form model
 */
async function addProcessorsToForm(form) {
	const processors = await FormProcessorModel.find({ form: form._id });
	//@TODO Add type labels
	form.processors = processors ? processors : [];
	return form;
}

/**
 * Add conditionals to a form model
 */
async function addConditionalsToForm(form) {
	const conditionals = await FormConditionalModel.find({ form: form._id });
	//@TODO Add type labels
	form.conditionals = conditionals ? conditionals : [];
	return form;
}

/**
 * Add all related data to a form model
 */
async function populateForm(form) {
	form = await addFieldsToForm(form);
	form = await addProcessorsToForm(form);
	form = await addConditionalsToForm(form);
	return form;
}

module.exports = {
	populateForm,
	newForm: (type) => {},
	all: () => FormModel.find().sort({ _id: -1 }),
	getFormEntries: ({ formId }) => {
		return FormEntryModel.find({ form: formId })
			.sort({ _id: -1 })
			.then(async (entries) => {
				const returnValue = await entries.map(async (entry) => {
					const values = await FormEntryValue.find({
						entry: entry._id,
					});
					return {
						...entry,
						values,
					};
				});
				return returnValue;
			});
	},
	findByFormId: async (ID) => {
		let form = await FormModel.findOne({ ID });
		form = await populateForm(form);
		return form;
	},
	deleteAll: () => {
		return FormModel.deleteMany({});
	},
	findForm: async (_id) => {
		let form = await FormModel.findOne({ ID });
		form = await populateForm(form);
		return form;
	},
	create: async (args) => {
		try {
			return FormModel({
				_id: mongoose.Types.ObjectId(),
				...args,
			}).save();
		} catch (e) {
			console.log(e);
		}
	},
	updateForm: async (update) => {
		const { _id, name, ID } = update;
		try {
			const existing = await FormModel.findOne({ _id });
			existing.name = name ? name : existing.name;
			existing.ID = ID ? ID : existing.ID;
			return existing.save();
		} catch (e) {
			console.log(e);
		}
	},
	//## Form Fields
	//### Add a field to the form
	createField: async (args) => {
		try {
			return FieldModel({
				_id: mongoose.Types.ObjectId(),
				...args,
			}).save();
		} catch (e) {
			console.log(e);
		}
	},
	//### Update a field of the form
	updateField: async ({ field }) => {
		const { _id } = field;
		return FieldModel.findOneAndUpdate(
			{ _id },
			{ $set: field },
			{
				overwrite: true,
				useFindAndModify: false,
			},
		);
	},
	// ## Form Processors
	//### New proceesor
	createProcessor: async ({ processorId, type, formId }) => {
		try {
			return FormProcessorModel({
				_id: mongoose.Types.ObjectId(),
				type,
				processorId,
				form: formId,
			}).save();
		} catch (e) {
			console.log(e);
		}
	},
	//### Edit processor
	updateProcessor: async ({ processor }) => {
		const { _id } = processor;
		return FormProcessorModel.findOneAndUpdate(
			{ _id },
			{ $set: processor },
			{
				overwrite: true,
				useFindAndModify: true,
			},
		);
	},
	// ## Form conditionals
	//### New condtional
	createConditional: async ({ type, formId }) => {
		try {
			return FormConditionalModel({
				_id: mongoose.Types.ObjectId(),
				type,
				form: formId,
			}).save();
		} catch (e) {
			console.log(e);
		}
	},
	//### Edit conditonal
	updateConditional: async ({ conditional }) => {
		const { _id } = conditional;
		return FormConditionalModel.findOneAndUpdate(
			{ _id },
			{ $set: conditional },
			{
				overwrite: true,
				useFindAndModify: true,
			},
		);
	},
	//Create a form entry
	newEntry: async ({ formId, entryValues }) => {
		try {
			let entry = await FormEntryModel({
				_id: mongoose.Types.ObjectId(),
				form: formId,
			}).save();
			if (entryValues.length) {
				const saves = [];
				entryValues.forEach(async (entryValue) => {
					const { value, fieldId } = entryValue;
					saves.push({
						_id: mongoose.Types.ObjectId(),
						entry: entry._id,
						field: fieldId,
						value,
					});
				});
				try {
					const saved = FormEntryValue.create(saves)
						.then((value) => {
							if (!entry.hasOwnProperty('values')) {
								entry.values = [];
							}
							entry = {
								...entry,
								values: [...entry.values, value],
							};
						})
						.catch((e) => console.log(112111111, e));
					saved.then((r) => console.log(r));
					return entry;
				} catch (e) {
					console.log(e);
				}

				return entry;
			}
		} catch (e) {
			console.log(e);
		}
	},
	//get all entrie values for an entry
	entryValues: async ({ entryId }) => {
		try {
			const entriesValues = FormEntryValue.find({ entry: entryId }).then(
				(entries) => {
					console.log(1, entries);
					return entries;
				},
			);
			return entriesValues;
		} catch (e) {
			console.log(e);
		}
	},
	findEntry: async (_id) => {
		return FormEntryModel.findOne({ _id }).then(async (entry) => {
			entry.values = await FormEntryValue.find({ entry: entry._id }).then(
				async (entryValues) => {
					if (!entryValues.length) {
						return entryValues;
					}
					entryvalues = await entryValues.map(async (entryValue) => {
						const field = await FieldModel.findOne({
							_id: entryValue.field,
						});
						entryValue.field = field;
						entryValue.entry = entry;
						return entryValue;
					});
					console.log(entryValues);
					return entryValues;
				},
			);

			entry.field = await FieldModel.findOne({ _id: entry.field });
			return entry;
		});
	},
};
