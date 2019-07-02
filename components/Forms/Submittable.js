import React, { createElement } from 'react';
import Preview from './Preview';
import Single from './Single';
import SingleEntry from '../Entry/SingleEntry';
import CreateEntry from '../Entry/CreateEntry';
export default function Submittable({ formId, renderEntry, className }) {
	return (
		<Single
			formId={formId}
			render={({ form }) => {
				return (
					<CreateEntry
						form={form}
						formId={form._id}
						render={({ onSubmit }) => {
							return (
								<Preview
									form={form}
									onSubmit={onSubmit}
									className={className}
								/>
							);
						}}
						success={({ entryId }) => {
							return (
								<SingleEntry
									render={renderEntry}
									entryId={entryId}
									form={form}
								/>
							);
						}}
					/>
				);
			}}
		/>
	);
}
