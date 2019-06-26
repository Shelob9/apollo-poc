import App from '../components/App';
import Header from '../components/Header';
//import FormsAdminApp from '../components/FormAdminApp';

import dynamic from 'next/dynamic';

const FormsAdminApp = dynamic(() => import('../components/FormAdminApp'), {
	ssr: false,
});

export default () => (
	<App>
		<Header />
		<article>
			<h1>Forms</h1>
			<FormsAdminApp />
		</article>
	</App>
);
