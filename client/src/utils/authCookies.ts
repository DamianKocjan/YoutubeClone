import { Cookies } from 'react-cookie';

const cookies = new Cookies();

export const createAccessTokenCookie = (value: string): void => {
  cookies.set('access_token', value, {
    path: '/',
    expires: new Date(Date.now() + 2700 * 1000),
  });
};

export const createRefreshTokenCookie = (value: string): void => {
  cookies.set('refresh_token', value, {
    path: '/',
    expires: new Date(Date.now() + 86400 * 1000),
  });
};

export const createUserCookie = (value: string): void => {
  cookies.set('user', value, {
    path: '/',
    expires: new Date(Date.now() + 2700 * 1000),
  });
};
