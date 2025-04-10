import styles from "./help.module.scss";
import Section from "../../components/Section";
import Box from "../../components/Box";

interface Shortcut {
  id: number;
  key: string[];
  description: string;
}

interface Shortcuts {
  featureName: string;
  shortcuts: Shortcut[];
}

const SHORTCUTS: Shortcuts[] = [
  {
    featureName: "General Shortcuts",
    shortcuts: [
      { id: 1, key: ["Ctrl", "Shift", "H"], description: "Open Help." },
      { id: 2, key: ["Ctrl", "Shift", "N"], description: "Open Notes." },
      { id: 3, key: ["Ctrl", "Shift", "P"], description: "Open Pomodoro." },
      { id: 4, key: ["Ctrl", "Shift", "C"], description: "Open Calendar." },
      {
        id: 5,
        key: ["Ctrl", "Shift", "S"],
        description: "Open Subscriptions.",
      },
      { id: 6, key: ["Ctrl", "Shift", "U"], description: "Open Settings." },
      { id: 7, key: ["Ctrl", "Shift", "L"], description: "Open Profile." },
      { id: 8, key: ["Ctrl", "Shift", "Q"], description: "Log Out." },
    ],
  },
  {
    featureName: "Pomodoro Shortcuts",
    shortcuts: [
      { id: 1, key: ["J"], description: "Start the timer." },
      { id: 2, key: ["K"], description: "Pause the timer." },
      { id: 3, key: ["R"], description: "Reset the timer." },
      { id: 4, key: ["P"], description: "Pomodoro." },
      { id: 5, key: ["S"], description: "Short Break." },
      { id: 6, key: ["L"], description: "Long Break." },
    ],
  },
];

function Help() {
  return (
    <Section className={styles.help}>
      <h1>Help</h1>
      <div className={styles.helpContent}>
        {SHORTCUTS.map((shortcut) => (
          <Box
            className={styles.helpBox}
            key={shortcut.featureName.toLowerCase()}
          >
            <h3>{shortcut.featureName}</h3>
            {shortcut.shortcuts.map((item, ind) => (
              <div className={styles.table} key={item.id}>
                {item.key.map((k: string, index) => (
                  <span
                    key={(k + ind + index).toString()}
                    className={styles.key}
                  >
                    <kbd>{k}</kbd>
                  </span>
                ))}
                <p>{item.description}</p>
              </div>
            ))}
          </Box>
        ))}
      </div>
    </Section>
  );
}

export default Help;
