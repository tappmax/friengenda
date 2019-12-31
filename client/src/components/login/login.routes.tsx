import React from "react";
import { Route } from "react-router";
import { AppConstants } from "constants/app.constants";
import { Login } from "./login.component";

export const LoginRoutes: JSX.Element[] = [
  <Route
    key={`route-${AppConstants.routes.login}`}
    path={AppConstants.routes.login}
    exact
    component={Login}
  />
];
