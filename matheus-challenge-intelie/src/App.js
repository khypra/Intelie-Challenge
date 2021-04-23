import "./App.css";
import * as React from "react";
import Header from "./components/header/header";
import ContextWrapper from "./components/contextWrapper/contextWrapper";

function App() {
  return (
    <div>
      <Header></Header>
      <ContextWrapper></ContextWrapper>
    </div>
  );
}

export default App;
