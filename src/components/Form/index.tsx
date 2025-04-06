import { useState } from "react";
import styles from "./form.module.scss";
import FormInput, { FormInputProps } from "../FormInput";

const formInputs: FormInputProps[] = [
  {
    id: "heading",
    label: "Heading",
    type: "text",
    required: true,
    placeholder: "e.g. Design Weekly",
    name: "heading",
    errorMessage: "Heading is required.",
  },
  {
    id: "description",
    label: "Description",
    type: "textarea",
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
    placeholder: "e.g. UI, Design",
    name: "tags",
    errorMessage: "Tags are required.",
  },
  {
    id: "links",
    label: "Links",
    type: "url",
    required: false,
    placeholder: "e.g. https://www.figma.com/",
    pattern: "https?://.+",
    name: "links",
    errorMessage: "Links are optional.",
  },
  {
    id: "subtasks",
    label: "Subtasks",
    type: "text",
    required: false,
    placeholder: "e.g. Design the login screen, Design the dashboard",
    name: "subtasks",
    errorMessage: "Subtasks are optional.",
  },
  {
    id: "images",
    label: "Images",
    type: "file",
    required: false,
    accept: "image/*",
    multiple: true,
    name: "images",
    errorMessage: "Images are optional.",
  },
];

interface FormState {
  heading: string;
  description: string;
  tags: string[];
  links?: string[];
  subtasks?: string[];
  images?: string[];
}

function Form() {
  const [formState, setFormState] = useState<FormState>({
    heading: "",
    description: "",
    tags: [""],
    links: [""],
    subtasks: [""],
    images: [""],
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
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {formInputs.map((input) => {
        const { id, label, type, required, placeholder, name, errorMessage } =
          input;
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
          />
        );
      })}
    </form>
  );
}

export default Form;
