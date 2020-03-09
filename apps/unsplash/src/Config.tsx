import React from 'react';
import { AppExtensionSDK } from 'contentful-ui-extensions-sdk';
import {findSelectedContentTypes} from './util';

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

    async componentDidMount() {
        const {app, space, ids} = this.props.sdk;

        const [ctsRes, parameters, eiRes] = await Promise.all([
            (space.getContentTypes<ContentType>()),
            (app.getParameters() as Promise<UnsplashParameters | null>),
            space.getEditorInterfaces()
        ]);

        const items = ctsRes ? (ctsRes.items as { name: string; sys: { id: string } }[]) : [];

        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState(
        {
            contentTypes: items.map(ct => ({ name: ct.name, id: ct.sys.id })),
            projectId: parameters ? parameters.projectId : '',
            selectedContentTypes: findSelectedContentTypes(ids.app, ctsRes.items),
        },
        () => sdk.app.setReady()
        );
    }

    async onConfigure() {
        return {
            parameters: {

            },
            targetState: {},
        };
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