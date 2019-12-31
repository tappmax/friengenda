import { CommonConstants as constants } from "constants/common.constants";
import { NavLink } from "models/nav.models";
import {
  getLoadingActionType,
  getCompleteActionType,
  getErrorActionType
} from "helpers/action.helpers";
import http from "common/http";
import { Enums, CommonServerError } from "models/common.models";
import { AxiosRequestConfig } from "axios";
import { ReduxState } from "redux/orchestrator";
import { urlAddDataset } from "helpers/url.helpers";
import { refreshToken, logout } from "actions/auth.actions";
import { AuthConstants } from "constants/auth.constants";

export const updateBreadcrumbs = (breadcrumbs: NavLink[]) => (
  dispatch: any
) => {
  dispatch({
    payload: breadcrumbs,
    type: constants.actions.UPDATE_NAV
  });
};

export const setAppSessionEditing = (isEditing: boolean = false) => (dispatch: any) => {
  dispatch({
    payload: {isEditing},
    type: constants.actions.APP_SESSION
  });
}

export const getEnums = () => async (dispatch: any) => {
  try {
    dispatch(commonStateLoading(constants.actions.GET_ENUMS, {}));
    dispatch(refreshToken());

    const response = await Promise.all([
      paymentMethods(),
      paymentTypes(),
      planExternalIdTypes(),
      productTypes()
    ]).then(values => {
      return {
        paymentMethods: values[0],
        paymentTypes: values[1],
        planExternalIdTypes: values[2],
        productTypes: values[3]
      } as Enums;
    });

    dispatch(commonStateComplete(constants.actions.GET_ENUMS, response))
  } catch (ex) {
    dispatch(commonStateError(constants.actions.GET_ENUMS, ex));
  }
};

const paymentMethods = () => http.get<string[]>(
    `${constants.server.endpoints.enums.paymentMethod}`,
    constants.cacheKeys.options
  );
const paymentTypes = () => http.get<string[]>(
    `${constants.server.endpoints.enums.paymentType}`,
    constants.cacheKeys.options
  );
const planExternalIdTypes = () => http.get<string[]>(
    `${constants.server.endpoints.enums.planExternalIdType}`,
    constants.cacheKeys.options
  );
const productTypes = () => http.get<string[]>(
    `${constants.server.endpoints.enums.productType}`,
    constants.cacheKeys.options
  );


export const commonStateLoading = (type: string, payload: any) => (dispatch: any) => {
  dispatch({
    type: getLoadingActionType(type),
    payload: payload    
  });
}
  
export const commonStateError = (type: string, payload: any) => (dispatch: any) => {
  // Unauthorized, logout
  if(payload.status === 401 && type !== AuthConstants.actions.LOGIN) {
    dispatch(logout());
    return;
  }

  dispatch({
    type: getErrorActionType(type),
    payload: payload    
  });
}

export const commonStateComplete = (type: string, payload: any) => (dispatch: any) => {
  dispatch({
    type: getCompleteActionType(type),
    payload: payload    
  });
}

export const httpPost = <Req, Res>(options: {
  action?: string,
  url: string,
  body: Req,
  authorized?: boolean;
  cacheKeys?: string[],
  userOptions?: AxiosRequestConfig,
  loadingPayload?:any,
  transform?: (data: Res) => Res,
  success?: (dispatch: any, data: Res) => void,
  error?: (dispatch: any, error: CommonServerError) => void,
  }) => async (dispatch: any) => {
  
  try {    
    if(options.action)
      dispatch(commonStateLoading(options.action,options.loadingPayload))    

    if(options.authorized === undefined || options.authorized === true)
      dispatch(refreshToken());

    const res = await http.post<Req,Res | CommonServerError>(
      options.url,
      options.body,
      options.cacheKeys || [],
      options.userOptions
    );
    
    if(http.hasError(res)) {
      if(options.action)
        dispatch(commonStateError(options.action, res));    
      if(options.error) options.error(dispatch, res as CommonServerError);      
    } else {
      if(options.action)
        dispatch(commonStateComplete(options.action, options.transform ? options.transform(res as Res) : res));
      if(options.success) options.success(dispatch, res as Res);
    }
  } catch (ex) {
    if(options.action)
      dispatch(commonStateError(options.action, ex));    
  }
}

/**
 * HTTP PUT Action
 * @param options Options
 */
export const httpPut = <Req, Res>( options : {
  action: string,
  url: string,
  body: Req,
  cacheKeys?: string[],
  loadingPayload?: any,
  transform?: (data: Res) => Res,
  success?: (dispatch: any, data: Res) => void,
  error?: (dispatch: any, error: CommonServerError) => void
  }) => async (dispatch: any) => {
  
  try {
    dispatch(commonStateLoading(options.action,options.loadingPayload))
    dispatch(refreshToken());
    
    const res = await http.put<Req,Res>(
      options.url, 
      options.body,
      options.cacheKeys || []
    );
    
    if(http.hasError(res)) {
      dispatch(commonStateError(options.action, res));    
      if(options.error) options.error(dispatch, res as CommonServerError);      
    } else {
      dispatch(commonStateComplete(options.action, options.transform ? options.transform(res as Res) : res));
      if(options.success) options.success(dispatch, res as Res);
    }
  } catch (ex) {
    dispatch(commonStateError(options.action, ex));    
  }
}

