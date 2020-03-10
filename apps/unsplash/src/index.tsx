import * as React from 'react';
import { render } from 'react-dom';
import { init, FieldExtensionSDK, AppExtensionSDK, locations } from 'contentful-ui-extensions-sdk';
import Config from './Config';
import FieldEditor from './FieldEditor';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.scss';

init(sdk => {
    if (sdk.location.is(locations.LOCATION_APP_CONFIG)) {
      render(<Config sdk={sdk as AppExtensionSDK} />, document.getElementById('root'));
    } else if (sdk.location.is(locations.LOCATION_ENTRY_FIELD)){
      render(<FieldEditor sdk={sdk as FieldExtensionSDK} />, document.getElementById('root'));
    }
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
