import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls } from '@wordpress/block-editor';
import { Placeholder } from '@wordpress/components';
import React, { Fragment } from 'react';
import { SimpleFormChooser } from '../Components/SimpleFormChooser';
import Submittable from '../Components/Forms/Submittable';
import { CalderaQLProvider } from './CalderaQLProvider';

const Editor = ({ attributes, setAttributes, className }) => {
	const { formId } = attributes;
	const onChange = (formId) => setAttributes({ formId });
	const props = { formId, onChange };

	return (
		<Fragment>
			<InspectorControls>
				<CalderaQLProvider>
					<SimpleFormChooser {...props} />
				</CalderaQLProvider>
			</InspectorControls>
			{'string' !== typeof formId ? (
				<CalderaQLProvider>
					<SimpleFormChooser {...props} />
				</CalderaQLProvider>
			) : (
				<CalderaQLProvider>
					<Submittable formId={formId} className={className} />
				</CalderaQLProvider>
			)}
		</Fragment>
	);
};

const edit = (props) => {
	return <Editor {...props} />;
};
const save = () => {
	return null;
};
const blockConfig = require('./formBlock.json');
const {
	title,
	keywords,
	description,
	icon,
	category,
	name,
	attributes,
} = blockConfig;

const options = {
	title,
	keywords,
	description,
	icon,
	category,
	attributes,
	edit,
	save,
};

registerBlockType(name, options);
