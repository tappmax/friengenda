import { Breadcrumbs, Typography } from "@material-ui/core";
import React from "react";
import { variables } from "styles/common.styles";
import { FrenBreadcrumbsProps } from "models/nav.models";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const clickableStyle = { display: "flex", color: variables.brandColors.frenSecondary, cursor: "pointer" };
const activeStyle = { display: "flex" };
export const FrenBreadcrumbs = ({ navStack, navigate }: FrenBreadcrumbsProps) => {
  return navStack && navStack.length ? (
    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
      {navStack.map((nav, i) => {
        return i === navStack.length - 1 ? (
          <Typography
            key={`breadcrumbs-${nav.path}`}
            color="textSecondary"
            style={activeStyle}
          >
            {nav.text}
          </Typography>
        ) : (
          <span
            onClick={() => navigate(nav.path)}
            color="secondary"
            key={`breadcrumbs-${nav.path}`}
            style={clickableStyle}
          >
            {nav.text}
          </span>
        );
      })}
    </Breadcrumbs>
  ) : null;
};
