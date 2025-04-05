import styles from "./leftNav.module.scss";

function LeftNav() {
  return (
    <div className={styles.leftNav}>
      <ul>
        <li>Dashboard</li>
        <li>Orders</li>
        <li>Products</li>
        <li>Customers</li>
        <li>Reports</li>
      </ul>
    </div>
  );
}

export default LeftNav;
