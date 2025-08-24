import { describe, it, expect } from "vitest";
import App, { List, ItemList } from "./App";
import { storiesReducer, StoriesState } from "./reducer";
import { SimpleForm, InputWithLabel } from "./SimpleForm";
import { Stories } from "./api";

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

describe('something truthy and falsy', () => {
    it('true to be true', () => {
        expect(true).toBeTruthy();
    })

    it('false to be false', () => {
        expect(false).toBeFalsy();
    })
})

describe('storiesReducer', () => {
    it('removes a story from all stories - start', () => {
        const state: StoriesState = {
            stories: [...stories],
            asyncMessage: '',
            storyToEdit: undefined,
            showForm: false
        }
        const newState = storiesReducer(state, {
            type: 'DELETE_STORY_START',
            payload: 'Deleting a Story'
        })

        expect(newState.stories).toEqual(stories);
        expect(newState.asyncMessage).toBe('Deleting a Story')
    })

    it('removes a story from all stories - end', () => {
        const state: StoriesState = {
            stories: [...stories],
            asyncMessage: '',
            storyToEdit: undefined,
            showForm: false
        }
        const newState = storiesReducer(state, {
            type: 'DELETE_STORY_COMPLETE',
            payload: state.stories
        })

        expect(newState.stories).toEqual(stories);
        expect(newState.asyncMessage).toBe('')
    })
})