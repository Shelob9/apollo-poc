const UserModel = require('../models/UserModel');
const AccountModel = require('../models/AccountModel');
const MergeFieldModel = require('../models/MergeFieldModel');
const InterestCategoryModel = require('../models/InterestCategoryModel');
const InterestModel = require('../models/InterestModel');
const FormModel = require('../models/FormModel');
const ListModel = require('../models/ListModel');
const {
	getIntrestCategories,
	updateAccount,
	clientFactory,
	getMergeFields,
	getCategoryInterests,
} = require('../models/mailchimp');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const JWT_SECRET = '111';
const resolvers = {
	Mutation: {
		//# forms
		//## Create a form
		newForm: async (parent, { name, ID }) => {
			try {
				const form = await FormModel.create({ name, ID });
				return form;
			} catch (e) {
				console.log(e);
			}
		},
		//## Update a form
		updateForm: async (parent, args) => {
			try {
				const form = await FormModel.updateForm(args);
				return form;
			} catch (e) {
				console.log(e);
			}
		},
		//# Fields
		// ## Create a field
		newField: async (parent, { fieldId, formId }) => {
			try {
				const field = await FormModel.createField({
					fieldId,
					form: formId,
				});
				return field;
			} catch (e) {
				console.log(e);
			}
		},
		//## Update a field
		updateField: async (parent, args) => {
			try {
				const field = await FormModel.updateField(args);
				return field;
			} catch (e) {
				console.log(e);
			}
		},
		//# Processors
		// ## Create a processor
		newProcessor: async (parent, args) => {
			try {
				const processor = await FormModel.createProcessor(args);
				return processor;
			} catch (e) {
				console.log(e);
			}
		},
		// ## Create a processor
		updateProcessor: async (parent, args) => {
			try {
				const processor = await FormModel.updateProcessor(args);
				return processor;
			} catch (e) {
				console.log(e);
			}
		},
		// # Conditionals
		// ## Create a conditional
		newConditional: async (parent, args) => {
			try {
				const conditional = await FormModel.createConditional(args);
				return conditional;
			} catch (e) {
				console.log(e);
			}
		},
		// ## Create a processor
		updateConditional: async (parent, args) => {
			try {
				const conditional = await FormModel.updateConditional(args);
				return conditional;
			} catch (e) {
				console.log(e);
			}
		},
		//# Form entries
		//## Create entry
		newEntry: async (parent, args) => {
			try {
				const entry = await FormModel.newEntry(args);
				return entry;
			} catch (e) {
				console.log(e);
			}
		},
		createUser(parent, { name }) {
			const user = UserModel.createUser({ name });
			return user;
		},
		updateUser(parent, { _id, name }) {
			const user = UserModel.updateUser({ name });
			return user;
		},
		addAccount(parent, { apiKey, users }) {
			const account = AccountModel.createAccount({ apiKey, users });
			return account;
		},
		refreshList(parent, { _id }) {
			ListModel.getList(_id).then((list) => {
				const { listId } = list;
				InterestModel.deleteAllForList(list);
				const apiKey = list.accounts[0].apiKey;
				const mailchimp = clientFactory(apiKey);
				InterestCategoryModel.deleteAllForList(listId)
					.then(() => {
						getIntrestCategories(mailchimp, listId)
							.then((categories) => {
								if (categories.length) {
									categories.forEach((category) => {
										const categoryId = category.id;
										let categoryData = {
											categoryId,
											title: category.title,
											type: category.type,
											listId,
											displayOrder:
												category.display_order,
											interests: [],
										};

										getCategoryInterests(
											mailchimp,
											listId,
											categoryId,
										)
											.then((results) => {
												if (
													results.hasOwnProperty(
														'interests',
													) &&
													results.interests.length
												) {
													results.interests.forEach(
														(interest) => {
															InterestModel.create(
																{
																	_id: mongoose.Types.ObjectId(),
																	listId,
																	categoryId,
																	intrestId:
																		interest.id,
																	name:
																		interest.name,
																	displayOrder:
																		interest.display_order,
																},
															).then(
																({
																	name,
																	_id,
																}) => {
																	console.log(
																		`Interest ${name} Saved`,
																	);
																	categoryData.interests.push(
																		_id,
																	);
																},
															);
														},
													);
													InterestCategoryModel.create(
														{
															...categoryData,
															_id: mongoose.Types.ObjectId(),
														},
													)

														.then((r) =>
															console.log(
																'Intrest Saved',
															),
														)
														.catch((e) =>
															console.log(e),
														);
												}
											})
											.catch((e) => console.log(e));
									});
								}
							})
							.catch((e) => console.log(e));
					})
					.catch((e) => {
						throw e;
					});

				MergeFieldModel.deleteFieldsOfList(listId).then(() => {
					getMergeFields(mailchimp, listId).then((results) => {
						if (results.hasOwnProperty('merge_fields')) {
							results.merge_fields.map((result) => {
								MergeFieldModel.create({
									_id: mongoose.Types.ObjectId(),
									mergeId: result.merge_id,
									tag: result.tag,
									name: result.name,
									type: result.type,
									required: result.required,
									defaultValue: result.default_value,
									public: result.public,
									displayOrder: result.display_order,
									helpText: result.help_text,
									listId: listId,
								});
							});
						}
					});
				});
			});
		},
		refreshAccount(parent, { _id }) {
			AccountModel.getAccount(_id)
				.then((account) => {
					const mailchimp = clientFactory(account.apiKey);
					updateAccount(mailchimp).then((results) => {
						if (results.length) {
							results.map((list) => {
								ListModel.createList({
									_id: mongoose.Types.ObjectId(),
									name: list.name,
									listId: list.id,
									accounts: [account._id],
								})
									.then((r) => {
										return r;
									})
									.catch((e) => {
										throw e;
									});
							});
						}
						return account;
					});
				})
				.then((e) => {
					console.log(e);
					throw e;
				});
		},
	},
	Query: {
		//@TODO
		login(parent, { username }) {
			const user = db.users.find((user) => user.name === username);
			if (!user) {
				throw Error('username was incorrect');
			}
			const token = jwt.sign({ id: user.id }, JWT_SECRET);
			return token;
		},
		//# Users
		//## List all
		users() {
			return UserModel.getUsers();
		},
		//## Find by _id
		user(parent, { _id }) {
			return UserModel.getUser(_id);
		},
		//## Find by name
		userByName(parent, { name }) {
			return UserModel.getUserByName(name).then((user) => {
				return user[0];
			});
		},
		//# Forms
		//## Get a form by ID (not _id)
		getForm(parent, { ID, _id }) {
			if (_id) {
				return FormModel.findForm(_id);
			}
			return FormModel.findByFormId(ID);
		},
		//## Get all forms
		forms() {
			return FormModel.all().then((forms) => {
				return forms.map(async (form) => {
					form = await FormModel.populateForm(form);
					return form;
				});
			});
		},
		//## Form entries
		entries: async (parent, { formId }) => {
			return FormModel.getFormEntries({ formId });
		},
		findEntry: async (parent, { entryId }) => {
			return FormModel.findEntry(entryId);
		},
		//# Email Lists/ MailChimp
		//## Accounts
		accounts() {
			return AccountModel.getAccounts();
		},
		account(parent, { _id }) {
			return AccountModel.getAccount(_id);
		},
		accountByApiKey(parent, { apiKey }) {},

		//## Lists
		lists() {
			return ListModel.getLists();
		},
		list(parent, { _id }) {
			return ListModel.getList(_id);
		},
		//## List Fields/ Merge Vars
		listFields(parent, { listId }) {
			return MergeFieldModel.getFields(listId);
		},
		//Interest categories of lists
		listCategories(parent, { listId }) {
			return InterestCategoryModel.byList(listId);
		},
		//Intrests of list
		listInterests(parent, { listId }) {
			return InterestModel.byList(listId);
		},
	},
};

module.exports = resolvers;
