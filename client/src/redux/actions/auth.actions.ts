import { httpPost, commonStateComplete, commonStateLoading } from "./common.actions";
import { AuthConstants } from "constants/auth.constants";
import AuthService from "common/auth";
import { AppUser, LoginCredentials } from "models";
import { push } from "connected-react-router";
import http from "common/http";
import { ReduxState } from "redux/orchestrator";

export const login = (credentials: LoginCredentials) => httpPost({
  action: AuthConstants.actions.LOGIN,
  url: AuthConstants.server.endpoints.login,
  body: credentials,
  authorized: false,
  success: (dispatch: any, user: AppUser) => {
    dispatch(push(credentials.redirect ? credentials.redirect : '/'))
  }
});

export const logout = () => (dispatch:any) => {
  AuthService.clearToken();
  dispatch({
    type: AuthConstants.actions.LOGOUT,
    payload: {}
  })
}

export const refreshToken = (force: boolean = false) => async (dispatch: any, state: () => ReduxState) => {
  let authToken = AuthService.getToken();

  if(state().user.data.tokenRefreshing)
    return;

  if(force || AuthService.isTokenExpired(authToken)) {
    dispatch(commonStateLoading(AuthConstants.actions.REFRESH_TOKEN, undefined));
    const res = await http.get<AppUser>(
      AuthConstants.server.endpoints.refreshToken,
    );
    
    if(http.hasError(res)) {  
      console.log("logging out!");
      dispatch(logout())
    } else {
      dispatch(commonStateComplete(AuthConstants.actions.REFRESH_TOKEN, res));
    }
  }
}

