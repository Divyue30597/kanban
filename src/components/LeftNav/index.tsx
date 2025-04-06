import styles from "./leftNav.module.scss";
import { SVG } from "../SVG";
import { useState } from "react";
import ListItem from "../ListItem";

function LeftNav() {
  const [expanded, setExpanded] = useState<boolean>(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const menuItems = [
    { title: "Home", icon: <SVG.home />, path: "/" },
    { title: "Notes", icon: <SVG.notes />, path: "/" },
    { title: "Pomodoro", icon: <SVG.pomodoro />, path: "/" },
  ];

  const bottomItems = [
    { title: "Help", icon: <SVG.help />, path: "/" },
    { title: "Logout", icon: <SVG.logout />, path: "/" },
  ];

  return (
    <div
      className={
        styles.leftNav +
        (expanded ? ` ${styles.expanded}` : ` ${styles.collapse}`)
      }
    >
      <button className={styles.toggle_button} onClick={toggleExpand}>
        <SVG.chevronRight
          className={expanded ? styles.chevronLeft : styles.chevronRight}
        />
      </button>
      <ul className={styles.leftNavList}>
        <div
          className={styles.leftNavListGroup}
          style={{
            alignItems: expanded ? "flex-start" : "center",
            padding: expanded ? "0 0 0 0.1rem" : "0",
            transition: "padding 0.3s ease",
          }}
        >
          <li className={styles.logo}>KNBN</li>
          {menuItems.map((item, index) => (
            <ListItem key={index} item={item} expanded={expanded} />
          ))}
        </div>
        <div
          className={styles.leftNavListGroup}
          style={{ alignItems: expanded ? "" : "center" }}
        >
          {bottomItems.map((item, index) => (
            <ListItem key={index} item={item} expanded={expanded} />
          ))}
        </div>
      </ul>
    </div>
  );
}

export default LeftNav;
