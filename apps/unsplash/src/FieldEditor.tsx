import React from 'react';
import { TextInput } from '@contentful/forma-36-react-components';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import debounce from 'lodash.debounce';
import Client from './client';

interface Props {
    sdk: FieldExtensionSDK;
}

interface State {
    searchValue: string;
    value: object | null;
    client: Client;
    error: boolean;
    photos: UnsplashResult[];
}

export default class FieldEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      searchValue: '',
      value: props.sdk.field.getValue() || null,
      client: new Client(process.env.UNSPLASH_TOKEN),
      error: false,
      photos: [],
    };
  }

  detachExternalChangeHandler: Function | null = null;

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();

    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(this.onExternalChange);
  }

  componentWillUnmount() {
    if (this.detachExternalChangeHandler) {
      this.detachExternalChangeHandler();
    }
  }

  onExternalChange = (value: object | null) => {
    this.setState({ value });
  };

  onSearch = debounce(async (value: string) => {
      if (!value) {
          return;
      }

      const res = await this.state.client.search(value);

      this.setState({
          error: res.error,
          photos: res.photos,
      });
  }, 1000);

  render = () => {
    const {photos, error} = this.state;

    return (
        <div>
            <TextInput
                width="large"
                type="text"
                id="my-field"
                testId="my-field"
                placeholder="Search for a photo"
                value={this.state.searchValue}
                onChange={(e) => this.onSearch(e.target.value)}
            />
            {this.s}
        </div>
    );
  };
}