import {
  CommonState,
  Enums,
  CommonServerError,
  AppSession
} from "models/common.models";
import { CommonConstants } from "constants/common.constants";
import { NavLink } from "models/nav.models";
import {
  getCompleteActionType,
  getLoadingActionType,
  getErrorActionType
} from "helpers/action.helpers";

export const CommonStateLoading = <T>(
  state: CommonState<any>,
  data?: T
): CommonState<any> => {
  return {
    error: state.error,
    data: data ? data : state.data,
    loading: true
  };
};

export const CommonStateError = (
  error: string | CommonServerError = CommonConstants.ui.defaults.error,
  state: CommonState<any> = CommonConstants.defaults.commonState
): CommonState<any> => {
  if (error.hasOwnProperty("response")) {
    error = (error as any).response.data;
  }
  if (error.hasOwnProperty("innerError")) {
    error =
      (error as CommonServerError).friendlyDetails ||
      `${(error as CommonServerError).error} ${(error as CommonServerError)
        .details || (error as CommonServerError).innerError.message}`;
  }
  if (typeof error !== "string") {
    error = CommonConstants.ui.defaults.error;
  }
  return {
    ...state,
    loading: false,
    error: error
  };
};

export const CommonStateReducer = <T>(
  payload: T,
  combinePreviousStateData: CommonState<T> = CommonConstants.defaults
    .commonState
): CommonState<T> => {
  return {
    ...combinePreviousStateData,
    loading: false,
    error: "",
    data: payload as T
  };
};

export const CommonPaginatedStateReducer = <T>(
  payload: T,
  combinePreviousStateData = CommonConstants.defaults.commonStateAsPaginated
): CommonState<T> => {
  return {
    ...combinePreviousStateData,
    data: payload as T
  };
};

export const breadcrumbReducer = (
  state: NavLink[] = [],
  action: any
): NavLink[] => {
  switch (action.type) {
    case CommonConstants.actions.UPDATE_NAV:
      return action.payload || [];
  }
  return state;
};

export const enumsReducer = (
  state: CommonState<Enums> = CommonConstants.defaults.commonState,
  action: any
): CommonState<Enums> => {
  switch (action.type) {
    case getLoadingActionType(CommonConstants.actions.GET_ENUMS):
      return CommonStateLoading(state);
    case getErrorActionType(CommonConstants.actions.GET_ENUMS):
      return CommonStateError(action.payload);
    case getCompleteActionType(CommonConstants.actions.GET_ENUMS):
      return CommonStateReducer<Enums>(action.payload);
  }
  return state;
};

export const appSessionReducer = (
  state: AppSession = CommonConstants.defaults.appSession,
  action: any
): AppSession => {
  switch (action.type) {
    case CommonConstants.actions.APP_SESSION:
      return action.payload || CommonConstants.defaults.appSession;
  }
  return state;
};
