import React from "react";
import { AlertComponentProps } from "models/alert.models";
import { AppConstants } from "constants/app.constants";

export const Alerts = (props: AlertComponentProps) => {
  if (props.router.location.pathname === AppConstants.routes.login) return null;

  return (
    <>
    </>
  );
};
