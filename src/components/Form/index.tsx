import { useState } from "react";
import styles from "./form.module.scss";
import FormInput, { FormInputProps } from "../FormInput";
import Button from "../Button";
import { v4 as uuidv4 } from "uuid";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectActiveBoard } from "../../store/selectors";
import { createCardInColumn } from "../../store/thunks";

const formInputs: FormInputProps[] = [
  {
    id: "title",
    label: "Title",
    type: "text",
    required: true,
    pattern: "^[\\w\\s\\p{P}\\p{S}]+$",
    placeholder: "e.g. Design Weekly",
    name: "title",
    errorMessage: "Heading is required.",
  },
  {
    id: "description",
    label: "Description",
    type: "textarea",
    pattern: "^[\\w\\s\\p{P}\\p{S}]+$",
    minLength: 10,
    maxLength: 200,
    required: true,
    placeholder:
      "e.g. Create wireframes and high-fidelity designs for the app's main screens.",
    name: "description",
    errorMessage: "Description is required.",
  },
  {
    id: "tags",
    label: "Tags",
    type: "text",
    required: true,
    pattern: "^[\\w\\-#@]+(\\s*,\\s*[\\w\\-#@]+)*$",
    minLength: 3,
    maxLength: 20,
    placeholder: "e.g. UI, Design, UX/UI",
    name: "tags",
    errorMessage: "Tags are required.",
    infoMessage: "Please enter comma separated tags.",
  },
  {
    id: "links",
    label: "Links",
    type: "url",
    required: false,
    placeholder: "e.g. https://www.figma.com/",
    pattern: "(https?://.+)(\\s*,\\s*https?://.+)*",
    name: "links",
    errorMessage: "Links are optional.",
    infoMessage: "Please enter comma separated URLs.",
  },
  {
    id: "subtasks",
    label: "Subtasks",
    type: "text",
    required: false,
    placeholder: "e.g. Design the login screen, Fix UI/UX issues",
    pattern: "^[\\w\\s\\p{P}\\p{S}]+(\\s*,\\s*[\\w\\s\\p{P}\\p{S}]+)*$",
    name: "subtasks",
    errorMessage: "Subtasks are optional.",
    infoMessage: "Please enter comma separated subtasks.",
  },
  {
    id: "images",
    label: "Images",
    type: "file",
    required: false,
    accept: "image/*",
    name: "images",
    errorMessage: "Images are optional.",
  },
];

interface FormState {
  title: string;
  description: string;
  tags: string[];
  links?: string[];
  subtasks?: string[];
  images?: string[];
  columnId: string;
}

function Form() {
  const boardId = useAppSelector(selectActiveBoard);
  const dispatch = useAppDispatch();
  const [formState, setFormState] = useState<FormState>({
    title: "",
    description: "",
    tags: [""],
    links: [""],
    subtasks: [""],
    images: [""],
    columnId: "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target;

    const isFileInput = type === "file";
    if (isFileInput) {
      const files = (event.target as HTMLInputElement).files;
      if (files) {
        const fileArray = Array.from(files).map((file) => file.name);
        setFormState((prevState) => ({
          ...prevState,
          [name]: fileArray,
        }));
      }
      return;
    }
    if (type === "text" || type === "url") {
      setFormState((prevState) => ({
        ...prevState,
        [name]: value.split(","),
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
    const formEntries = Object.fromEntries(formData.entries());
    const formState: FormState & { id: string } = {
      id: uuidv4(),
      title: formEntries.title as string,
      description: formEntries.description as string,
      tags: (formEntries.tags as string).split(","),
      links: (formEntries.links as string).split(","),
      subtasks: (formEntries.subtasks as string).split(","),
      // images: (formEntries?.images as string).split(","),
      columnId: boardId?.columnIds?.[0]!,
    };
    if (boardId?.id) {
      dispatch(createCardInColumn(formState));
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
          ...rest
        } = input;

        return (
          <FormInput
            key={id}
            name={name}
            id={id}
            label={label}
            type={type}
            value={formState[name as keyof FormState]}
            onChange={handleChange}
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
