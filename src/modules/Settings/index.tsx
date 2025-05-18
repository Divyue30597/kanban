import { Link, Outlet } from 'react-router';
import styles from './settings.module.scss';
import Box from '../../components/Box';
import Section from '../../components/Section';
import { SETTINGS } from '../../constants/const';

export default function Settings() {
	return (
		<Section className={styles.settingsContainer}>
			<h1>Settings</h1>
			<div className={styles.settings}>
				{SETTINGS.map((setting) => (
					<Link to={`/settings/${setting.name.toLowerCase()}`} key={setting.name}>
						<Box className={styles.setting} key={setting.name}>
							<div className={styles.icon}>{setting.icon}</div>
							<h3>{setting.name}</h3>
							<p>{setting.description}</p>
						</Box>
					</Link>
				))}
			</div>
			<hr className={styles.hr} />
			<Outlet />
		</Section>
	);
}
