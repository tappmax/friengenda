import React from "react";
import { Route, Redirect } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { ReduxState } from "redux/orchestrator";
import { AppUser, CommonState } from "models";
import AuthService from 'common/auth';
import { refreshToken } from "actions/auth.actions";
import { RouterState } from "connected-react-router";

export const AuthenticatedRoute = ({ component: Component, ...rest }: any) => {
  const {data: user} = useSelector<ReduxState, CommonState<AppUser>>(state => state.user);
  const router = useSelector<ReduxState,RouterState<any>>(state => state.router);
  const dispatch = useDispatch();

  // If the user is unauthorized attempt to refresh using the saved auth token  
  if(!user.authorized) {
    const authToken = AuthService.getToken();
    if(!AuthService.isTokenExpired(authToken)) {
      dispatch(refreshToken(true));      
      return (<></>);
    }
  }  

  return (
    <>
    {!user.authorized && !user.tokenRefreshing && (<Redirect to={`/login?redirect=${encodeURI(router.location.pathname)}`}/>)}
    {user.authorized && (
      <Route
        {...rest}
        render={(props: any) => (
          <Component {...props} />
        )}
      />
    )}
    </>
  );
};
