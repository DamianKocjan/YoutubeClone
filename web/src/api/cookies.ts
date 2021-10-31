import { Cookies } from 'react-cookie';

const cookies = new Cookies();

export const createAccessTokenCookie = (value: string): void => {
  cookies.set('access_token', value, {
    path: '/',
    expires: new Date(Date.now() + 604800 * 1000), // 7 days
  });
};

export const createRefreshTokenCookie = (value: string): void => {
  cookies.set('refresh_token', value, {
    path: '/',
    expires: new Date(Date.now() + 1209600 * 1000), // 14 days
  });
};
