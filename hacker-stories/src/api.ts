export interface Stories {
    title: string;
    url: string;
    author: string;
    num_comments: number;
    points: number;
    objectID: number;
}

export interface StoriesResponse {
    data: {
        stories: Stories[]
    }
}

const stories: Stories[] = [
    {
        title: 'React',
        url: 'http://reactjs.org/',
        author: 'Jordan Walke',
        num_comments: 3,
        points: 4,
        objectID: 0
    },
    {
        title: 'Redux',
        url: 'https://redux.js.org/',
        author: 'Dan Abramov, Andrew Clark',
        num_comments: 2,
        points: 5,
        objectID: 1
    }
]


export const getAsyncStories = (): Promise<StoriesResponse> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                data: {
                    stories
                }
            })
        }, 1200)
    })
}

export const deleteAsyncStories = (objectIDToDelete: number, currentStories: Stories[]): Promise<StoriesResponse> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!currentStories.find(({ objectID }) => objectID == objectIDToDelete)) {
                reject(`Could not delete Story with ID: ${objectIDToDelete}`)
            } else {
                const stories = currentStories.filter(({ objectID }) => objectID != objectIDToDelete)
                resolve({
                    data: {
                        stories
                    }
                })
            }
        }, 1000)
    })
}

export const editAsyncStory = (story: Stories, currentStories: Stories[]): Promise<StoriesResponse> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!currentStories.find(({ objectID }) => objectID == story.objectID)) {
                reject(`Could not update Story with ID: ${story.objectID}`)
            } else {
                const newStories: Stories[] = []
                currentStories.forEach(curStory => {
                    newStories.push(curStory.objectID == story.objectID ? story : curStory)
                });
                resolve({
                    data: {
                        stories: newStories
                    }
                })
            }
        }, 1000)
    })
}

export const addAsyncStory = (story: Stories, currentStories: Stories[]): Promise<StoriesResponse> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (currentStories.find(({ objectID }) => objectID == story.objectID)) {
                reject(`Story with ID: ${story.objectID} is already present in the collection`)
            } else {
                resolve({
                    data: {
                        stories: [...currentStories, story]
                    }
                })
            }
        }, 1000)
    })
}
