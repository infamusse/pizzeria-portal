import React from "react";
import MainLayout from "../src/components/layout/MainLayout/MainLayout";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "./components/views/Login/Login";
import Dashboard from "./components/views/Dashboard/Dashboard";
import Kitchen from "./components/views/Kitchen/Kitchen";
import Tables from "./components/views/Tables/Tables";
import Waiter from "./components/views/Waiter/Waiter";
import ReservationDetail from "./components/views/Tables/ReservationDetail";
import EventDetail from "./components/views/Tables/EventDetail";
import Order from "./components/views/Tables/Order";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#2B4C6F"
    }
    // secondary: {
    //   main: "#11cb5f"
    // }
  }
});

function App() {
  return (
    <div className="App">
      <BrowserRouter basename={"/"}>
        <ThemeProvider theme={theme}>
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
                component={ReservationDetail}
              />
              <Route
                exact
                path={process.env.PUBLIC_URL + "/tables/events/:id"}
                component={EventDetail}
              />
              <Route
                exact
                path={process.env.PUBLIC_URL + "/waiter"}
                component={Waiter}
              />
              <Route
                exact
                path={process.env.PUBLIC_URL + "/waiter/order/:id"}
                component={Order}
              />
              <Route
                exact
                path={process.env.PUBLIC_URL + "/kitchen"}
                component={Kitchen}
              />
            </Switch>
          </MainLayout>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
