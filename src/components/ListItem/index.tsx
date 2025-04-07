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
  const [shouldRender, setShouldRender] = useState(expanded); // controls mounting
  const [shouldShow, setShouldShow] = useState(expanded); // controls visual animation

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (expanded) {
      setShouldRender(true); // mount span
      timeout = setTimeout(() => {
        setShouldShow(true); // then animate in
      }, 100); // small delay to trigger CSS transition
    } else {
      setShouldShow(false); // start fade/slide out
      timeout = setTimeout(() => {
        setShouldRender(false); // unmount after animation ends
      }, 300); // matches CSS duration
    }

    return () => clearTimeout(timeout);
  }, [expanded]);

  return (
    <li>
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
    </li>
  );
}

export default ListItem;
