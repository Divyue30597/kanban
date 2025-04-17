import styles from './kanban.module.scss';
import Tabs from '../../../components/Tabs';
import BoardSettings from './Board';
import CardSettings from './Card';
import ColumnSettings from './Column';

function KanbanSettings() {
	const tabs = [
		{
			id: 'board',
			label: <p className={styles.label}>Board</p>,
			children: <BoardSettings />,
		},
		{
			id: 'column',
			label: <p className={styles.label}>Columns</p>,
			children: <ColumnSettings />,
		},
		// {
		//   id: "card",
		//   label: <p className={styles.label}>Card</p>,
		//   children: <CardSettings />,
		// },
	];

	return (
		<div className={styles.kanbanSettings}>
			<h2>Kanban Settings</h2>
			<Tabs className={styles.tabBtn} tabs={tabs} />
		</div>
	);
}

export default KanbanSettings;
