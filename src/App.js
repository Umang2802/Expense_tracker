import "./App.css";
import Home from "./Pages/Home";
import Context from "./Context";

function App() {
  return (
    <Context>
      <div className="App">
        <Home />
      </div>
    </Context>
  );
}

export default App;
