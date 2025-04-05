import "./App.css";
import Button from "./components/Button";
import Card from "./components/Card";
import CheckboxWithText from "./components/CheckboxWithText";
import Container from "./components/Container";

function App() {
  return (
    <Container>
      <Button>This is a button</Button>
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
      />
    </Container>
  );
}

export default App;
