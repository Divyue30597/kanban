import { Route, Routes, useNavigate } from "react-router";
import styles from "./app.module.scss";
import LeftNav from "./components/LeftNav";
import TopNav from "./components/TopNav";
import Home from "./modules/Home";
import Settings from "./modules/Settings";
import Profile from "./modules/Profile";
import Pomodoro from "./modules/Pomodoro";
import Notes from "./modules/Notes";
import Calendar from "./modules/Calendar";
import Subscriptions from "./modules/Subscriptions";
import Help from "./modules/Help";
import { useEffect } from "react";

function App() {
  const navigate = useNavigate();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "h") navigate("/");
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={styles.app}>
      <LeftNav />
      <div className={styles.mainContent}>
        <TopNav />
        <Routes>
          <Route index path="/" element={<Home />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/help" element={<Help />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
