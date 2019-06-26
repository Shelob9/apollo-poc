const MAILCHIMP = require('./mailchimp');
const mongoose = require('./client');
const Schema = mongoose.Schema;

/**
 * Schema representing account on 3rd-party provider
 */
const AccountSchema = new Schema({
	apiKey: String,
	accountId: String,
	name: String,
	users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

/**
 * When account apiKey is saved, update details via remote API.
 */
AccountSchema.post('save', function(account, next) {
	MAILCHIMP.addAccount(account.apiKey).then((results) => {
		AccountModel.update({
			...account,
			name: results.name,
			accountId: results.id,
		});
	});
	next();
});

/**
 * Model representing account on 3rd-party provider
 */
const AccountModel = mongoose.model('Account', AccountSchema);

module.exports = {
	getAccounts: () =>
		AccountModel.find()
			.sort({ _id: -1 })
			.populate('users')
			.exec(),
	getAccount: (_id) => AccountModel.findOne({ _id }),
	createAccount: ({ apiKey, users }) => {
		return AccountModel({ apiKey, users })
			.save()
			.then((r) => {
				console.log(r);
				return r;
			})
			.catch((e) => console.log(e));
	},
	deleteAccount: (args) => {
		const { _id } = args;

		AccountModel.remove({ _id }, (error) => {
			if (error) {
				console.log('Error Removing: ', error);
			}
		});

		return args;
	},
	updateAccount: (args) => {
		const { _id, name, apiKey } = args;

		AccountModel.update(
			{ _id },
			{
				$set: { name, apiKey },
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
