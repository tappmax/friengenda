import React from "react";
import { appStaticStyles } from "styles/app.styles";
import { Paper } from "@material-ui/core";
import { FrenBreadcrumbs } from "components/shared/breadcrumbs/breadcrumbs.component";
import { Switch } from "react-router";
import { OverviewSubRoutes } from "./overview.routes";
import { useDispatch, useSelector } from "react-redux";
import { ReduxState } from "redux/orchestrator";
import { push } from "connected-react-router";

export const Overview = () => {
  const dispatch = useDispatch();
  const breadcrumbs = useSelector<ReduxState,any[]>(state => state.breadcrumbs);
  const navigate = (path: string) => {
    dispatch(push(path));
  };

  return (
    <>
      <Paper style={appStaticStyles.contentSection}>
        <FrenBreadcrumbs navStack={breadcrumbs} navigate={navigate} />
        <Switch>{OverviewSubRoutes}</Switch>
      </Paper>
    </>
  );
}

