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
    [key: string]: any; // Allow for additional dynamic fields
  }
  
  export interface ApiDataConfig {
    [key: string]: {
      name: string;
      internalID: string;
      url: string;
      endpoints: {
        search: {
          endpoint: string;
          required_queries: Record<string, any>;
        };
      };
      get_image_url: (size: number, id: string) => string;
    };
  }
  
export interface DateRange {
    from: number | null;
    to: number | null;
  }