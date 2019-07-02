import React, { Fragment, useContext, useEffect, useState } from 'react';
import ListEntries from '../Entry/ListEntries';
import { Row, Column, SelectField } from '@calderajs/components';
import { CurrentFormContext, CurrentFormProvider } from '../CurrentForm';
import ErrorBoundary from '../ErrorBoundary';
import { FormsList, FormEntryViewer } from '@calderajs/builder';
import Form from '../Forms/Single';
export const TheEntryViewer = () => {
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
