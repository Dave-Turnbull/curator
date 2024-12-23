export interface ApiEndpoint {
    endpoint: string;
    required_queries: Record<string, any>;
  }
  
  export interface ApiEndpoints {
    search: ApiEndpoint;
    object?: ApiEndpoint;
  }
  
  export interface Museum {
    name: string;
    internalID: string;
    url: string;
    endpoints: ApiEndpoints;
    required_queries: Record<string, any>;
    get_image_url: (size: number, id: string) => string;
  }
  
  export interface ApiDataType {
    VANDA: Museum;
    CHIA: Museum;
  }
  
  export interface ArtworkRecord {
    id: string;
    title: string;
    description?: string;
    image_src?: string;
    thumbnail_src?: string;
    creator?: string;
    date?: string;
    origin?: string;
    medium?: string;
    credit?: string;
    size?: string;
    type?: string;
    museum?: string;
    [key: string]: any;
  }
  
  export type MuseumKey = keyof ApiDataType;