import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import "./App.css";
import AddAnimal from "./pages/AddAnimal";
import Animal from "./pages/Animal";
import Animals from "./pages/Animals";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/add">
          <AddAnimal />
        </Route>
        <Route exact path="/animals">
          <Animals />
        </Route>
        <Route exact path="/animals/:animalId" component={Animal} />
        <Route render={() => <Redirect to="/animals" />} />
      </Switch>
    </Router>
  );
}

export default App;
