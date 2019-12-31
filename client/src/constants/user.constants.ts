import { LoginCredentials } from "models/auth.models";

export const UserConstants = {
    actions: {
        LOGIN: "LOGIN",
        USER: "USER"
    },
    defaults: {
        loginCredentials: {
            username: '',
            password: ''
        } as LoginCredentials
    },
    server: {
        endpoints: {
            getAllUsers: "/users",
            searchUsers: "/users/search",
            getUser: "/users/:userId",
            updateUser: "/users/:userId",
            getUserInfo: "/users/:userId/info",
            getUserRoles: "/users/:userId/roles",
            getUserRole: "/users/:userId/roles/:roleId",
        }
    }
}