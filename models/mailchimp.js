const Client = require('mailchimp-api-v3');

function getMergeFields(mailchimp, listId) {
	return mailchimp.get({
		path: `/lists/${listId}/merge-fields`,
	});
}

function getIntrestCategories(mailchimp, listId) {
	return new Promise(function(resolve, reject) {
		mailchimp
			.get({
				path: `/lists/${listId}/interest-categories`,
			})
			.then((r) => {
				resolve(r.categories);
			})
			.catch((e) => reject(e));
	});
}

function getCategoryInterests(mailchimp, listId,categoryId) {
	return new Promise((resolve, reject) => {
		mailchimp
			.get({
				path: `/lists/${listId}/interest-categories/${categoryId}/interests`,
			})
			.then((r) => resolve(r))
			.catch((e) => reject(e));
	});
}

function getLists(mailchimp) {
	return mailchimp.get({
		path: '/lists',
	});
}

function getListDetails(mailchimp, accountLists) {
	const batches = [];
	Object.values(accountLists).forEach((lists) => {
		Object.values(lists).forEach((list) => {
			if ('object' === typeof list && list.hasOwnProperty('id')) {
				batches.push({
					method: 'get',
					path: `/lists/${list.id}`,
				});
			}
		});
	});
	return mailchimp.batch(batches, {
		wait: true,
		interval: 2000,
		unpack: true,
	});
}

function clientFactory(apiKey) {
	return new Client(apiKey);
}

function updateAccount(mailchimp) {
	return new Promise(function(resolve, reject) {
		getLists(mailchimp)
			.then((lists) => getListDetails(mailchimp, lists))
			.then((results) => resolve(results))
			.catch(function(err) {
				console.log(err);
				reject(err);
			});
	});
}
function addAccount(apiKey) {
	const mailchimp = clientFactory(apiKey);
	return new Promise(function(resolve, reject) {
		getLists(mailchimp)
			.then((lists) => getListDetails(mailchimp, lists))
			.then((results) => resolve(results))
			.catch(function(err) {
				console.log(err);
				reject(err);
			});
	});
}

module.exports = {
	addAccount,
	getListDetails,
	getLists,
	clientFactory,
	updateAccount,
	getIntrestCategories,
	getCategoryInterests,
	getMergeFields,
};
