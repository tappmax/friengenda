import {
  CommonState,
  PaginatedResponse,
  AppSession
} from "models/common.models";

export const CommonConstants = {
  ui: {
    defaults: {
      blankChar: "—",
      error: "Something went wrong. Please try again."
    },
    formats: {
      phone: "(###) ###-####",
      ss: "###-##-####",
      ein: "##-#######"
    },
    formatters: {
      einRegex: /^(\d{2})(\d{7})$/,
      ssRegex: /^(\d{3})(\d{2})(\d{4})$/
    },
    regexs: {
      einRegex: /^\w{2}-\w{7}$/,
      ssRegex: /^\w{3}-\w{2}-\d{4}$/
    }
  },
  server: {
    endpoints: {
      apiRoot: "/api/v1",
      enums: {
        productType: "/enums/ProductType",
        paymentType: "/enums/PaymentType",
        paymentMethod: "/enums/PaymentMethod",
        planExternalIdType: "/enums/PlanExternalIdType"
      }
    }
  },
  defaults: {
    commonState: {
      error: "",
      loading: false,
      data: [] as any
    } as CommonState<any>,
    commonStateAsPaginated: {
      error: "",
      loading: false,
      data: [] as any
    } as CommonState<PaginatedResponse<any>>,
    commonHeaders: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    appSession: {
      isEditing: false
    } as AppSession
  },
  actionSuffixes: {
    LOADING: "_LOADING",
    COMPLETE: "_COMPLETE",
    ERROR: "_ERROR"
  },
  actions: {
    UPDATE_NAV: "UPDATE_NAV",
    UPDATE_TITLE: "UPDATE_TITLE",
    GET_ENUMS: "GET_ENUMS",
    APP_SESSION: "APP_SESSION"
  },
  cacheKeys: {
    redirectUrl: "fren__redirect_url",
    options: "fren__enum_options"
  }
};
