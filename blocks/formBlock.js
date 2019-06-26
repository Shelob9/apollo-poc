import { registerBlockType } from '@wordpress/blocks';
import { InspectorControls } from '@wordpress/block-editor';
import { TextControl } from '@wordpress/components';
import React, { Fragment } from 'react';
import ErrorMessage from '../Components/ErrorMessage';

const Editor = () => {
	return <div>Hello</div>;
};
const edit = () => {
	return <Editor />;
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
