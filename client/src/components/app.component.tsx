import React from "react";
import { AppUser } from "models/auth.models";
import { CommonState } from "models/common.models";
import { CircularProgress, Paper } from "@material-ui/core";
import { Overview } from "./overview/overview.component";
import { useSelector } from "react-redux";
import { ReduxState } from "redux/orchestrator";
import { Redirect } from "react-router-dom";

export const App = () => {
  const user = useSelector<ReduxState,CommonState<AppUser>>(state => state.user);
  
  return (
    <>
      {user.loading && (<CircularProgress />)}
      {user.error && (<Paper>{user.error}</Paper>)}
      {user.data.authorized && (
        <Overview/>
      )}
      {!user.loading && !user.data.authorized && (
        <Redirect to="/login"/>
      )}
    </>
  )
}
