import React from 'react';
import { Cookies } from 'react-cookie';
import {
  createAccessTokenCookie,
  createRefreshTokenCookie,
  createUserCookie,
} from '../utils/authCookies';
import axiosInstance from '../utils/axiosInstance';
import { AuthAction } from './reducer';

const cookies = new Cookies();

interface ILoginPayload {
  username: string;
  password: string;
}

export async function loginUser(
  dispatch: React.Dispatch<AuthAction>,
  loginPayload: ILoginPayload
) {
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

    await axiosInstance
      .post('/token/', loginPayload)
      .then((res) => {
        data.accessToken = res.data.access;
        data.refreshToken = res.data.refresh;
      })
      .catch((err) => {
        error = String(err.message);
      });

    await axiosInstance
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

      axiosInstance.defaults.headers.Authorization = `Bearer ${data.accessToken}`;

      createAccessTokenCookie(data.accessToken);
      createRefreshTokenCookie(data.refreshToken);
      createUserCookie(JSON.stringify(data.user));

      return data;
    }

    dispatch({ type: 'LOGIN_ERROR', error: error });
    return;
  } catch (error) {
    dispatch({ type: 'LOGIN_ERROR', error: error });
  }
}

export async function logout(dispatch: React.Dispatch<AuthAction>) {
  dispatch({ type: 'LOGOUT' });

  axiosInstance.defaults.headers.Authorization = '';

  cookies.remove('access_token', { path: '/' });
  cookies.remove('refresh_token', { path: '/' });
  cookies.remove('user', { path: '/' });
}
