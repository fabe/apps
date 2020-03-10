import React from 'react';
import { TextInput, Button } from '@contentful/forma-36-react-components';
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
      photos: []
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

  openSearch = async () => {
    const close = await this.props.sdk.dialogs.openCurrentApp();
  };

  render() {
    const { photos, error } = this.state;

    return (
      <div>
        <Button onClick={this.openSearch}>Open Search</Button>
      </div>
    );
  }
}
