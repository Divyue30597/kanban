import React from 'react';
import styles from './card.module.scss';
import CustomLink from '../Link';
import { getTagColors } from '../../utils/utils';
import CheckboxWithText from '../CheckboxWithText';
import { useAppSelector } from '../../store/hooks';
import { selectCardById } from '../../store/selectors';
import { Subtask } from '../../store/types';

export interface CardType extends React.HTMLAttributes<HTMLDivElement> {
	id: string;
	columnId: string;
	boardId: string;
	className?: string;
	onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
}

export default function Card(props: CardType) {
	const { id, columnId, boardId, className, onDragStart, ...rest } = props;

	const cardData = useAppSelector((state) => selectCardById(state, id));

	const { title, description, subTasks, tags, links, images } =
		cardData || {};

	const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
		e.dataTransfer.setData('cardId', id);
		e.dataTransfer.setData(
			'cardData',
			JSON.stringify({
				id,
				title,
				description,
			})
		);

		e.dataTransfer.effectAllowed = 'move';

		if (onDragStart) {
			onDragStart(e);
		}
	};

	return (
		<div
			{...rest}
			className={styles.card + (className ? ` ${className}` : '')}
			draggable={true}
			onDragStart={handleDragStart}
			data-card-id={id}
		>
			<h1 className={styles.heading}>{title}</h1>
			<p className={styles.description}>{description}</p>
			{subTasks && renderSubTasks({ subTasks, cardId: id })}
			{links && renderLinks({ links })}
			{images && renderImages({ images })}
			{tags && renderTags({ tags })}
		</div>
	);
}

function renderSubTasks(props: { subTasks?: Subtask[]; cardId: string }) {
	const { subTasks, cardId } = props;
	return (
		<div className={styles.subTasks}>
			<h2>Sub tasks</h2>
			{subTasks?.map((subTask, index) => {
				return (
					<div className={styles.subTask} key={index}>
						<CheckboxWithText
							label={subTask.title}
							checked={subTask.done}
							cardId={cardId}
							index={index}
						/>
					</div>
				);
			})}
		</div>
	);
}

function renderTags(props: { tags?: string[] }) {
	const { tags } = props;
	return (
		<div className={styles.tags}>
			{tags?.map((tag, index) => {
				const tagStyles = getTagColors(tag);
				return (
					<div className={styles.tag} key={index} style={tagStyles}>
						{tag}
					</div>
				);
			})}
		</div>
	);
}

function renderLinks(props: { links?: string[] }) {
	const { links } = props;
	return (
		<div className={styles.links}>
			{links?.map((link, index) => {
				return <CustomLink key={index} to={link} />;
			})}
		</div>
	);
}

function renderImages(props: { images?: string[] }) {
	const { images } = props;
	return (
		<div className={styles.images}>
			{images?.map((image, index) => {
				return <img key={index} src={image} alt="" />;
			})}
		</div>
	);
}
