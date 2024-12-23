export interface Queries {
    search_titles?: string|null;
    search_all?: string|null;
    date?: {
      from?: number|null;
      to?: number|null;
    };
    creator?: string|null;
  }



// const searchQueryIndex = {
//     search_titles: {
//         [apiData.CHIA.internalID]: 'q',
//         [apiData.VANDA.internalID]: 'search',
//     },
//     search_all: {
//         [apiData.CHIA.internalID]: '',
//         [apiData.VANDA.internalID]: 'q',
//     },
//     date: {
//         [apiData.CHIA.internalID]: '',
//         [apiData.VANDA.internalID]: '',
//     },
//     creator: {
//         [apiData.CHIA.internalID]: '',
//         [apiData.VANDA.internalID]: '',
//     },
//     type: {
//         [apiData.CHIA.internalID]: '',
//         [apiData.VANDA.internalID]: '',
//     },
//     origin: {
//         [apiData.CHIA.internalID]: '',
//         [apiData.VANDA.internalID]: '',
//     }
// }
export const formatVandASearchFilters = (queries: Queries) => {
    const formattedQueries = {}
    Object.keys(queries).forEach(key => {
        if (queries[key]){
        switch (key) {
            case 'search_titles':
                formattedQueries.q = queries[key]
                break;
            case 'search_all':
                formattedQueries.search = queries[key]
                break;
            case 'date':
                if (queries[key].from) formattedQueries.year_made_from = queries[key].from
                if (queries[key].to) formattedQueries.year_made_to = queries[key].to
                break;
            case 'creator':
                formattedQueries.q_actor = queries[key]
                break;
          }
        }
    })
    return formattedQueries
}

export const formatElastisearchFilters = (queries: object) => {
    const formattedQueries = {query: {bool: {filter: []}}}
    const filterArray: Array<any> = formattedQueries.query.bool.filter
    Object.keys(queries).forEach(key => {
        if (queries[key]){
        switch (key) {
            case 'search_titles':
                filterArray.push({wildcard: {title: {value: `*${queries[key]}*`}}})
                break;
            case 'search_all':
                formattedQueries.q = queries[key]
                break;
            case 'date':
                if (queries.date.to || queries.date.from){
                filterArray.push({range: {date_display: {gte: `*${queries[key].from}*`, lte: `*${queries[key].to}*`}}})
                }
                break;
            case 'creator':
                filterArray.push({wildcard: {artist_display: {value: `*${queries[key]}*`}}})
                break;
          }
        }
    })
    return formattedQueries
}

