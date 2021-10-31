import React from 'react';
import ReactDOM from 'react-dom';
import TimeAgo from 'javascript-time-ago';

import App from './App';

import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
