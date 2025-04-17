import { Link } from 'react-router';
import { SVG } from '../../SVG';
import styles from './link.module.scss';
import { LinkProps } from 'react-router';

function CustomLink(props: LinkProps) {
	const { className, to } = props;
	return (
		<div className={styles.link + (className ? ` ${className}` : '')}>
			<SVG.link />
			<Link target="_blank" to={to}>
				{to.toString()}
			</Link>
		</div>
	);
}
export default CustomLink;
