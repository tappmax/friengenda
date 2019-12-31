export interface IJWTPayload {
  id: number;
  exp: number;
}

export interface RefreshTokenResponse {
  token: string;
  tokenExpiration: number;
}

export interface AppUser {
  id: number | undefined;
  email: string;
  status: "Unconfirmed" | "Active" | "Disabled" | undefined;
  firstName: string;
  lastName: string;
  created?: Date;
  lastLogin?: Date;
  token: string;
  tokenExpiration: number;
  tokenDuration: number;
  tokenRefreshing: boolean;
  authorized: boolean;
}

export type LoginCredentials = {
  username: string;
  password: string;
  redirect?: string;
}

export type AuthToken = {
  token: string;
  expires: number;
}
