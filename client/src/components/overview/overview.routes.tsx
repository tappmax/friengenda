import React from "react";
import { OverviewConstants } from "constants/overview.constants";
import { Overview } from "./overview.component";
import { AuthenticatedRoute } from "components/shared/auth/authenticated-route.component";
import { OverviewLock } from "./overview-lock.component";
import { OverviewSummary } from "./overview-summary.component";

export const OverviewRoutes: JSX.Element[] = [
  <AuthenticatedRoute
    key={`route-${OverviewConstants.routes.summary}`}
    path={[
      OverviewConstants.routes.summary,
      OverviewConstants.routes.lock
    ]}
    exact
    component={Overview}
  />
];

export const OverviewSubRoutes: JSX.Element[] = [
  <AuthenticatedRoute
    key={`sub-route-${OverviewConstants.routes.summary}`}
    path={OverviewConstants.routes.summary}
    exact
    component={OverviewSummary}
  />,  
  <AuthenticatedRoute
    key={`sub-route-${OverviewConstants.routes.lock}`}
    path={OverviewConstants.routes.lock}
    exact
    component={OverviewLock}
  />,  
];
