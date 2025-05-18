import styles from './calendarDropDown.module.scss';
import Button from '../Button';
import Dropdown from '../Dropdown';
import { SVG } from '../../SVG';

interface CalendarDropDownProps {
	calendarModes: Array<{ id: string; title: string }>;
	calendarMode: { id: string; title: string };
	setCalendarMode: (mode: { id: string; title: string }) => void;
}

function CalendarDropDown(props: CalendarDropDownProps) {
	const { calendarModes, calendarMode, setCalendarMode } = props;

	return (
		<Dropdown
			className={styles.dropdownBtn}
			placement="bottom-right"
			trigger={<Button icon={<SVG.chevronDown />}>{calendarMode.title}</Button>}
		>
			{calendarModes?.map((mode) => (
				<button
					type="button"
					key={mode.id}
					onClick={() => {
						setCalendarMode(mode);
					}}
				>
					{mode.title}
				</button>
			))}
		</Dropdown>
	);
}

export default CalendarDropDown;
