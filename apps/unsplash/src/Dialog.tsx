import React from 'react';
import { TextInput, Button } from '@contentful/forma-36-react-components';
import { DialogExtensionSDK } from 'contentful-ui-extensions-sdk';
import debounce from 'lodash.debounce';
import Client from './client';

interface Props {
  sdk: DialogExtensionSDK;
}

interface State {
  searchValue: string;
  client: Client;
  error: boolean;
  photos: UnsplashResult[];
  selectedPhotos: UnsplashResult[];
}

export default class Dialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      searchValue: '',
      client: new Client(process.env.UNSPLASH_TOKEN),
      error: false,
      photos: [],
      selectedPhotos: []
    };
  }

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();
  }

  onSearch = debounce(async (value: string) => {
    if (!value) {
      this.setState({ photos: [] });
      return;
    }

    const res = await this.state.client.search(value);

    this.setState({
      error: res.error,
      photos: res.photos
    });
  }, 300);

  togglePhoto = (photo: UnsplashResult) => {
    const { selectedPhotos } = this.state;

    if (selectedPhotos.find(s => s.id === photo.id)) {
      this.setState({ selectedPhotos: selectedPhotos.filter(s => s.id !== photo.id) });
    } else {
      this.setState({ selectedPhotos: selectedPhotos.concat([photo]) });
    }
  };

  render() {
    const { photos, error, selectedPhotos } = this.state;

    return (
      <div>
        <TextInput
          width="large"
          type="text"
          id="my-field"
          testId="my-field"
          placeholder="Search for a photo"
          autoComplete="off"
          value={this.state.searchValue}
          onChange={e => this.onSearch(e.target.value)}
        />
        {!!photos.length &&
          photos.map(photo => (
            <div
              style={{ border: selectedPhotos.find(p => p.id === photo.id) ? `1px solid red` : '' }}
              key={photo.id}
              onClick={() => this.togglePhoto(photo)}>
              <img src={photo.urls.thumb} />
            </div>
          ))}
      </div>
    );
  }
}
