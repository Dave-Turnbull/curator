import "./App.css";
import { Routing } from "./Routes";
import NavigationBar from "./components/NavigationBar";
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
