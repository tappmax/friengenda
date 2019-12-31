import * as _ from 'lodash';
import axios, { AxiosRequestConfig, AxiosInstance } from "axios";
import {
  CommonServerResponse,
  CachedItem,
  CommonServerError
} from "models/common.models";
import { CommonConstants } from "constants/common.constants";
import { AuthToken } from "models/auth.models";
import { AuthConstants } from "constants/auth.constants";

const enableLogs = false;

class HttpClient {
  private _client: AxiosInstance;

  constructor(
    baseURL: string = CommonConstants.server.endpoints.apiRoot,
    config?: AxiosRequestConfig
  ) {
    config = !!config ? config : ({ baseURL } as AxiosRequestConfig);
    this._client = axios.create(config);
  }

  public getBaseURL() : string {
    return window.location.hostname === "localhost"
        ? "http://localhost:8081" + CommonConstants.server.endpoints.apiRoot
        : CommonConstants.server.endpoints.apiRoot;    
  }

  private getRequestOptions = (): AxiosRequestConfig => {
    const baseURL = this.getBaseURL();
    let options: AxiosRequestConfig = {
      baseURL,
      headers: CommonConstants.defaults.commonHeaders
    };

    const serializedToken = localStorage.getItem(AuthConstants.localStorageKeys.token) as string | null;
    if (serializedToken) {
      const authToken = JSON.parse(serializedToken) as AuthToken;
      options = {
        ...options,
        headers: {
          ...options.headers,
          authorization: `BEARER ${authToken.token}`
        }
      };
    }
    return options;
  };

  handleConnectionRefused = (res: any) => {
    // If we cant reach the server at all then report something useful
    if(!res) {
      return { 
        error: 'ConnectionRefused',
        status: 502,
        friendlyDetails: "Connection to server was refused" 
      } as CommonServerError;
    }

    return res;
  }

  //#region METHOD WRAPPERS
  get = async <Res>(
    url: string,
    cacheKey?: string,
    invalidate = false,
    expiration = 3600
  ): Promise<Res | CommonServerError> => {

    const options = await this.getRequestOptions();
    let cached = cacheKey ? this.retrieve<Res>(cacheKey) : null;
    if (!invalidate && !!cached) {
      if (enableLogs) console.log('cached:'+url, cached);
      return cached;
    }
        
    const res =
      this.handleConnectionRefused(
        await this._client
          .get<CommonServerResponse<Res>>(url, options)
          .catch(error => error.response)
      );

    if (enableLogs) console.log('get:' + url, res);
    if (this.hasError(res))
      return {...res.data, status: res.status} as CommonServerError;
    
    if (cacheKey)
      this.store<Res>(cacheKey, res.data, expiration);

    return res.data as Res;
  };

  getFile = async (url: string, filename?: string): Promise<CommonServerError | boolean> => {
    try {
      const options = await this.getRequestOptions();
      // remove json content type headers
      options.headers = {
        authorization: (options as any).headers.authorization
      };
      const response = await this._client.get(url, {
        ...options,
        responseType: "blob"
      }).catch(err => err.response);
      if (this.hasError(response)) {
        return response as CommonServerError;
      }
      
      // IE workaround
      if (typeof window.navigator.msSaveBlob !== "undefined") {
        window.navigator.msSaveBlob(response.data);
        return Promise.resolve(true);
      }
      const objUrl = window.URL.createObjectURL(new Blob([response.data]));
      let link = document.createElement("a");
      link.href = objUrl;
      link.style.display = "none";
      link.setAttribute("download", filename || `${objUrl.split("/")[objUrl.split("/").length-1]}.pdf`);
      // workaround for older browsers
      if (typeof link.download === "undefined") {
        link.setAttribute("target", "_blank");
      }
      document.body.appendChild(link);
      link.click();
      // cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(objUrl);
      }, 1);
      return Promise.resolve(true);
    } catch (err) {
      return Promise.reject(err);
    }
  };

  getBlob = async (url: string,): Promise<CommonServerError | Blob> => {
    try {
      const options = await this.getRequestOptions();
      options.headers = {
        authorization: (options as any).headers.authorization
      };

      const response = await this._client.get(url, {
        ...options,
        responseType: "blob"
      }).catch(err => err.response);

      if (this.hasError(response))
        return response as CommonServerError;
      
      return Promise.resolve(response.data);
    } catch (err) {
      return Promise.reject(err);
    }
  };


  post = async <Req, Res>(
    url: string,
    body: Req,
    cacheKeys: string[],
    userOptions?: AxiosRequestConfig
  ): Promise<Res | CommonServerError> => {
    const options = _.merge(await this.getRequestOptions(), userOptions);
    const res = this.handleConnectionRefused(
      await this._client
      .post<CommonServerResponse<Res>>(url, body, options)
      .catch(error => error.response)
    );
    
    if (this.hasError(res)) return res.data as CommonServerError;

    cacheKeys.map(cacheKey => this.invalidate(cacheKey));

    return res.data;
  };

  put = async <Req, Res>(
    url: string,
    body: Req,
    cacheKeys: string[]
  ): Promise<Res | CommonServerError> => {
    const options = await this.getRequestOptions();
    const res = this.handleConnectionRefused(
      await this._client
      .put<CommonServerResponse<Res>>(url, body, options)
      .catch(error => error.response)
    );
    
    if (this.hasError(res)) return res.data as CommonServerError;
    cacheKeys.map(cacheKey => this.invalidate(cacheKey));

    return res.data as Res;
  };

  /**
   * Handles PATCHs to server. Also invalidates store cache if url is present as key
   * @param url Server URL as well as key for getting from store
   * @param body PATCH body to send
   * @param clearCache Optional param, when true clears corresponding url cache for GET method
   * @default true
   */
  patch = async <Req, Res>(
    url: string,
    body: Req,
    cacheKeys: string[]
  ): Promise<Res | CommonServerError> => {
    const options = await this.getRequestOptions();
    const res = this.handleConnectionRefused(
      await this._client
        .patch<CommonServerResponse<Res>>(url, body, options)
        .catch(error => error.response)
    );
    if (this.hasError(res)) return res.data as CommonServerError;
    cacheKeys.map(cacheKey => this.invalidate(cacheKey));

    return res.data as Res;
  };

  delete = async (
    url: string,
    cacheKeys: string[]
  ): Promise<string | CommonServerError> => {
    const options = await this.getRequestOptions();
    const res = this.handleConnectionRefused(
      await this._client
        .delete(url, options)
        .catch(error => error.response)
    );
    if (this.hasError(res)) return res as CommonServerError;
    cacheKeys.map(cacheKey => this.invalidate(cacheKey));
    return res.data;
  };
  // #endregion

  /**
   *
   */
  public hasError = <Res>(res: any) =>
    (res as CommonServerResponse<Res>).hasOwnProperty("status") && +res.status > 399;

  // #region store
  store<T>(url: string, data: any, expiration = 3600): void {
    data.expiration = Date.now() + expiration * 1000;
    localStorage.setItem(url, JSON.stringify(data as T));
    return;
  }
  retrieve<T>(url: string): any {
    let cached = JSON.parse(localStorage.getItem(url) || "{}") as CachedItem<T>;
    if (cached.expiration > Date.now()) delete cached.expiration;
    else return false;
    return cached;
  }
  invalidate(url: string): void {
    localStorage.removeItem(url);
  }
  // #endregion
}

export default new HttpClient();
