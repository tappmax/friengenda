import React, { FC } from "react";
import { Provider, ReactReduxContext } from "react-redux";
import { configureStore } from "redux/store";
import { Route, Switch } from "react-router-dom";
import { theme, variables } from "styles/common.styles";
import { LoginRoutes } from "./login/login.routes";
import { FrenNotFoundRoutes } from "./shared/not-found/not-found.routes";
import { ConnectedRouter } from "connected-react-router";
import { Nav } from "./nav/nav.component";
import { ThemeProvider } from "@material-ui/core/styles";
import { AlertContainer } from "./alerts/alert.container";
import { ReduxState } from "redux/orchestrator";
import { ContractRoutes } from "./contracts/contract.routes";
import { ManagerRoutes } from "./managers/manager.routes";
import { OverviewRoutes } from "./overview/overview.routes";
import { createBrowserHistory } from "history";
import { FrenToolbar } from "./toolbar/toolbar.component";
import { AuthenticatedRoute } from "./shared/auth/authenticated-route.component";
import { FrenConfirmationDialog } from "./dialogs/confirmation-dialog.component";
import { FrenSessionDialog } from "./dialogs/session-dialog.component";
import { CommonConstants } from "constants/common.constants";
import { App } from "./app.component";

export const history = createBrowserHistory();

const store = configureStore(history, { 
  user: CommonConstants.defaults.commonState, 
  datasetAlertCount: {broker:0, advisor:0}
} as ReduxState);

export const AppRouter: FC = () => {
  return (
    <Provider store={store} context={ReactReduxContext}>
      <ConnectedRouter history={history} context={ReactReduxContext}>
        <ThemeProvider theme={theme}>
          <Nav/>
          <FrenToolbar/>
          <div style={{ width: "100%", paddingLeft: variables.dimensions.drawerWidth + theme.spacing(2), paddingRight: theme.spacing(2)}}>            
            <Switch>
              <AuthenticatedRoute path="/" exact component={App} />
              {LoginRoutes}
              {ManagerRoutes}
              {PlanRoutes}
              {ContractRoutes}
              {AdvisorRoutes}
              {BrokerRoutes}
              {ReportRoutes}
              {OverviewRoutes}
              {FrenNotFoundRoutes}
            </Switch>              
            <Route component={AlertContainer} />
          </div>
          <FrenConfirmationDialog/>
          <FrenSessionDialog/>
        </ThemeProvider>
      </ConnectedRouter>
    </Provider>
  );
};
