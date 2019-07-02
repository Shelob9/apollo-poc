import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Form, FormList, FormPreview, FormEditablePreview } from './Forms';
import { ListEntries } from './Entry';
import { Row, Column, SelectField } from '@calderajs/components';
import { CurrentFormContext, CurrentFormProvider } from './CurrentForm';
import ErrorBoundary from './ErrorBoundary';
import { FormsList, FormEntryViewer } from '@calderajs/builder';
import { FormPreviewForEditor } from './FormsAdmin/FormPreviewForEditor';
import { SimpleFormChooser } from './SimpleFormChooser';

const FieldEditor = ({ fieldId, formId, onChange }) => {
	return (
		<div>
			<h2>Field Editor</h2>

			<p>{fieldId}</p>

			<p>{formId}</p>
		</div>
	);
};

const Editor = ({ entryViewerForm, setEntryViewerForm }) => {
	console.log(entryViewerForm);
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
										id: form._id,
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
										setCurrentFormId(formId);
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
/**
 * Preview a form during editting
 */
const Preview = FormPreviewForEditor;
/**
 * Responsible for controlling layout of form admin app
 */
const Layout = (props) => {
	const { currentFormId } = useContext(CurrentFormContext);
	const [entryViewerForm, setEntryViewerForm] = useState(null);

	return (
		<Row>
			{currentFormId && (
				<Column width={currentFormId ? 0.75 : 0.1}>
					<Preview {...props} entryViewerForm={entryViewerForm} />
				</Column>
			)}
			<Column width={currentFormId ? 0.25 : 0.9}>
				<Editor {...props} setEntryViewerForm={setEntryViewerForm} />
			</Column>
		</Row>
	);
};
export default function FormsAdminApp() {
	return (
		<CurrentFormProvider>
			<ErrorBoundary>
				<Layout />
			</ErrorBoundary>
		</CurrentFormProvider>
	);
}
