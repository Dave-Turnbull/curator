import "./App.css";
import { Routing } from "./Routes";
import NavigationBar from "./components/NavigationBar/NavigationBar.tsx";
import { Footer } from "./components/Footer";

function App() {
  return (
    <>
      <NavigationBar />
      <Routing />
      <Footer />
    </>
  );
}

export default App;
