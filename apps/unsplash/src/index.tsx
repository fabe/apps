import * as React from 'react';
import { render } from 'react-dom';
import {
  init,
  FieldExtensionSDK,
  AppExtensionSDK,
  locations,
  DialogExtensionSDK
} from 'contentful-ui-extensions-sdk';
import Config from './Config';
import FieldEditor from './FieldEditor';
import Dialog from './Dialog';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.scss';

function renderAtRoot(component: React.ReactElement) {
  return render(component, document.getElementById('root'));
}

init(sdk => {
  if (sdk.location.is(locations.LOCATION_APP_CONFIG)) {
    renderAtRoot(<Config sdk={sdk as AppExtensionSDK} />);
  } else if (sdk.location.is(locations.LOCATION_ENTRY_FIELD)) {
    renderAtRoot(<FieldEditor sdk={sdk as FieldExtensionSDK} />);
  } else if (sdk.location.is(locations.LOCATION_DIALOG)) {
    renderAtRoot(<Dialog sdk={sdk as DialogExtensionSDK} />);
  }
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
