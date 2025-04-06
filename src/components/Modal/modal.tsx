import { useState } from "react";
import Modal from ".";
import Button from "../Button";

function RenderModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);
  const openModal = () => setIsModalOpen(true);

  return (
    <>
      <Button onClick={openModal}>Add Task</Button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <Modal.Header>Example Modal Title</Modal.Header>
        <Modal.Body>
          <p>
            This is the modal content. You can put any components or content
            here.
          </p>
          <form>
            <label htmlFor="name">Name:</label>
            <input id="name" type="text" />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={closeModal}>Cancel</button>
          <button
            onClick={() => {
              console.log("Submit action");
              closeModal();
            }}
          >
            Submit
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default RenderModal;
