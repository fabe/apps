import React from 'react';
import { AppExtensionSDK, CollectionResponse, EditorInterface } from 'contentful-ui-extensions-sdk';
import {
  Heading,
  Paragraph,
  Typography,
  FieldGroup,
  CheckboxField,
  TextField,
  TextLink
} from '@contentful/forma-36-react-components';
import {findSelectedContentTypes} from './util';

interface State {
    selectedContentTypes: string[];
    contentTypes: {id: string; name: string}[];
}

interface Props {
    sdk: AppExtensionSDK;
}

export default class Config extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selectedContentTypes: [],
            contentTypes: [],
        };
    }

    async componentDidMount() {
        const {app, space, ids} = this.props.sdk;

        const [ctsRes, eiRes] = await Promise.all([
            space.getContentTypes<ContentType>(),
            space.getEditorInterfaces()
        ]);

        const items = ctsRes ? ctsRes.items : [];

        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState(
            {
                contentTypes: items.map(ct => ({ name: ct.name, id: ct.sys.id })),
                selectedContentTypes: findSelectedContentTypes(ids.app, eiRes.items),
            },
            () => app.setReady()
        );
    }

    async onConfigure() {
        return {
            parameters: {

            },
            targetState: {
                EditorInterface: {

                },
            },
        };
    }

    toggleCt = (id: string) => {
        const {selectedContentTypes} = this.state;

        if (selectedContentTypes.includes(id)) {
            this.setState(prevState => ({selectedContentTypes: prevState.selectedContentTypes.filter(ctId => ctId !== id)}));
        } else {
            this.setState(prevState =>({selectedContentTypes: prevState.selectedContentTypes.concat([id])}));
        }
    }

    render() {
        return (
            <div className="app">
                <div className="background" />
                <div className="body">
                    <div className="config">
                        <FieldGroup>
                            {this.state.contentTypes.map(ct => (
                            <CheckboxField
                                onChange={() => this.toggleCt(ct.id)}
                                labelText={ct.name}
                                name={ct.name}
                                checked={this.state.selectedContentTypes.includes(ct.id)}
                                value={ct.id}
                                id={ct.name}
                                key={ct.id}
                                data-test-id={`ct-item-${ct.id}`}
                            />
                            ))}
                        </FieldGroup>
                    </div>
                </div>
                <div className="logo">
                </div>
            </div>
        );
    }
}