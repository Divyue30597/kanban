import { Outlet } from 'react-router';
import BoardHeader from './Header';

function Home() {
	return (
		<>
			<BoardHeader />
			<Outlet />
		</>
	);
}

export default Home;
