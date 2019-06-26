import App from '../components/App';
import Header from '../components/Header';
import { FormList } from '../components/Forms';
export default () => (
	<App>
		<Header />
		<article>
			<h1>Forms</h1>
			<FormList />
		</article>
	</App>
);
