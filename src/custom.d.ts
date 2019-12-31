declare namespace Express {
    export interface Request {
       validatedParams?: any;
       payload? : any;
    }

    export interface Response {
      error : (details : any) => void;
      success : () => void;
    }
 }
 
 