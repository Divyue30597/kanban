import { useState } from 'react';
import styles from './form.module.scss';
import FormInput, { FormInputProps } from '../FormInput';
import Button from '../Button';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectActiveBoard } from '../../store/selectors';
import { createCardInColumn } from '../../store/thunks';
import { Subtask } from '../../store/types';

const formInputs: FormInputProps[] = [
	{
		id: 'title',
		label: 'Title',
		type: 'text',
		required: true,
		pattern: '^[\\w\\s\\p{P}\\p{S}]+$',
		placeholder: 'e.g. Design Weekly',
		name: 'title',
		errorMessage: 'Heading is required.',
		value: '',
	},
	{
		id: 'description',
		label: 'Description',
		type: 'textarea',
		pattern: '^[\\w\\s\\p{P}\\p{S}]+$',
		minLength: 10,
		maxLength: 200,
		required: true,
		placeholder: "e.g. Create wireframes and high-fidelity designs for the app's main screens.",
		name: 'description',
		errorMessage: 'Description is required.',
		value: '',
	},
	{
		id: 'tags',
		label: 'Tags',
		type: 'text',
		required: true,
		pattern: '^[\\w\\-#@]+(\\s*,\\s*[\\w\\-#@]+)*$',
		minLength: 3,
		maxLength: 20,
		placeholder: 'e.g. UI, Design, UX/UI',
		name: 'tags',
		errorMessage: 'Tags are required.',
		infoMessage: 'Please enter comma separated tags.',
		value: '',
	},
	{
		id: 'links',
		label: 'Links',
		type: 'url',
		required: false,
		placeholder: 'e.g. https://www.figma.com/',
		pattern: '(https?://.+)(\\s*,\\s*https?://.+)*',
		name: 'links',
		errorMessage: 'Links are optional.',
		infoMessage: 'Please enter comma separated URLs.',
		value: '',
	},
	{
		id: 'subTasks',
		label: 'Subtasks',
		type: 'text',
		required: false,
		placeholder: 'e.g. Design the login screen, Fix UI/UX issues',
		pattern: '^[\\w\\s\\p{P}\\p{S}]+(\\s*,\\s*[\\w\\s\\p{P}\\p{S}]+)*$',
		name: 'subTasks',
		errorMessage: 'Subtasks are optional.',
		infoMessage: 'Please enter comma separated subtasks.',
		value: [],
	},
	{
		id: 'images',
		label: 'Images',
		type: 'file',
		required: false,
		accept: 'image/*',
		name: 'images',
		errorMessage: 'Images are optional.',
		infoMessage: 'Please upload images with resolution 1024*1024.',
		value: [],
	},
];

interface FormState {
	title: string;
	description: string;
	tags: string[];
	links?: string[];
	subTasks?: Subtask[];
	images?: File[];
	columnId: string;
}

function Form() {
	const boardId = useAppSelector(selectActiveBoard);
	const dispatch = useAppDispatch();
	const [formState, setFormState] = useState<FormState>({
		title: '',
		description: '',
		tags: [''],
		links: [''],
		subTasks: [{ title: '', done: false }],
		images: [],
		columnId: '',
	});

	const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value, type } = event.target;

		const isFileInput = type === 'file';
		if (isFileInput) {
			const files = (event.target as HTMLInputElement).files;
			if (files) {
				const fileArray = Array.from(files);
				setFormState((prevState) => ({
					...prevState,
					[name]: fileArray,
				}));
			}
			return;
		}
		if (name === 'subTasks') {
			const subtaskTitles = value ? value.split(',').map((title) => title.trim()) : [];
			const subtasks = subtaskTitles.map((title) => ({
				title,
				done: false,
			}));
			setFormState((prevState) => ({
				...prevState,
				[name]: subtasks,
			}));
		} else if (type === 'text' || type === 'url') {
			setFormState((prevState) => ({
				...prevState,
				[name]: value.split(','),
			}));
		} else {
			setFormState((prevState) => ({
				...prevState,
				[name]: value,
			}));
		}
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);

		if (formState.images && formState.images.length > 0) {
			formData.delete('images');

			formState.images.forEach((file) => {
				formData.append('images', file);
			});
		}

		// Process subTasks from the form input
		const subTasksInput = formData.get('subTasks') as string;
		const subTasks = subTasksInput
			? subTasksInput.split(',').map((title) => ({
					title: title.trim(),
					done: false,
				}))
			: [];

		const cardData = {
			id: uuidv4(),
			title: formData.get('title') as string,
			description: formData.get('description') as string,
			tags: (formData.get('tags') as string).split(','),
			links: (formData.get('links') as string)?.split(',') || [],
			subTasks,
			columnId: boardId?.columnIds?.[0]!,
		};

		if (boardId?.id) {
			dispatch(
				createCardInColumn({
					...cardData,
					images: formState.images,
				})
			);
		}
	};

	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			{formInputs.map((input) => {
				const {
					id,
					label,
					type,
					required,
					placeholder,
					name,
					errorMessage,
					value: inputValue,
					...rest
				} = input;

				let displayValue = formState[name as keyof FormState];
				if (name === 'subTasks' && Array.isArray(displayValue)) {
					displayValue = (displayValue as Subtask[])
						.filter((task) => task.title)
						.map((task) => task.title)
						.join(', ');
				}

				return (
					<FormInput
						key={id}
						name={name}
						id={id}
						label={label}
						type={type}
						onChange={handleChange}
						value={displayValue as string}
						required={required}
						placeholder={placeholder}
						errorMessage={errorMessage}
						{...rest}
					/>
				);
			})}
			<Button type="submit">Submit</Button>
		</form>
	);
}

export default Form;
