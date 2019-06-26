const mongoose = require('./client');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: String,
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = {
	getUsers: () => UserModel.find().sort({ _id: -1 }),
	getUser: (_id) => UserModel.findOne({ _id }),
	getUserByName: (name) => UserModel.find({ name }),
	createUser: (args) => UserModel(args).save(),
	deleteUser: (args) => {
		const { _id } = args;
		UserModel.remove({ _id }, (error) => {
			if (error) {
				console.log('Error Removing: ', error);
			}
		});

		return args;
	},
	updateUser: (args) => {
		const { _id, name } = args;

		UserModel.update(
			{ _id },
			{
				$set: { name },
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
