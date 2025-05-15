import { useState } from 'react';
import styles from './topNav.module.scss';
import Modal from '../Modal';
import { SVG } from '../../SVG';
import FormInput from '../FormInput';
import Button from '../Button';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { generateTheme } from '../../store/features/themeGenerator/themeGeneratorSlice';
import loader from '../Loading';

function MakeYourOwnModal() {
	const [themeName, setThemeName] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const closeModal = () => setIsModalOpen(false);
	const openModal = () => setIsModalOpen(true);
	const dispatch = useAppDispatch();
	const { loading, error } = useAppSelector((state) => state.themeGenerator);
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		dispatch(generateTheme(themeName));
	};

	if (loading) {
		return loader();
	}

	if (error) {
		return <div className={styles.error}>There was an error.</div>;
	}

	return (
		<>
			<button onClick={openModal}>
				<div className={styles.themeBtnDropdown}>
					<SVG.palette /> Make your own
				</div>
			</button>
			<Modal isOpen={isModalOpen} onClose={closeModal}>
				<Modal.Header>Create Custom Theme</Modal.Header>
				<Modal.Body>
					<form onSubmit={handleSubmit}>
						<FormInput
							type="textarea"
							name="themeName"
							id="themeName"
							label="Enter Theme"
							placeholder="e.g. Cyberpunk, Ghibli, etc."
							required={true}
							value={themeName}
							onChange={(e) => setThemeName(e.target.value)}
							errorMessage="Please enter a theme name"
							infoMessage="Your theme will be generated based on the prompt you provide."
						/>
						<Button style={{ marginTop: '1.4rem' }} type="submit">
							Submit
						</Button>
					</form>
				</Modal.Body>
			</Modal>
		</>
	);
}

export default MakeYourOwnModal;
