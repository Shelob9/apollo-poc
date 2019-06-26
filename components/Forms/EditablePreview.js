import React, { createElement } from 'react';
import Preview from './Preview';
import Single from './Single';
import Submittable from './Submittable';
import { CreateEntry, SingleEntry } from '../Entry';
export default function EditablePreview(props) {
	return <Submittable {...props} />;
}
