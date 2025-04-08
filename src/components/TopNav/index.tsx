import { Link } from "react-router";
import Button from "../Button";
import Dropdown from "../Dropdown";
import styles from "./topNav.module.scss";
import { SVG } from "../SVG";

function TopNav() {
  return (
    <div className={styles.topNav}>
      <div className={styles.topNavContent}>
        <p>Hi, John Doe 👋</p>
        <div className={styles.topNavActions}>
          <Button type="button">Add Board</Button>
          <Dropdown
            placement="bottom-right"
            trigger={<Button icon={<SVG.chevronDown />}>Pick a board </Button>}
          >
            <Link to="/">Design</Link>
            <Link to="/">Coding</Link>
            <Link to="/">DevOps</Link>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

export default TopNav;
