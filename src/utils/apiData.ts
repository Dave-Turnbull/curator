const getIIIFUrl = (url: string, imageId: string, size: number) => {
    return `${url}/${imageId}/full/${size},/0/default.jpg`
}

const apiData = {
    VANDA: {
        name: "Victoria & Albert Museum",
        internalID: "VANDA",
        url: "https://api.vam.ac.uk/v2",
        endpoints: {
            search: {
                endpoint: "objects/search",
                required_queries: {},
            },
            object: {
                endpoint: "/object",
                required_queries: {
                    // limit: 20
                },
            }
        },
        required_queries: {},
        get_image_url: (size: number, id: string) => getIIIFUrl('https://framemark.vam.ac.uk/collections/', id, size),
    },
    CHIA: {
        name: "Chicago Institute of Art",
        internalID: "CHIA",
        url: "https://api.artic.edu/api/v1",
        endpoints: {
            search: {
                endpoint: "/artworks/search",
                required_queries: {
                    fields: "id,title,image_id,thumbnail,api_link,artist_display,date_display,place_of_origin,medium_display,credit_line,dimensions,description,short_description,is_public_domain",
                    limit: 15,
                }
            },
        },
        get_image_url: (size: number, id: string) => getIIIFUrl('https://www.artic.edu/iiif/2/', id, size),
    }
}

export default apiData