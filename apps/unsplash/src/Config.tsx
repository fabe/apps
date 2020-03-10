import React from 'react';
import { AppExtensionSDK, CollectionResponse, EditorInterface } from 'contentful-ui-extensions-sdk';
import {
  Heading,
  Paragraph,
  Typography,
  Select,
  Option,
} from '@contentful/forma-36-react-components';
import get from 'lodash.get';

interface State {
    selectedContentType: string;
    contentTypes: {id: string; name: string}[];
}

interface Props {
    sdk: AppExtensionSDK;
}

export default class Config extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selectedContentType: '',
            contentTypes: [],
        };
    }

    async componentDidMount() {
        const {app, space} = this.props.sdk;

        const [ctsRes, parameters] = await Promise.all([
            space.getContentTypes<ContentType>(),
            app.getParameters<UnsplashParameters>(),
        ]);

        const formattedContentTypes = (ctsRes ? ctsRes.items : []).map(ct => ({ name: ct.name, id: ct.sys.id }));

        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState(
            {
                contentTypes: formattedContentTypes,
                selectedContentType: parameters
                    ? parameters.selectedContentType
                    : get(formattedContentTypes, [0, 'id'], ''),
            },
            () => app.setReady()
        );
    }

    async onConfigure(): Promise<AppConfig> {
        const {selectedContentType} = this.state;

        if (!selectedContentType) {
            this.props.sdk.notifier.error('You do not have any content types to select!');
            return false;
        }

        return {
            parameters: {
                selectedContentType: selectedContentType,
            },
            targetState: {
                EditorInterface: {

                },
            },
        };
    }

    pickCt = (id: string) => {
        this.setState({selectedContentType: id});
    }

    render() {
        let body = (
            <Typography>
                <Heading>
                    You do not have any content types!
                </Heading>
                <Paragraph>
                    First create a content type with a JSON field to continue.
                </Paragraph>
            </Typography>
        );

        if (this.state.contentTypes.length) {
            body = (
                <Select value={this.state.selectedContentType} onChange={(e) => this.pickCt(e.target.value)}>
                    {this.state.contentTypes.map(ct => (
                        <Option key={ct.id} value={ct.id}>
                            {ct.name}
                        </Option>
                    ))}
                </Select>
            );
        }

        return (
            <div className="app">
                <div className="background" />
                <div className="body">
                    <div className="config">
                        {body}
                    </div>
                </div>
                <div className="logo">
                </div>
            </div>
        );
    }
}