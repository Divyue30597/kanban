import { Link } from "react-router";
import styles from "./listItem.module.scss";

interface ListItemProps {
  item: {
    path: string;
    title: string;
    icon: JSX.Element;
  };
  expanded: boolean;
}

function ListItem(props: ListItemProps) {
  const { item, expanded } = props;

  return (
    <li>
      <Link
        to={item.path}
        style={{
          gap: expanded ? "1.2rem" : "0",
          transition: "gap 0.3s ease",
        }}
      >
        {item.icon}
        <span
          className={styles.title}
          style={{
            width: expanded ? "auto" : "0",
            opacity: expanded ? 1 : 0,
            overflow: "hidden",
            whiteSpace: "nowrap",
            transition: "opacity 0.3s ease, width 0.3s ease",
          }}
        >
          {item.title}
        </span>
      </Link>
    </li>
  );
}

export default ListItem;
