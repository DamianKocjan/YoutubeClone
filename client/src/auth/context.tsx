import React, { useReducer, createContext, useContext } from 'react';
import { Cookies } from 'react-cookie';

import { IChannel } from '../types/channel';
import { initialState, AuthReducer, AuthAction, AuthState } from './reducer';

const cookies = new Cookies();

const userCookie = cookies.get('user') || {};
const accessTokenCookie = cookies.get('access_token');
const refreshTokenCookie = cookies.get('refresh_token');

const user: IChannel = {
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

const AuthStateContext = createContext<AuthState>({
  user: user,
  accessToken: '',
  refreshToken: '',
  loading: false,
  errorMessage: null,
  isLogged: false,
});
const AuthDispatchContext = createContext<React.Dispatch<AuthAction> | any>({});

export function useAuthState(): AuthState {
  const context = useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error('useAuthState must be used within a AuthProvider');
  }

  return context;
}

export function useAuthDispatch(): React.Dispatch<AuthAction> {
  const context = useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error('useAuthDispatch must be used within a AuthProvider');
  }

  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
}: AuthProviderProps) => {
  const [user, dispatch] = useReducer(AuthReducer, initialState);

  return (
    <AuthStateContext.Provider value={user}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};
