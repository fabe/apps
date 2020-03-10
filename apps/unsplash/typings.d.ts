interface ContentType {
  name: string;
  fields: {
    id: string;
    type: 'Object';
  }[];
  sys: {
    id: string;
  };
}

interface AppParameters {
  selectedContentTypeId: string;
}

interface TargetStateConfig {
  parameters: AppParameters;
  targetState: {
    EditorInterface: {
      [key: string]: {
        controls: {
          fieldId: string;
        }[];
      };
    };
  };
}

interface UnsplashResult {
  id: string;
  created_at: string;
  width: number;
  height: number;
  color: string;
  likes: number;
  liked_by_user: boolean;
  description: string;
  alt_description: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
}

interface UnsplashResponse {
  total: number;
  total_pages: number;
  results: UnsplashResult[];
}

interface SearchResponse {
  error: boolean;
  photos: UnsplashResult[];
}

type AppConfig = TargetStateConfig | false;
