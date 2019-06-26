import React, { createElement } from 'react';
import Preview from './Preview';
import Single from './Single';
import { CreateEntry, SingleEntry } from '../Entry';
export default function Submittable({ formId, renderEntry,className }) {
	return (
		<Single
			formId={formId}
			render={({ form }) => {
				return (
					<CreateEntry
						form={form}
						formId={form._id}
						render={({ onSubmit }) => {
							return <Preview form={form} onSubmit={onSubmit} className={className} />;
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
