import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import "./App.css";
import AddAnimal from "./pages/AddAnimal";
import Product from "./pages/Product";
import Products from "./pages/Products";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/add">
          <AddAnimal />
        </Route>
        <Route exact path="/products">
          <Products />
        </Route>
        <Route exact path="/products/:productId" component={Product} />
        <Route render={() => <Redirect to="/products" />} />
      </Switch>
    </Router>
  );
}

export default App;
