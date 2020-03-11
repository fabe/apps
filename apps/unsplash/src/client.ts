export default class Client {
  private UNSPLASH_HOST = 'https://api.unsplash.com';
  token: string;

  constructor(token: string) {
    if (!token) {
      throw new Error('You must provide an Unsplash token!');
    }

    this.token = token;
  }

  public async search(value: string): Promise<SearchResponse> {
    const res = await fetch(
      `${this.UNSPLASH_HOST}/search/photos?page=1&query=${encodeURIComponent(value)}&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${this.token}`
        }
      }
    );

    if (res.ok) {
      const data: UnsplashResponse = await res.json();

      return {
        error: false,
        photos: data.results
      };
    }

    return {
      error: true,
      photos: []
    };
  }
}
