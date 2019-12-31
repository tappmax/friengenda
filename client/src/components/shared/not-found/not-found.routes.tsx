import React from "react";
import { FrenNotFound } from "./not-found.component";
import { AuthenticatedRoute } from "../auth/authenticated-route.component";

export const FrenNotFoundRoutes: JSX.Element[] = [(
  <AuthenticatedRoute key="routes-not-found" path="*" component={FrenNotFound} />
)];
