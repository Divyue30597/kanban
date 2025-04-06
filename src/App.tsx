import styles from "./app.module.scss";
import Board from "./components/Board";
import LeftNav from "./components/LeftNav";
import TopNav from "./components/TopNav";

function App() {
  return (
    <div className={styles.app}>
      <div className={styles.leftNav}>
        <LeftNav />
      </div>
      <div className={styles.mainContent}>
        <TopNav />
        <Board />
      </div>
    </div>
  );
}

export default App;
