import React, {
	Fragment,
	useContext,
	useEffect,
	useState,
	useRef,
} from 'react';
import { Form, FormList, FormPreview } from '../Forms';
import EditablePreview from '../Forms/EditablePreview';
import { ListEntries } from '../Entry';
import { Row, Column, SelectField } from '@calderajs/components';
import { CurrentFormContext, CurrentFormProvider } from '../CurrentForm';
import ErrorBoundary from '../ErrorBoundary';
import { FormsList, FormEntryViewer } from '@calderajs/builder';
import { SimpleFormChooser } from '../SimpleFormChooser';
import FormEditablePreview from '../Forms/EditablePreview';
import { TheEntryViewer } from './TheEntryViewer';

export const PreviewWithEntryViewer = ({ entryViewerForm, currentFormId }) => {
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
					/**
					 * Paper over incositancies in API for forms.
					 */
					const [theForm, setTheForm] = useState({ form });
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

					/**
					 * Paper over inconsitencies in API for entries.
					 */
					const [theEntry, setTheEntry] = useState(entry);
					const entryPrepared = useRef(false);
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
						entryPrepared.current = true;
					}, [entry, setTheEntry]);

					if (!theEntry.hasOwnProperty('entryValues')) {
						if (true === entryPrepared.current) {
							return <div>Can not display entry</div>;
						}
						return <Fragment />;
					}
					return (
						<div>
							<p class="alert alert-sucess">Success Message</p>
							<FormEntryViewer
								form={theForm}
								entries={[theEntry]}
							/>
						</div>
					);
				}}
			/>
		</ErrorBoundary>
	);
};

export const FormPreviewForEditor = ({ entryViewerForm }) => {
	const { currentFormId } = useContext(CurrentFormContext);
	return (
		<PreviewWithEntryViewer
			currentFormId={currentFormId}
			entryViewerForm={entryViewerForm}
		/>
	);
};
