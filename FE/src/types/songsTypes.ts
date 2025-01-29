export interface SongsTypes {
  name: string;
  duration_ms: number;
  id: string;
  artists: {
    id: string;
    name: string;
  }[];
  album: {
    name: string;
    id: string;
    images: {
      height: number;
      width: number;
      url: string;
    }[];
  };
}
