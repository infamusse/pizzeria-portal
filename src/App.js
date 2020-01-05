import React from "react";
import MainLayout from "../src/components/layout/MainLayout/MainLayout";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "./components/views/Login/Login";
import Dashboard from "./components/views/Dashboard/Dashboard";
import Kitchen from "./components/views/Kitchen/Kitchen";
import Tables from "./components/views/Tables/Tables";
import Waiter from "./components/views/Waiter/Waiter";

function App() {
  return (
    <div className="App">
      <BrowserRouter basename={"/panel"}>
        <MainLayout>
          <Switch>
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/`}
              component={Dashboard}
            />
            <Route
              exact
              path={process.env.PUBLIC_URL + "/login"}
              component={Login}
            />
            <Route
              exact
              path={process.env.PUBLIC_URL + "/tables"}
              component={Tables}
            />
            <Route
              exact
              path={process.env.PUBLIC_URL + "/tables/booking/:id"}
              component={Tables}
            />
            <Route
              exact
              path={process.env.PUBLIC_URL + "/waiter"}
              component={Waiter}
            />
            <Route
              exact
              path={process.env.PUBLIC_URL + "/kitchen"}
              component={Kitchen}
            />
          </Switch>
        </MainLayout>
      </BrowserRouter>
    </div>
  );
}

export default App;
