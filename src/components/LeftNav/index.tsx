import styles from "./leftNav.module.scss";
import { SVG } from "../SVG";
import { useState } from "react";
import ListItem from "../ListItem";
import { useEffect } from "react";

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

  const handleKeyDown = (event: KeyboardEvent) => {
    // Skip if the event target is an input, textarea or any editable element
    if (
      event.target instanceof HTMLElement &&
      (event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA" ||
        event.target.isContentEditable)
    ) {
      return;
    }

    if (event.key === " " || event.code === "Space") {
      event.preventDefault();
      toggleExpand();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [expanded, handleKeyDown]);

  return (
    <div
      className={
        styles.leftNav +
        (expanded ? ` ${styles.expanded}` : ` ${styles.collapse}`)
      }
    >
      <button
        type="button"
        className={styles.toggle_button}
        onClick={toggleExpand}
      >
        <SVG.chevronRight
          className={expanded ? styles.chevronLeft : styles.chevronRight}
        />
      </button>
      <ul className={styles.leftNavList}>
        <div className={styles.leftNavListGroup}>
          <li className={styles.logo}>
            <span>KN</span>
            <span>BN</span>
          </li>
          <hr />
          {menuItems.map((item, index) => (
            <ListItem key={index} item={item} expanded={expanded} />
          ))}
        </div>
        <div className={styles.leftNavListGroup}>
          {bottomItems.map((item, index) => (
            <ListItem key={index} item={item} expanded={expanded} />
          ))}
        </div>
      </ul>
    </div>
  );
}

export default LeftNav;
