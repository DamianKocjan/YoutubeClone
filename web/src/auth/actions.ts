import React from 'react';
import { Cookies } from 'react-cookie';

import { api, createAccessTokenCookie, createRefreshTokenCookie } from '../api';
import type { IAuthAction } from './reducer';

const cookies = new Cookies();

interface ILoginPayload {
  username: string;
  password: string;
}

interface ILoginResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    avatar: string;
    subscribers_count: number;
    background: string;
    date_joined: string;
    description: string;
    location: string;
  };
}

export async function loginUser(
  dispatch: React.Dispatch<IAuthAction>,
  loginPayload: ILoginPayload
): Promise<ILoginResult | undefined> {
  try {
    dispatch({ type: 'REQUEST_LOGIN' });
    const data = {
      accessToken: '',
      refreshToken: '',
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
    };
    let error = '';

    await api
      .post('/token/', loginPayload)
      .then((res) => {
        data.accessToken = res.data.access;
        data.refreshToken = res.data.refresh;
      })
      .catch((err) => {
        error = String(err.message);
      });

    await api
      .get(
        `/users/${JSON.parse(atob(data.accessToken.split('.')[1])).user_id}/`
      )
      .then((res) => {
        data.user = res.data;
      })
      .catch((err) => {
        error = String(err.message);
      });

    if (data.accessToken && data.refreshToken && !error) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: data });

      api.defaults.headers.Authorization = `Bearer ${data.accessToken}`;

      createAccessTokenCookie(data.accessToken);
      createRefreshTokenCookie(data.refreshToken);
      // createUserCookie(JSON.stringify(data.user));

      return data;
    }

    dispatch({ type: 'LOGIN_ERROR', error: error });
  } catch (error) {
    dispatch({ type: 'LOGIN_ERROR', error: error as string });
  }
}

export async function logout(
  dispatch: React.Dispatch<IAuthAction>
): Promise<void> {
  dispatch({ type: 'LOGOUT' });

  api.defaults.headers.Authorization = '';

  cookies.remove('access_token', { path: '/' });
  cookies.remove('refresh_token', { path: '/' });
  cookies.remove('user', { path: '/' });
}
