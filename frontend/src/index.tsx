import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { AuthProvider } from "react-oidc-context";
import { WebStorageStateStore } from "oidc-client-ts";

import { MantineProvider } from '@mantine/core';

const cognitoAuthConfig = {
  authority: "https://cognito-idp.ca-central-1.amazonaws.com/ca-central-1_2nDSdD4R9",
  client_id: "6ciq9qotdr1snk75j014hg6q49",
  redirect_uri: "http://localhost:3000/",
  post_logout_redirect_uri: 'http://localhost:3000/workout',
  response_type: "code",
  scope: "email openid profile",
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="dark">
      <AuthProvider {...cognitoAuthConfig}>
        <App />
      </AuthProvider>
    </MantineProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
