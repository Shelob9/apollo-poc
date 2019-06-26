const mongoose = require("./client");
const Schema = mongoose.Schema;
const { getMergeFields } = require("./mailchimp");
const AccountModel = require("./AccountModel");
const MergeFieldModel = require("./MergeFieldModel");
const ListSchema = new Schema({
  _id: String,
  accounts: [{ type: Schema.Types.ObjectId, ref: "Account" }],
  listId: String,
  name: String
});

const ListModel = mongoose.model("List", ListSchema);

module.exports = {
  getLists: () =>
    ListModel.find()
      .sort({ _id: -1 })
      .populate("accounts")
      .exec(),
  getList: _id =>
    ListModel.findOne({ _id })
      .populate("accounts")
      .exec(),
  createList: args => ListModel(args).save(),
  deleteList: args => {
    const { _id } = args;

    ListModel.remove({ _id }, error => {
      if (error) {
        console.log("Error Removing: ", error);
      }
    });

    return args;
  },
  updateList: args => {
    const { name, account, listId } = args;
    ListModel.update(
      { _id },
      {
        $set: { name, account, listId, name }
      },
      { upsert: true },
      error => {
        if (error) {
          console.log("Error Updating: ", error);
        }
      }
    );
    return args;
  }
};
