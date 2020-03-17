import React, { useEffect } from 'react';
import { AppExtensionSDK } from 'contentful-ui-extensions-sdk';
import { Button } from '@contentful/forma-36-react-components';

interface Props {
  sdk: AppExtensionSDK;
  expireSoon: boolean;
  setToken: (token: string) => void;
}

const CLIENT_ID = '8DAtABe5rFEnpJJw8Uco2e65ewrZq6kALSfCBe4N11LW';
const OAUTH_REDIRECT_URI = 'http://localhost:3000/callback';

export function TypeformOAuth({ sdk, expireSoon, setToken }: Props) {
  useEffect(() => {
    sdk.app.setReady();
  }, []);

  const executeOauth = () => {
    const url = `https://api.typeform.com/oauth/authorize?&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      OAUTH_REDIRECT_URI
    )}&scope=forms:read+workspaces:read&state=${encodeURIComponent(window.location.href)}`;

    const oauthWindow = window.open(
      url,
      'Typeform Contentful',
      'left=150,top=10,width=800,height=900'
    );

    window.addEventListener('message', ({ data }) => {
      const { token, error } = data;

      if (error) {
        console.error('There was an error authenticating. Please refresh and try again.');
      } else if (token) {
        setToken(token);
      }

      if (oauthWindow) {
        oauthWindow.close();
      }
    });
  };

  return (
    <Button onClick={executeOauth} buttonType="primary">
      {expireSoon ? 'Reauthenticate with Typeform' : 'Connect to Typeform'}
    </Button>
  );
}