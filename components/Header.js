import Link from 'next/link';
import { withRouter } from 'next/router';

const Header = ({ router: { pathname } }) => (
	<header>
		<Link prefetch href="/">
			<a className={pathname === '/' ? 'is-active' : ''}>Home</a>
		</Link>
		<Link prefetch href="/forms">
			<a className={pathname === '/forms' ? 'is-active' : ''}>Forms</a>
		</Link>
		<a className={''} href="http://localhost:5101/graphql">
			graphql
		</a>
		<style jsx>{`
			header {
				margin-bottom: 25px;
			}
			a {
				font-size: 14px;
				margin-right: 15px;
				text-decoration: none;
			}
			.is-active {
				text-decoration: underline;
			}
		`}</style>
	</header>
);

export default withRouter(Header);
