import { AppUser } from "./auth.models";
import { CommonState } from "./common.models";
import { LoginUser } from "./user.models";
import { RouterState } from "connected-react-router";

///#region view models
export interface AppComponentProps {
    router: RouterState;
    user: CommonState<AppUser> | undefined;
    login: (userInfo: LoginUser) => void;
    redirectToLogin: () => void;
}

export interface AppComponentState {}
//#endregion

//#region data models
//#endregion