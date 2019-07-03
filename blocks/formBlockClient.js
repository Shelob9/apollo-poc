import { render } from 'react-dom';
import Submittable from '../Components/Forms/Submittable';
import { CalderaQLProvider } from './CalderaQLProvider';

/**
 * All DOM elements with block
 * @type {NodeListOf<Element>}
 */
const elements = document.querySelectorAll('.wp-block-calderajs-form');

/**
 * If found elements, mount them.
 */
if (elements.length) {
	elements.forEach((element) => {
		render(
			<CalderaQLProvider>
				<Submittable formId={element.getElementsByClassName('cf-gp')[0].dataset.form} />
			</CalderaQLProvider>,
			element,
		);
	});
}
