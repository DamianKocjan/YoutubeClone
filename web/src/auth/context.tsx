import React, { createContext, useContext, useReducer } from 'react';
import { Cookies } from 'react-cookie';

import type { IChannel } from '../types/models';
import type { IAuthAction, IAuthState } from './reducer';
import { AuthReducer, initialState } from './reducer';

const cookies = new Cookies();

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
  background: userCookie.background || '',
  date_joined: userCookie.date_joined || '',
  description: userCookie.description || '',
  location: userCookie.location || '',
};

const AuthStateContext = createContext<IAuthState>({
  user: user,
  accessToken: accessTokenCookie || '',
  refreshToken: refreshTokenCookie || '',
  loading: false,
  errorMessage: null,
  isLogged:
    !!accessTokenCookie === true &&
    !!refreshTokenCookie === true &&
    !!userCookie === true,
});
const AuthDispatchContext = createContext<React.Dispatch<IAuthAction> | any>(
  {}
);

export function useAuthState(): IAuthState {
  const context = useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error('useAuthState must be used within a AuthProvider');
  }

  return context;
}

export function useAuthDispatch(): React.Dispatch<IAuthAction> {
  const context = useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error('useAuthDispatch must be used within a AuthProvider');
  }

  return context;
}

export const AuthProvider: React.FC = ({ children }) => {
  const [user, dispatch] = useReducer(AuthReducer, initialState);

  return (
    <AuthStateContext.Provider value={user}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};
