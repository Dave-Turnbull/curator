/* eslint-disable @typescript-eslint/no-explicit-any */

import { orderByIndex } from "./fetchData";

export interface Queries {
    search_titles?: string | null;
    search_all?: string | null;
    date?: {
      from?: number | null;
      to?: number | null;
    };
    creator?: string | null;
    page?: number;
    order_by?: string;
  }

  interface ElasticsearchQueryStruct {
    query: {
      bool: {
        filter: any[];
      };
    };
    q?: string; 
    from?: number;
  }
  
  export const formatVandASearchFilters = (queries: Queries): { [key: string]: string } => {
    const formattedQueries: { [key: string]: string } = {};
    
    Object.entries(queries).forEach(([key, value]) => {
      if (value) {
        switch (key) {
          case 'search_titles':
            formattedQueries.q_object_title = value;
            break;
          case 'search_all':
            formattedQueries.q = value;
            break;
          case 'date':
            if (value.from) formattedQueries.year_made_from = value.from;
            if (value.to) formattedQueries.year_made_to = value.to;
            break;
          case 'creator':
            formattedQueries.q_actor = value;
            break;
          case 'page':
            formattedQueries.page = value + 1
            break;
          case 'order_by':
            //@ts-expect-error temp fix
            if (orderByIndex[value].VANDA) {
              //@ts-expect-error temp fix
              formattedQueries.order_by = orderByIndex[value].VANDA
            }
            break;
        }
      }
    });
    return formattedQueries;
  };
  
  export const formatElastisearchFilters = (queries: Queries): Record<string, any> => {
    const formattedQueries:ElasticsearchQueryStruct = {
      query: {
        bool: {
          filter: [] as any[]
        }
      }
    };
    
    Object.entries(queries).forEach(([key, value]) => {
      if (value) {
        switch (key) {
          case 'search_titles':
            formattedQueries.query.bool.filter.push({
              wildcard: { title: { value: `*${value}*` } }
            });
            break;
          case 'search_all':
            formattedQueries.q = value;
            break;
          case 'date':
            if (value.to || value.from) {
              formattedQueries.query.bool.filter.push({
                range: {
                  date_display: {
                    gte: value.from ? value.from : undefined,
                    lte: value.to ? value.to : undefined
                  }
                }
              });
            }
            break;
          case 'creator':
            formattedQueries.query.bool.filter.push({
              wildcard: { artist_display: { value: `*${value}*` } }
            });
            break;
          case 'page':
            formattedQueries.from = value;
            break;
          case 'order_by':
            //@ts-expect-error temp fix
            if (orderByIndex[value].CHIA) {
              //@ts-expect-error temp fix
              formattedQueries.sort = orderByIndex[value].CHIA
            }
            break;
        }
      }
    });
    
    return formattedQueries;
  };