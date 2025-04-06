import styles from "./app.module.scss";
import Board from "./components/Board";
import Card from "./components/Card";
import CheckboxWithText from "./components/CheckboxWithText";
import Column from "./components/Column";
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
        <Board>
          <Column colName="To Do">
            <Card
              heading="Design User Interface"
              description="Create wireframes and high-fidelity designs for the app's main screens."
              subTasks={["Design the login screen", "Design the dashboard"].map(
                (task) => (
                  <CheckboxWithText key={task} label={task} />
                )
              )}
              links={["https://www.figma.com/", "https://www.sketch.com"]}
              tags={["UI", "Design", "Figma", "Backend"]}
              images={[
                "https://images.pexels.com/photos/87009/earth-soil-creep-moon-lunar-surface-87009.jpeg",
              ]}
            />
            <Card
              heading="Design User Interface"
              description="Create wireframes and high-fidelity designs for the app's main screens."
              subTasks={["Design the login screen", "Design the dashboard"].map(
                (task) => (
                  <CheckboxWithText key={task} label={task} />
                )
              )}
              links={["https://www.figma.com/", "https://www.sketch.com"]}
              tags={["UI", "Design", "Figma", "Backend"]}
              images={[
                "https://images.pexels.com/photos/87009/earth-soil-creep-moon-lunar-surface-87009.jpeg",
              ]}
            />
          </Column>
          <Column colName="In Progress">
            <Card
              heading="Design User Interface"
              description="Create wireframes and high-fidelity designs for the app's main screens."
              subTasks={["Design the login screen", "Design the dashboard"].map(
                (task) => (
                  <CheckboxWithText key={task} label={task} />
                )
              )}
              links={["https://www.figma.com/", "https://www.sketch.com"]}
              tags={["UI", "Design", "Figma", "Backend"]}
              images={[
                "https://images.pexels.com/photos/87009/earth-soil-creep-moon-lunar-surface-87009.jpeg",
              ]}
            />
          </Column>
          <Column colName="Done">
            <Card
              heading="Design User Interface"
              description="Create wireframes and high-fidelity designs for the app's main screens."
              subTasks={["Design the login screen", "Design the dashboard"].map(
                (task) => (
                  <CheckboxWithText key={task} label={task} />
                )
              )}
              links={["https://www.figma.com/", "https://www.sketch.com"]}
              tags={["C", "Design", "Figma", "Backend"]}
              images={[
                "https://images.pexels.com/photos/87009/earth-soil-creep-moon-lunar-surface-87009.jpeg",
              ]}
            />
          </Column>
        </Board>
      </div>
    </div>
  );
}

export default App;
