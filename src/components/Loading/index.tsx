import styles from './Loading.module.scss';
import { SVG } from '../../SVG';
import { createPortal } from 'react-dom';

function loader() {
	return createPortal(
		<div className={styles.loading}>
			<SVG.loading />
			<p>Loading...</p>
		</div>,
		document.body
	);
}

export default loader;
