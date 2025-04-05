import Button from "../Button";
import styles from "./topNav.module.scss";

function TopNav() {
  return (
    <div className={styles.topNav}>
      <div className={styles.topNavContent}>
        <p>Hi, John Doe 👋</p>
        <Button>Dropdown</Button>
      </div>
    </div>
  );
}

export default TopNav;
