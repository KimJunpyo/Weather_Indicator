import {Routes, Route} from "react-router-dom";
import Main from "./Pages/Main.jsx";
import "./index.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />}></Route>
    </Routes>
  );
}

export default App;
