import React from 'react';
import { render } from 'react-dom';
import { init, locations, AppExtensionSDK, FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss/dist/styles.css';
import { AppConfig } from './AppConfig';
import { TypeFormField } from './FIeld/TypeFromField';
import { TypeformPreviewWidget } from './TypeFormWidget';
import './index.scss';

init(sdk => {
  if (sdk.location.is(locations.LOCATION_APP_CONFIG)) {
    render(<AppConfig sdk={sdk as AppExtensionSDK} />, document.getElementById('root'));
  } else if (sdk.location.is(locations.LOCATION_DIALOG)) {
    render(
      <TypeformPreviewWidget sdk={sdk as FieldExtensionSDK} />,
      document.getElementById('root')
    );
  } else {
    render(<TypeFormField sdk={sdk as FieldExtensionSDK} />, document.getElementById('root'));
  }
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */