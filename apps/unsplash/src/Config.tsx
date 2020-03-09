import React from 'react';
import { AppExtensionSDK } from 'contentful-ui-extensions-sdk';

interface State {
 selectedContentTypes: string[];
}

interface Props {
    sdk: AppExtensionSDK;
}

export default class Config extends React.Component<Props, State> {
    state = {
        selectedContentTypes: [],
    };

    componentDidMount() {
        const {app} = this.props.sdk;

        app.setReady();
    }

    render() {
        return (
            <div className="app">
                <div className="background" />
                <div className="body">
                    <div className="config">
                        test
                    </div>
                </div>
                <div className="logo">
                </div>
            </div>
        );
    }
}