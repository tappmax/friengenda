import { AuthConstants } from "constants/auth.constants";
import { AuthToken } from "models/auth.models";
import moment from "moment";

class AuthService {
  setToken = (authToken: AuthToken) => {
    try {
      // Save the token in local storage
      localStorage.setItem(
        AuthConstants.localStorageKeys.token, 
        JSON.stringify(authToken)
      );         

    } catch (err) {
      console.error(err);
    }
  }

  clearToken = () => {
    try {
      localStorage.removeItem(AuthConstants.localStorageKeys.token);
    } catch (err) {
      console.error(err);
    }
  }

  getToken() : AuthToken | null {
    try {
      const serializedToken : string | null = localStorage.getItem(
        AuthConstants.localStorageKeys.token
      );

      if (serializedToken) {
        const token = JSON.parse(serializedToken) as AuthToken;
        if (token === null) 
          return null;

        return token;
      }
    } catch {      
    }

    return null;    
  }

  isTokenExpired (token: AuthToken | null, padding: number = 55) {  
    if(null == token)
      return true;

    return (moment().utc().unix() > token.expires - padding);
  };
}


export default new AuthService();
