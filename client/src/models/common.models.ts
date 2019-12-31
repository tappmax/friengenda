export interface CommonState<T> {
  error: string;
  loading: boolean;
  data: T;
}

export interface CommonAction {
  payload: any;
  type: string;
}

export interface CommonServerError {
  error: string;
  status: number;
  innerError?: any;
  details?: any;
  friendlyDetails?: any;
}

export interface CommonServerResponse<T> {
  message: string;
  data: T;
  error: string;
}

export interface CachedItem<T> extends CommonServerResponse<T> {
  expiration: number;
}

export interface PaginatedResponse<T> {
  items: T;
  count: number;
  page: number;
  pageSize: number;
}

export interface Enums {
  paymentMethods: string[];
  paymentTypes: string[];
  planExternalIdTypes: string[];
  productTypes: string[];
}

export interface OrderState<T> {
  orderBy?: OrderItem<T>;
  thenBy?: OrderItem<T>;
  orderByQueryString: string;
}

export interface OrderItem<T> {
  name: keyof T;
  descend: boolean;
}

export interface OrderByItem<T> {
  name: T;
  descend: boolean;
}

export interface FrenTwoColumnDetailsModel {
  name: string;
  value: any;
}

export interface AppSession {
  isEditing: boolean;
}