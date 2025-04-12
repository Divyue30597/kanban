import { useState } from "react";
import Modal from ".";
import Button from "../Button";
import Form from "../Form";

function RenderModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);
  const openModal = () => setIsModalOpen(true);

  return (
    <>
      <Button onClick={openModal}>Add Task</Button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <Modal.Header>Add Task</Modal.Header>
        <Modal.Body>
          <Form />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default RenderModal;
