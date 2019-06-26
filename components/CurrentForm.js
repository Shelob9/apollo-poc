import React, { useState, createContext } from 'react';

/**
 * Usage
import {CurrentFormContext } form '?';
const { currentFormId, setCurrentFormId } = useContext(CurrentFormContext);
 */
export const CurrentFormContext = createContext({});

/**
 * Provider for state of current form
 */
export const CurrentFormProvider = ({ children, initialFormId }) => {
	const [currentFormId, setCurrentFormId] = useState(initialFormId);
	return (
		<CurrentFormContext.Provider
			value={{ currentFormId, setCurrentFormId }}
		>
			{children}
		</CurrentFormContext.Provider>
	);
};
