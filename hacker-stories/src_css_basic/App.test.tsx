import { describe, it, expect, vi } from "vitest";
import App, { List, ItemList } from "./App";
import { storiesReducer, StoriesState } from "./reducer";
import { SimpleForm, InputWithLabel, SimpleFormProps } from "./SimpleForm";
import { Stories } from "./api";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

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

describe('ItemList', ()=> {
    it('render all properties', ()=> {
        render(<ItemList {...stories[0]} onEditClicked={() => {}} onRemoveClicked={() => {}} />)
        expect(screen.getByText('Authors: Jordan Walke')).toBeInTheDocument();
        expect(screen.getByText('React')).toHaveAttribute('href', 'http://reactjs.org/')
    });

    it('render clickable butons', () => {
        render(<ItemList {...stories[0]} onEditClicked={() => {}} onRemoveClicked={() => {}} />)
        expect(screen.getAllByRole('button')).toHaveLength(2);
    })

    it('clicking the Dismiss button calls the callback handler', () =>{
        const handleRemoveButton = vi.fn();
        render(<ItemList {...stories[0]} onEditClicked={() => {}} onRemoveClicked={handleRemoveButton} />)
        const dismissButton = screen.getByRole('button', {name: ''});
        fireEvent.click(dismissButton);
        expect(handleRemoveButton).toHaveBeenCalledTimes(1);
    })
})

describe('SimpleForm', () => {
    const simpleFormProps: SimpleFormProps = {
        handleSearchTermChanged: vi.fn(),
        handleTriggerSearch: vi.fn(),
        searchTerm: 'React'
    }

    it('render all properties', () => {
        render(<SimpleForm {...simpleFormProps} />);
        expect(screen.getByDisplayValue('React')).toBeInTheDocument();
        expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
    })

    it('calls handleSearchTermChanged on input field change', () => {
        render(<SimpleForm {...simpleFormProps} />);
        fireEvent.change(screen.getByLabelText(/Search/), { target: {value: 'Redux'}});
        expect(simpleFormProps.handleSearchTermChanged).toHaveBeenCalledTimes(1);
        expect(simpleFormProps.handleSearchTermChanged).toHaveBeenCalledWith('Redux');
    })

    it('calls handleTriggerSearch on submit', () => {
        render(<SimpleForm {...simpleFormProps} />);
        fireEvent.submit(screen.getByRole('button'));
        expect(simpleFormProps.handleTriggerSearch).toHaveBeenCalledTimes(1);
    })
})
