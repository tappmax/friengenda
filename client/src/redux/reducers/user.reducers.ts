import { CommonState, CommonAction } from "models/common.models";
import { AppUser } from "models/auth.models";
import { CommonConstants } from "constants/common.constants";
import AuthService from "common/auth";
import {
  CommonStateReducer, CommonStateError,
} from "reducers/common.reducers";
import {
  getLoadingActionType,
  getCompleteActionType,
  getErrorActionType
} from "helpers/action.helpers";
import { AuthConstants } from "constants/auth.constants";
import moment from "moment";

export const userReducer = (
  state: CommonState<AppUser> = CommonConstants.defaults.commonState,
  action: CommonAction
) => {
  switch (action.type) {   
    case getLoadingActionType(AuthConstants.actions.REFRESH_TOKEN):
      return CommonStateReducer<AppUser>({...state.data, tokenRefreshing: true});      

    case getCompleteActionType(AuthConstants.actions.LOGIN):
    case getCompleteActionType(AuthConstants.actions.REFRESH_TOKEN): {
      AuthService.setToken({
        token: action.payload.token,
        expires: moment().utc().unix() + action.payload.tokenDuration
      });    
      return CommonStateReducer<AppUser>({...action.payload, authorized: true, tokenRefreshing:false});
    }

    case getLoadingActionType(AuthConstants.actions.LOGIN):
      return CommonStateReducer<AppUser>({...action.payload, authorized: false, tokenRefreshing: false});

    case getErrorActionType(AuthConstants.actions.LOGIN):
    case getErrorActionType(AuthConstants.actions.REFRESH_TOKEN):      
      return CommonStateError(action.payload);

    case AuthConstants.actions.LOGOUT:
      return CommonStateReducer<AppUser>({authorized: false, tokenRefreshing: false} as AppUser);
  }

  return state;
};
