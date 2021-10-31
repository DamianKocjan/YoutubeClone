import { Cookies } from 'react-cookie';

import type { IChannel } from '../types/models';

const cookies = new Cookies();

export interface IAuthState {
  user: IChannel;
  accessToken: string;
  refreshToken: string;
  loading: boolean;
  errorMessage: null | string;
  isLogged: boolean;
}

const accessTokenCookie = cookies.get('access_token');
const refreshTokenCookie = cookies.get('refresh_token');

let userData = {
  id: '',
  first_name: '',
  last_name: '',
  username: '',
  email: '',
  avatar: '',
  subscribers_count: 0,
  background: '',
  date_joined: '',
  description: '',
  location: '',
};

if (accessTokenCookie) {
  userData = JSON.parse(atob(accessTokenCookie.split('.')[1]));
}

const user: IChannel = {
  id: userData.id,
  first_name: userData.first_name,
  last_name: userData.last_name,
  username: userData.username,
  email: userData.email,
  avatar: userData.avatar,
  subscribers_count: userData.subscribers_count || 0,
  background: userData.background,
  date_joined: userData.date_joined,
  description: userData.description,
  location: userData.location,
};

export const initialState: IAuthState = {
  user: user,
  accessToken: accessTokenCookie || '',
  refreshToken: refreshTokenCookie || '',
  loading: false,
  errorMessage: null,
  isLogged: !!accessTokenCookie === true && !!refreshTokenCookie === true,
};

export interface IAuthPayload {
  user: IChannel;
  accessToken: string;
  refreshToken: string;
}

export type IAuthAction =
  | { type: 'REQUEST_LOGIN' | 'LOGOUT' }
  | { type: 'LOGIN_SUCCESS'; payload: IAuthPayload }
  | { type: 'LOGIN_ERROR'; error: string };

export const AuthReducer = (
  initialState: IAuthState,
  action: IAuthAction
): IAuthState => {
  switch (action.type) {
    case 'REQUEST_LOGIN':
      return {
        ...initialState,
        loading: true,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...initialState,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        loading: false,
        isLogged: true,
      };
    case 'LOGOUT':
      return {
        ...initialState,
        user: {
          id: '',
          first_name: '',
          last_name: '',
          username: '',
          email: '',
          avatar: '',
          subscribers_count: 0,
          background: '',
          date_joined: '',
          description: '',
          location: '',
        },
        accessToken: '',
        refreshToken: '',
        isLogged: false,
      };

    case 'LOGIN_ERROR':
      return {
        ...initialState,
        loading: false,
        errorMessage: action.error,
      };

    default:
      return initialState;
  }
};
