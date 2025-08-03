const BASE_URL = 'https://hn.algolia.com/api/v1/'

export interface Stories {
    title: string;
    url: string;
    author: string;
    num_comments: number;
    points: number;
    objectID: number;
}

export interface StoriesUI {
    data: {
        stories: Stories[]
    }
}

export interface StoriesResponse {
    hits: Stories[]
}


export const getAsyncStories = (): Promise<StoriesUI> => {
    return new Promise(async (resolve, reject) => {
        const getUrl = `${BASE_URL}search?query=react`
        const fetchResult = await fetch(getUrl)
        if (fetchResult.ok) {
            const response: StoriesResponse = await fetchResult.json()
            resolve({
                data: {
                    stories: response.hits
                }
            })
        } else {
            reject(`Invalid response: ${fetchResult.status}`)
        }
    })
}
