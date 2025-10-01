import type { Stories, StoriesUI } from "./api"


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


export const getAsyncStories = (): Promise<StoriesUI> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                data: stories,
                page: 0,
                totalPages: 1
            })
        }, 1200)
    })
}

export const deleteAsyncStories = (objectIDToDelete: number, currentStories: Stories[]): Promise<StoriesUI> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!currentStories.find(({ objectID }) => objectID == objectIDToDelete)) {
                reject(`Could not delete Story with ID: ${objectIDToDelete}`)
            } else {
                const stories = currentStories.filter(({ objectID }) => objectID != objectIDToDelete)
                resolve({
                    data: stories,
                    page: 0,
                    totalPages: 1
                })
            }
        }, 1000)
    })
}

export const editAsyncStory = (story: Stories, currentStories: Stories[]): Promise<StoriesUI> => {
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
                    data: newStories,
                    page: 0,
                    totalPages: 1
                })
            }
        }, 1000)
    })
}

export const addAsyncStory = (story: Stories, currentStories: Stories[]): Promise<StoriesUI> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (currentStories.find(({ objectID }) => objectID == story.objectID)) {
                reject(`Story with ID: ${story.objectID} is already present in the collection`)
            } else {
                resolve({
                    data: [...currentStories, story],
                    page: 0,
                    totalPages: 1
                })
            }
        }, 1000)
    })
}
