import React from "react";
import styles from "./card.module.scss";
import CustomLink from "../Link";
import { getTagColors } from "../../utils/utils";
import CheckboxWithText from "../CheckboxWithText";

export interface CardType extends React.HTMLAttributes<HTMLDivElement> {
  heading: string;
  description: string;
  className?: string;
  images?: string[];
  tags: string[];
  subTasks?: string[];
  links?: string[];
  id: string;
  columnId?: string;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
}

export default function Card(props: CardType) {
  const {
    id,
    heading,
    description,
    subTasks,
    tags,
    links,
    images,
    className,
    columnId,
    onDragStart,
    ...rest
  } = props;

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    // Set card data in the drag event
    e.dataTransfer.setData("cardId", id);
    e.dataTransfer.setData(
      "cardData",
      JSON.stringify({
        id,
        heading,
        description,
      })
    );

    e.dataTransfer.effectAllowed = "move";

    if (onDragStart) {
      onDragStart(e);
    }
  };

  return (
    <div
      {...rest}
      className={styles.card + (className ? ` ${className}` : "")}
      draggable={true}
      onDragStart={handleDragStart}
      data-card-id={id}
      data-column-id={columnId}
    >
      <h1 className={styles.heading}>{heading}</h1>
      <p className={styles.description}>{description}</p>
      {renderSubTasks({ subTasks })}
      {renderLinks({ links })}
      {renderImages({ images })}
      {renderTags({ tags })}
    </div>
  );
}

function renderSubTasks(props: { subTasks?: string[] }) {
  const { subTasks } = props;
  return (
    <div className={styles.subTasks}>
      {subTasks?.length && <h2>Sub tasks</h2>}
      {subTasks?.length &&
        subTasks.map((subTask, index) => {
          return (
            <div className={styles.subTask} key={index}>
              <CheckboxWithText label={subTask} />
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
      {tags?.length &&
        tags.map((tag, index) => {
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
      {links?.length &&
        links.map((link, index) => {
          return <CustomLink key={index} to={link} />;
        })}
    </div>
  );
}

function renderImages(props: { images?: string[] }) {
  const { images } = props;
  return (
    <div className={styles.images}>
      {images?.length &&
        images.map((image, index) => {
          return <img key={index} src={image} alt="" />;
        })}
    </div>
  );
}