/**
 * Common action to retrieve a record from the server
 * @param options Options
 */
export const httpGet = <Result>(
  options: {
    action?: string,
    url: string,
    cacheKey?: string,
    invalidate?: boolean;
    expiration?: number;
    authorized?: boolean;
    loadingPayload?: any,    
    transform?: (data: Result) => Result,
    loading?: (dispatch: any, data: Result) => void,
    success?: (dispatch: any, data: Result) => void,
    error?: (dispatch: any, error: CommonServerError) => void
  }) => async (dispatch: any, state: () => ReduxState) => {
  
  try {
    if(options.action)
      dispatch(commonStateLoading(options.action,options.loadingPayload||{}))
    if(options.loading)
      options.loading(dispatch, options.loadingPayload);

    if(options.authorized === undefined || options.authorized)
      dispatch(refreshToken());
    
    const res = await http.get<Result>(
      urlAddDataset(options.url, state().dataset),
      options.cacheKey, 
      options.invalidate,
      options.expiration
    )

    if(http.hasError(res)) {
      if(options.action)
        dispatch(commonStateError(options.action, res));    
      if(options.error) 
        options.error(dispatch, res as CommonServerError);      
    } else {
      if(options.action)
        dispatch(commonStateComplete(options.action, options.transform ? options.transform(res as Result) : res));      
      if(options.success) 
        options.success(dispatch, res as Result);
    }
  } catch (ex) {
    if(options.action)
      dispatch(commonStateError(options.action, ex));    
  }
}

/**
 * Common action to download a file from the server
 * @param options Options
 */
export const httpGetFile = (
  options: {
    action?: string,
    url: string,
    authorized?: boolean;
    loadingPayload?: any,
    filename?: string,
    success?: (dispatch: any) => void,
    error?: (dispatch: any, error: CommonServerError) => void
  }) => async (dispatch: any, state: () => ReduxState) => {
  
  try {
    if(options.action)
      dispatch(commonStateLoading(options.action,options.loadingPayload||{}))

    if(options.authorized === undefined || options.authorized)
      dispatch(refreshToken());

    const res = await http.getFile(
      urlAddDataset(options.url, state().dataset),
      options.filename
    )
    if(http.hasError(res)) {
      if(options.action)
        dispatch(commonStateError(options.action, res));    
      if(options.error)
        options.error(dispatch, res as CommonServerError);      
    } else {
      if(options.action)
        dispatch(commonStateComplete(options.action, res));      
      if(options.success)
        options.success(dispatch);
    }
  } catch (ex) {
    if(options.action)
      dispatch(commonStateError(options.action, ex));    
  }
}


/**
 * Common action to download a blob from the server
 * @param options Options
 */
export const httpGetBlob = (
  options: {
    action?: string,
    url: string,
    authorized?: boolean;
    loadingPayload?: any,
    filename?: string,
    success?: (dispatch: any, data: Blob) => Promise<void>,
    error?: (dispatch: any, error: CommonServerError) => Promise<void>
  }) => async (dispatch: any, state: () => ReduxState) => {
  
  try {
    if(options.action)
      dispatch(commonStateLoading(options.action,options.loadingPayload||{}))

    if(options.authorized === undefined || options.authorized)
      dispatch(refreshToken());

    const blob = await http.getBlob(urlAddDataset(options.url, state().dataset))

    if(http.hasError(blob)) {
      if(options.action)
        dispatch(commonStateError(options.action, blob));    
      if(options.error)
        await options.error(dispatch, blob as CommonServerError);      
    } else {
      if(options.action)
        dispatch(commonStateComplete(options.action, blob));      
      if(options.success)
        await options.success(dispatch, blob as Blob);
    }
  } catch (ex) {
    if(options.action)
      dispatch(commonStateError(options.action, ex));    
  }
}


/**
 * HTTP DELETE action
 * @param options Options
 */
export const httpDelete = (
  options: {
    action: string,
    url: string,
    cacheKeys?: string[],
    transform?: (res: any) => any,
    success?: (dispatch: any) => void,
    error?: (dispatch: any, error: CommonServerError) => void
  }) => async (dispatch: any, state: () => ReduxState) => {
  
  try {
    dispatch(commonStateLoading(options.action,{}))
    dispatch(refreshToken());
    
    const res = await http.delete(options.url, options.cacheKeys || []);
    
    if(http.hasError(res)) {
      dispatch(commonStateError(options.action, res));    
      if(options.error) options.error(dispatch, res as CommonServerError);      
    } else {
      dispatch(commonStateComplete(options.action, options.transform ? options.transform(res) : res));
      if(options.success) options.success(dispatch);
    }
  } catch (ex) {
    dispatch(commonStateError(options.action, ex));    
  }
}

