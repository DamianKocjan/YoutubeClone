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

export const initialState: AuthState = {
  user: cookies.get('user') || '',
  accessToken: cookies.get('access_token') || '',
  refreshToken: cookies.get('refresh_token') || '',
  loading: false,
  errorMessage: null,
  isLogged: false,
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
