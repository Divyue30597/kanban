import { Link } from "react-router";
import styles from "./listItem.module.scss";
import { useEffect, useState } from "react";

interface ListItemProps {
  item: {
    path: string;
    title: string;
    icon: React.ReactNode;
  };
  expanded: boolean;
}

function ListItem(props: ListItemProps) {
  const { item, expanded } = props;
  const [shouldRender, setShouldRender] = useState(expanded);
  const [shouldShow, setShouldShow] = useState(expanded);

  const [onMouseOver, setOnMouseOver] = useState(false);

  const handleMouseOver = () => {
    setOnMouseOver(true);
  };

  const handleMouseLeave = () => {
    setOnMouseOver(false);
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (expanded) {
      setShouldRender(true);
      timeout = setTimeout(() => {
        setShouldShow(true);
      }, 150);
    } else {
      setShouldShow(false);
      timeout = setTimeout(() => {
        setShouldRender(false);
      }, 300);
    }

    return () => clearTimeout(timeout);
  }, [expanded]);

  return (
    <>
      <li onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
        <Link to={item.path}>
          {item.icon}
          {shouldRender && (
            <span
              className={`${styles.title} ${
                shouldShow ? styles.expanded : styles.collapsed
              }`}
            >
              {item.title}
            </span>
          )}
        </Link>
        {onMouseOver && !expanded && (
          <span className={styles.tooltip}>{item.title}</span>
        )}
      </li>
    </>
  );
}

export default ListItem;
