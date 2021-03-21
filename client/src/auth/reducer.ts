import { Cookies } from 'react-cookie';

import { IChannel } from '../types/channel';

const cookies = new Cookies();

export interface AuthState {
  user: IChannel;
  accessToken: string;
  refreshToken: string;
  loading: boolean;
  errorMessage: null | string;
  isLogged: boolean;
}

const userCookie = cookies.get('user') || {};
const accessTokenCookie = cookies.get('access_token');
const refreshTokenCookie = cookies.get('refresh_token');

const user: IChannel = {
  id: userCookie.id || '',
  first_name: userCookie.first_name || '',
  last_name: userCookie.last_name || '',
  username: userCookie.username || '',
  email: userCookie.email || '',
  avatar: userCookie.avatar || '',
  subscribers_count: userCookie.subscribers_count || 0,
  // background: userCookie.background || '',
  date_joined: userCookie.date_joined || '',
  description: userCookie.description || '',
  location: userCookie.location || '',
};

export const initialState: AuthState = {
  user: user,
  accessToken: accessTokenCookie || '',
  refreshToken: refreshTokenCookie || '',
  loading: false,
  errorMessage: null,
  isLogged:
    !!accessTokenCookie === true &&
    !!refreshTokenCookie === true &&
    !!userCookie === true,
};

export interface AuthPayload {
  user: IChannel;
  accessToken: string;
  refreshToken: string;
}

export type AuthAction =
  | { type: 'REQUEST_LOGIN' | 'LOGOUT' }
  | { type: 'LOGIN_SUCCESS'; payload: AuthPayload }
  | { type: 'LOGIN_ERROR'; error: string };

export const AuthReducer = (
  initialState: AuthState,
  action: AuthAction
): AuthState => {
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
          // background: '',
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
