const { gql } = require('apollo-server-express');

const typeDefs = gql`
	# Queries
	type Query {
		## @todo
		login(username: String): String
		## Forms
		### Forms
		getForm(ID: String, _id: ID): Form
		forms: [Form]
		entries(formId: ID!): [FormEntry]
		findEntry(entryId: ID!): FormEntry
		## Users
		users: [User]
		user(_id: ID!): User
		userByName(name: String!): User
		## Accounts
		account(_id: ID!): Account
		accounts: [Account]
		accountByApiKey(apiKey: String!): [Account]
		## Lists
		list(_id: ID!): List
		lists: [List]
		### Merge fields
		listFields(listId: String): [MergeField]
		### Interest Categories
		listCategories(listId: String): [InterestCategory]
		### Interests
		listInterests(listId: String): [Interest]
	}

	# Inputs

	## Update a form field
	input FormFieldUpdateInput {
		_id: ID!
		label: String
		fieldId: String
		defaultValue: String
		fieldType: String
		description: String
		required: Boolean
		form: String
	}

	## Update form processor
	input ProcessorUpdateInput {
		_id: ID!
		label: String
		type: String
		#config
	}

	input ConditionalUpdateInput {
		_id: ID!
		label: String
	}

	input FormUpdateInput {
		_id: ID!
		ID: String
		name: String
	}

	input EntryValueInput {
		fieldId: String!
		value: String
	}
	# Mutations
	type Mutation {
		## Users
		### Register user (@todo - record auth token)
		createUser(name: String): User
		#$# Update a user
		updateUser(_id: String, name: String): User

		## Forms
		### Forms
		newForm(ID: String!, name: String!): Form
		updateForm(_id: ID!, name: String, ID: String): Form
		### Form Field
		newField(fieldId: String!, formId: String!): Field
		updateField(field: FormFieldUpdateInput): Field

		### Form Processor
		newProcessor(
			processorId: String!
			type: String!
			formId: String!
		): Processor
		updateProcessor(processor: ProcessorUpdateInput): Processor

		### Form Conditional
		newConditional(type: String!, formId: String!): Conditional
		updateConditional(conditinal: ConditionalUpdateInput): Conditional

		## Form Entries
		newEntry(formId: String!, entryValues: [EntryValueInput]): FormEntry
		## Email list/ Mailchimp
		## Add account (@todo specify vendor)
		addAccount(apiKey: String, users: [ID]): Account

		## Update lists/ account details by querying vendor API
		refreshAccount(_id: String): Account
		## Update merge vars/ intrests detail for one list by querying vendor API
		refreshList(_id: String): List
	}
	# Caldera
	type Caldera {
		_id: ID
		forms: [Form!]
	}
	# Forms
	## Form
	type Form {
		_id: ID
		name: String
		## Portable ID for form
		ID: String
		fields: [Field!]
		conditionals: [Conditional!]
		processors: [Processor!]
	}

	## Form Fields
	type Field {
		_id: ID
		fieldId: String
		label: String
		defaultValue: String
		fieldType: String
		description: String
		required: Boolean
		form: Form
		#options: [Option]
	}

	## Form Processors
	type Processor {
		_id: ID
		processorId: String
		typeLabel: String
		type: String
		label: String

		## Values to process with ??
		# config
	}

	# One line in

	## Form conditional
	type Conditional {
		_id: ID
		name: String!
		type: String!
		fields: [Field!]
		group: [ConditionalGroup]
		form: Form
	}
	### One line in a conditional rule
	type ConditionalLine {
		parent: ConditionalRule
		field: Field
		# should be enum!
		compare: String
		value: String
	}

	### A group of lines making up a rule in a conditional
	type ConditionalRule {
		parent: ConditionalGroup
		lines: [ConditionalLine]
	}

	## Form entries
	### Form Entry
	type FormEntry {
		_id: ID
		form: Form
		values: [FormEntryValues]
	}

	### Form Entry Values
	type FormEntryValues {
		_id: ID
		entry: FormEntry
		field: Field
		value: String
	}

	### A group of conditinal rules
	type ConditionalGroup {
		_id: ID
		rules: [ConditionalRule]
	}

	# Mailchimp/ Email Marketting
	## Account
	type Account {
		_id: ID!
		apiKey: String
		accountId: String
		name: String
		users: [User]
	}

	## List
	type List {
		_id: ID!
		accounts: [Account]
		listId: String
		name: String
	}
	## Merge field
	type MergeField {
		_id: ID!
		mergeId: String!
		tag: String!
		name: String!
		type: String!
		required: Boolean
		defaultValue: String
		public: Boolean
		displayOrder: Int
		helpText: String
		listId: String
	}
	## Groups of interests for a list
	type InterestCategory {
		_id: ID!
		listId: String!
		categoryId: String!
		title: String!
		type: String!
		displayOrder: Int
	}
	## Intrests of a specific category
	type Interest {
		_id: ID!
		categoryId: String!
		interestId: String!
		name: String
		displayOrder: Int
	}
	# Users
	type User {
		_id: ID!
		name: String
	}
`;

module.exports = typeDefs;
