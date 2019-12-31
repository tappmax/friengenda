export const AuthConstants = {
  actions: {
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
    REFRESH_TOKEN: "REFRESH_TOKEN"
  },
  cacheKeys: {
    user: "fren__user"
  },
  localStorageKeys: {
    token: "fren__token"
  },
  server: {
    endpoints: {
      login: "/auth/login",
      refreshToken: "/auth/token",
      logout: "/auth/logout",
      resetPassword: "/auth/resetPassword",
      registerUser: "/auth/register",
      changeUserPassword: "/auth/changepassword",
      forgotUserPassword: "/auth/forgotpassword",
      sendVerifyEmail: "/auth/verifyemail",
      getSession: "/session"
    }
  }
};
