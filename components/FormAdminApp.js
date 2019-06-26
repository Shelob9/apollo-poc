import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Form, FormPreview, FormList, FormEditablePreview } from './Forms';
import { ListEntries } from './Entry';
import { Row, Column, SelectField } from '@calderajs/components';
import { CurrentFormContext, CurrentFormProvider } from './CurrentForm';
import { FormsList, FormEntryViewer } from '@calderajs/builder';
import ErrorBoundary from './ErrorBoundary';
import { SimpleFormChooser } from './SimpleFormChooser';
const FieldEditor = ({ fieldId, formId, onChange }) => {
	return (
		<div>
			<p>fieldId</p>

			<p>{fieldId}</p>
			<p>formId</p>

			<p>{formId}</p>
		</div>
	);
};

const Editor = ({ entryViewerForm, setEntryViewerForm }) => {
	
	const { currentFormId, setCurrentFormId } = useContext(CurrentFormContext);
	const onCloseForm = () => {
		setCurrentFormId('');
		setEntryViewerForm('');
	};
	if (currentFormId) {
		return (
			<div>
				<button onClick={onCloseForm}>Close Form</button>
				<FieldEditor formId={currentFormId} />
			</div>
		);
	}

	return (
		<div>
			<FormList
				render={({ forms }) => {
					const [theForms, setTheForms] = useState(forms);
					useEffect(() => {
						const _forms =
							'object' === typeof forms &&
							forms.hasOwnProperty('forms')
								? forms.forms
								: forms;

						const __forms = _forms.length
							? _forms.map((form) => {
									const formID = form.hasOwnProperty('formId')
										? form.formId
										: form.hasOwnProperty('ID')
										? form.ID
										: form._id;

									return {
										...form,
										formID,
										id: formID,
									};
							  })
							: [];
						setTheForms(__forms);
					}, [forms, setTheForms]);

					return (
						<FormsList
							items={[
								{
									icon: 'edit',
									label: 'Edit Form',
									actionName: 'edit',
								},
								{
									icon: 'list-view',
									label: 'View Entries',
									actionName: 'view-entries',
								},
							]}
							forms={theForms}
							panelTitle={'Forms'}
							noFormsMessage={'No Forms Found'}
							onFormAction={(formId, actionName) => {
								switch (actionName) {
									case 'view-entries':
										const _form = theForms.find(
											(_form) =>
												formId === _form._id ||
												formId === _form.ID,
										);
										if (_form) {
											formId = _form._id;
										}
										setEntryViewerForm(formId);
										setCurrentFormId(_form.ID);
										break;
									case 'edit':
									default:
										setCurrentFormId(formId);
										break;
								}
							}}
						/>
					);
				}}
			/>
		</div>
	);
};

const TheEntryViewer = () => {
	const { currentFormId } = useContext(CurrentFormContext);

	return (
		<Form
			formId={currentFormId}
			render={({ form }) => {
				/** This is a hack to format entry values */
				const [theForm, setTheForm] = useState(form);
				useEffect(() => {
					const fields = form.fields.length
						? form.fields.map((field) => {
								return {
									...field,
									id: field._id,
								};
						  })
						: [];
					setTheForm({
						...form,
						fields,
					});
				}, [form, setTheForm]);
				return (
					<ListEntries
						formId={form._id}
						form={theForm}
						render={({ form, entries }) => {
							return (
								<FormEntryViewer
									form={form}
									entries={entries}
								/>
							);
						}}
					/>
				);
			}}
		/>
	);
};
/**
 * Preview a form during editting
 */
const Preview = ({ entryViewerForm, forms }) => {
	const { currentFormId } = useContext(CurrentFormContext);

	if (entryViewerForm) {
		return <TheEntryViewer />;
	}
	if (!currentFormId) {
		return <Fragment />;
	}

	return (
		<ErrorBoundary>
			<FormEditablePreview
				formId={currentFormId}
				renderEntry={({ form, entry }) => {
					const [theForm, setTheForm] = useState({ form });
					const [theEntry, setTheEntry] = useState(entry);
					useEffect(() => {
						const fields = form.fields.length
							? form.fields.map((field) => {
									return {
										...field,
										id: field._id,
									};
							  })
							: [];
					}, [form, setTheForm]);

					useEffect(() => {
						let entryValues = {};
						const entryId = entry._id;
						entry.values.forEach((value) => {
							const fieldId = value.field._id;
							const entryValueId = value._id;
							entryValues[entryValueId] = {
								fieldId,
								formId: currentFormId,
								slug: fieldId,
								entryId,
								id: entryValueId,
								value: value.value,
							};
						});
						setTheEntry({
							...entry,
							id: entryId,
							entryValues,
						});
					}, [entry, setTheEntry]);
					if (!entry.hasOwnProperty('entryValues')) {
						return <div>204</div>;
					}
					return (
						<FormEntryViewer form={theForm} entries={[theEntry]} />
					);
				}}
			/>
		</ErrorBoundary>
	);
};

/**
 * Responsible for controlling layout of form admin app
 */
const Layout = (props) => {
	const { currentFormId } = useContext(CurrentFormContext);
	const [entryViewerForm, setEntryViewerForm] = useState(null);

	return (
		<Row>
			<Column width={currentFormId ? 0.75 : 0.1}>
				<Preview {...props} entryViewerForm={entryViewerForm} />
			</Column>
			<Column width={currentFormId ? 0.25 : 0.9}>
				<Editor {...props} setEntryViewerForm={setEntryViewerForm} />
			</Column>
		</Row>
	);
};
export default function FormsAdminApp() {
	return (
		<CurrentFormProvider>
			<Layout />
		</CurrentFormProvider>
	);
}
