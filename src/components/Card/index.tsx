import React from "react";
import styles from "./card.module.scss";
import CustomLink from "../Link";
import { getTagColors } from "../../utils/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string;
  description: string;
  className?: string;
  images?: string[];
  tags: string[];
  subTasks?: React.ReactNode[];
  links?: string[];
}

export default function Card(props: CardProps) {
  const {
    heading,
    description,
    subTasks,
    tags,
    links,
    images,
    className,
    ...rest
  } = props;
  return (
    <div {...rest} className={styles.card + (className ? ` ${className}` : "")}>
      <h1 className={styles.heading}>{heading}</h1>
      <p className={styles.description}>{description}</p>
      {renderSubTasks({ subTasks })}
      {renderLinks({ links })}
      {renderImages({ images })}
      {renderTags({ tags })}
    </div>
  );
}

function renderSubTasks(props: { subTasks?: React.ReactNode[] }) {
  const { subTasks } = props;
  return (
    <div className={styles.subTasks}>
      {subTasks?.length && <h2>Sub tasks</h2>}
      {subTasks?.length &&
        subTasks.map((subTask, index) => {
          return (
            <div className={styles.subTask} key={index}>
              {subTask}
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
