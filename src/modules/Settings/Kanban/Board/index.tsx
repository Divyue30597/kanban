import styles from './boardSetting.module.scss';
import { useState, useEffect } from 'react';
import FormInput from '../../../../components/FormInput';
import Button from '../../../../components/Button';
import BoardDropDown from '../../../../components/BoardDropDown';
import { Board } from '../../../../store/types';
import { SVG } from '../../../../SVG';
import { useAppDispatch } from '../../../../store/hooks';
import {
	createBoard,
	updateBoard,
} from '../../../../store/features/boards/boardSlice';
import { deleteBoardWithRelated } from '../../../../store/thunks';

const boardInputs = [
	{
		id: 'title',
		label: 'Title',
		type: 'text',
		required: true,
		pattern: '^[\\w\\s\\p{P}\\p{S}]+$',
		placeholder: 'e.g. Design Weekly',
		name: 'title',
		errorMessage: 'Heading is required.',
	},
	{
		id: 'description',
		label: 'Description',
		type: 'textarea',
		pattern: '^[\\w\\s\\p{P}\\p{S}]+$',
		minLength: 10,
		maxLength: 200,
		required: true,
		placeholder:
			"e.g. Create wireframes and high-fidelity designs for the app's main screens.",
		name: 'description',
		errorMessage: 'Description is required.',
	},
];

function BoardSettings() {
	return (
		<div className={styles.boardSettings}>
			<BoardSettingForm />
			<BoardSettingForm isUpdating={true} />
			<DeleteBoard />
		</div>
	);
}

function BoardSettingForm({ isUpdating = false }: { isUpdating?: boolean }) {
	const dispatch = useAppDispatch();

	const [activeBoard, setActiveBoard] = useState<string | Board>(
		isUpdating ? 'Pick a board' : ''
	);

	const updating =
		isUpdating &&
		activeBoard !== 'Pick a board' &&
		typeof activeBoard !== 'string';

	const [formState, setFormState] = useState({
		title: updating ? activeBoard.title : '',
		description: isUpdating ? '' : '',
	});

	useEffect(() => {
		if (updating) {
			setFormState({
				title: activeBoard.title,
				description: activeBoard.description,
			});
		}
	}, [activeBoard, updating]);

	const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (updating) {
			dispatch(updateBoard({ ...formState, id: activeBoard.id }));
			setActiveBoard('Pick a board');
		} else {
			dispatch(createBoard(formState));
		}
	};

	const handleOnChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormState((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<form className={styles.form} onSubmit={handleOnSubmit}>
			{isUpdating ? (
				<div className={styles.updateBoard}>
					<p>To Update {'->'}</p>
					<BoardDropDown
						activeBoard={activeBoard}
						setActiveBoard={setActiveBoard}
					/>
				</div>
			) : (
				<h3>Add Board</h3>
			)}
			{boardInputs.map((input) => {
				const {
					id,
					name,
					label,
					required,
					type,
					placeholder,
					errorMessage,
					pattern,
				} = input;

				return (
					<FormInput
						id={id}
						key={name}
						name={name}
						label={label}
						type={type}
						placeholder={placeholder}
						required={required}
						errorMessage={errorMessage}
						pattern={pattern}
						value={formState[name as keyof typeof formState]}
						onChange={handleOnChange}
					/>
				);
			})}
			<Button
				type="submit"
				disabled={activeBoard === 'Pick a board'}
				className={isUpdating ? styles.updateSubmitBtn : ''}
			>
				{isUpdating ? 'Update' : 'Submit'}
			</Button>
		</form>
	);
}

function DeleteBoard() {
	const [delActiveBoard, setDelActiveBoard] = useState<Board | string>(
		'Pick a board'
	);

	const dispatch = useAppDispatch();

	const handleDelete = () => {
		if (typeof delActiveBoard !== 'string') {
			dispatch(deleteBoardWithRelated(delActiveBoard.id));
			setDelActiveBoard('Pick a board');
		}
	};

	return (
		<div className={styles.deleteBoard}>
			<div className={styles.deleteBoardText}>
				<p>Are you sure you want to delete</p>
				<BoardDropDown
					activeBoard={delActiveBoard}
					setActiveBoard={setDelActiveBoard}
				/>
				<p>board?</p>
			</div>
			<p className={styles.deleteAlert}>
				<SVG.alert /> Deleting a board will delete it's column and
				cards.
				<br /> This action is not reversible. Proceed with caution.
			</p>
			<Button
				type="button"
				disabled={
					(delActiveBoard as Board).id === '' ||
					delActiveBoard === 'Pick a board'
				}
				onClick={handleDelete}
				className={styles.deleteBtn}
			>
				Delete
			</Button>
		</div>
	);
}

export default BoardSettings;
