import React from 'react';
import { TextInput, Button, Asset } from '@contentful/forma-36-react-components';
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
}

function formatPhotoThumb(url: string) {
    return url.replace('fit=max', 'fit=fillmax').concat('&w=300&h=300');
}

export default class Dialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      searchValue: '',
      client: new Client(process.env.UNSPLASH_TOKEN || ''),
      error: false,
      photos: [],
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

  save = (photo: UnsplashResult) => {
    this.props.sdk.close(photo);
  };

  render() {
    const { photos } = this.state;

    return (
      <div>
        <div>
          <TextInput
            width="full"
            type="text"
            id="my-field"
            testId="my-field"
            placeholder="Search for a photo"
            autoComplete="off"
            value={this.state.searchValue}
            onChange={e => this.onSearch(e.target.value)}
          />
        </div>
        <div className="search-collection">
          {photos.map(photo => (
            <div key={photo.id} onClick={() => this.save(photo)} className="photo">
                <Asset src={formatPhotoThumb(photo.urls.thumb)} type="image" title={photo.alt_description} />
            </div>
        ))}
        </div>
      </div>
    );
  }
}
