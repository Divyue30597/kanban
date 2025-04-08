import styles from "./app.module.scss";
import LeftNav from "./components/LeftNav";
import TopNav from "./components/TopNav";
import Home from "./modules/Home";

function App() {
  return (
    <div className={styles.app}>
      <LeftNav />
      <div className={styles.mainContent}>
        <TopNav />
        <Home />
      </div>
    </div>
  );
}

export default App;
