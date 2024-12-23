import useApiCall from "../hooks/useApiCall";
import apiData from "./apiData";
import { formatElastisearchFilters, formatVandASearchFilters } from "./formatQueries";
import { Queries } from "./formatQueries";

export const formatResponseIndex = {
    data_path: {
        [apiData.CHIA.internalID]: 'data',
        [apiData.VANDA.internalID]: 'records',
      },
    fields: {
        id: {
            value: {
                [apiData.CHIA.internalID]: 'id',
                [apiData.VANDA.internalID]: ['systemNumber'],
            }
        },
        museum: {
            display_title: "Museum API",
            value: {
                [apiData.CHIA.internalID]: apiData.CHIA.name,
                [apiData.VANDA.internalID]: apiData.VANDA.name,
            },
            help_text: "The museum database this piece was loaded from.",
        },
        title: {
            display_title: "Title",
            value: {
                [apiData.CHIA.internalID]: ['title'],
                [apiData.VANDA.internalID]: ['_primaryTitle'],
            },
        },
        creator: {
            display_title: "Artist/Creator",
            value: {
                [apiData.CHIA.internalID]: ['artist_display'],
                [apiData.VANDA.internalID]: ['_primaryMaker','name'],
            },
            help_text: "The artist or creator of the piece.",
        },
        date: {
            display_title: "Date",
            value: {
                [apiData.CHIA.internalID]: ['date_display'],
                [apiData.VANDA.internalID]: ['_primaryDate'],
            },
            help_text: "The date the artwork was created.",
        },
        origin: {
            display_title: "Origin",
            value: {
                [apiData.CHIA.internalID]: ['place_of_origin'],
                [apiData.VANDA.internalID]: ['_primaryPlace'],
            },
            help_text: "Where the artwork originated.",
        },
        description: {
            display_title: "Description",
            value: {
                [apiData.CHIA.internalID]: ['description'],
                [apiData.VANDA.internalID]: null,
            },
        },
        short_description: {
            display_title: "Short Description",
            value: {
                [apiData.CHIA.internalID]: ['short_description'],
                [apiData.VANDA.internalID]: null,
            },
        },
        medium: {
            display_title: "Medium",
            value: {
                [apiData.CHIA.internalID]: ['medium_display'],
                [apiData.VANDA.internalID]: null,
            },
            help_text: "The materials used in the artwork.",
        },
        credit: {
            display_title: "Credit",
            value: {
                [apiData.CHIA.internalID]: ['credit_line'],
                [apiData.VANDA.internalID]: null,
            },
            help_text: "Acknowledgment for the artwork's acquisition by the museum.",
        },
        size: {
            display_title: "Size",
            value: {
                [apiData.CHIA.internalID]: ['dimensions'],
                [apiData.VANDA.internalID]: null,
            },
            help_text: "The dimensions of the artwork.",
        },
        type: {
            display_title: "Type",
            value: {
                [apiData.CHIA.internalID]: ['artwork_type_title'],
                [apiData.VANDA.internalID]: ['objectType'],
            },
            help_text: "The type of the artwork.",
        },
        image_id: {
            value: {
                [apiData.CHIA.internalID]: ['image_id'],
                [apiData.VANDA.internalID]: ['_primaryImageId'],
            }
        },
        item_link: {
            value: {
                [apiData.VANDA.internalID]: ['systemNumber'],
            }
        },
    }
  };
  

type Museum = keyof typeof apiData;
type MuseumArray = Array<Museum>

export const sendApiRequest = async (apiURL: string, apiURLEndpoint: string, queries: Record<string, any>) => {
    try {
        // Make the API call
        console.log('Endpoint: ', apiURL, apiURLEndpoint)
        const response = await useApiCall.get(apiURL, apiURLEndpoint, queries);
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

const getFormattedResponse = async (museum_id: string, queries: Record<string, any>) => {
    const response = await sendApiRequest(apiData[museum_id].url, apiData[museum_id].endpoints.search.endpoint, {...queries, ...apiData[museum_id].endpoints.search.required_queries});
    console.log('raw response: ', response)
    const formattedResponse: Array<object> = [];
    const responseArtworkData = response[formatResponseIndex.data_path[museum_id]];

    const resolveNestedField = (obj: any, pathArray: string[] | string): any => {
        if (Array.isArray(pathArray)) {
            const result = pathArray.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
            return result
        }
        return obj[pathArray];
    };

    responseArtworkData.forEach((responseItem) => {
        const formattedResponseItem: Record<string, any> = {};
        Object.keys(formatResponseIndex.fields).forEach((key) => {
            const responseItemPath = formatResponseIndex.fields[key].value[museum_id];
            const responseItemField = resolveNestedField(responseItem, responseItemPath);

            if (key === 'image_id') {
                formattedResponseItem.thumbnail_src = apiData[museum_id].get_image_url(200, responseItemField)
                formattedResponseItem.image_src = apiData[museum_id].get_image_url(843, responseItemField)
            } else if (responseItemField) {
                formattedResponseItem[key] = responseItemField;
            }
        });

        formattedResponse.push(formattedResponseItem);
    });

    return formattedResponse;
};

const fetchData = async(queries: Queries, museumsToSearch?: MuseumArray, ) => {
    const results = []
    if (museumsToSearch) {
        for (const museumToSearch of museumsToSearch) {
          switch (museumToSearch) {
            case 'VANDA':
              const formattedVANDAQueries = formatVandASearchFilters(queries)
              results.push(...await getFormattedResponse('VANDA', formattedVANDAQueries));
              break;
            case 'CHIA':
                const formattedCHIAQueries = formatElastisearchFilters(queries)
                console.log(formattedCHIAQueries)
              results.push(...await getFormattedResponse('CHIA', formattedCHIAQueries));
              break;
          }
        }
      } else {
        results.push(...await getFormattedResponse('VANDA', queries));
        results.push(...await getFormattedResponse('CHIA', queries));
      }
    return results
}

export default fetchData