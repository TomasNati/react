import { describe, it, expect, vi } from "vitest";
import App from "./App";
import { ItemList } from "./List";
import { storiesReducer, type StoriesState } from "./reducer";
import { SimpleForm, type SimpleFormProps } from "./SimpleForm";
import { type Stories} from "./api";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from "axios";

vi.mock('axios')

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
            unsortedStories: [...stories],
            sortStatus: [ { field: 'title', ascending: true } ],
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
            unsortedStories: [...stories],
            sortStatus: [ { field: 'title', ascending: true } ],
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

describe('ItemList', () => {
    it('render all properties', () => {
        render(<ItemList {...stories[0]} onEditClicked={() => { }} onRemoveClicked={() => { }} />)
        expect(screen.getByText('Authors: Jordan Walke')).toBeInTheDocument();
        expect(screen.getByText('React')).toHaveAttribute('href', 'http://reactjs.org/')
    });

    it('render clickable butons', () => {
        render(<ItemList {...stories[0]} onEditClicked={() => { }} onRemoveClicked={() => { }} />)
        expect(screen.getAllByRole('button')).toHaveLength(2);
    })

    it('clicking the Dismiss button calls the callback handler', () => {
        const handleRemoveButton = vi.fn();
        render(<ItemList {...stories[0]} onEditClicked={() => { }} onRemoveClicked={handleRemoveButton} />)
        const dismissButton = screen.getByRole('button', { name: '' });
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
        fireEvent.change(screen.getByLabelText(/Search/), { target: { value: 'Redux' } });
        expect(simpleFormProps.handleSearchTermChanged).toHaveBeenCalledTimes(1);
        expect(simpleFormProps.handleSearchTermChanged).toHaveBeenCalledWith('Redux');
    })

    it('calls handleTriggerSearch on submit', () => {
        render(<SimpleForm {...simpleFormProps} />);
        fireEvent.submit(screen.getByRole('button'));
        expect(simpleFormProps.handleTriggerSearch).toHaveBeenCalledTimes(1);
    })
})

describe('App', () => {

    it('succeeds fetching data', async () => {
        const promise = Promise.resolve({
            status: 200,
            data: {
                hits: stories
            }
        })

        vi.mocked(axios.get).mockImplementationOnce(() => promise);
        render(<App />);
        expect(screen.queryByText(/Loading/)).toBeInTheDocument()

        await waitFor(async () => await promise);
        expect(screen.queryByText(/Loading/)).toBeNull();
        expect(screen.queryByText('React')).toBeInTheDocument();
        expect(screen.queryByText('Redux')).toBeInTheDocument();
        expect(screen.queryAllByText('Edit')).toHaveLength(2);
    })

    it('fails fetching data -', async () => {
        const promise = Promise.resolve({
            status: 500,
            error: {
                message: 'Internal server error found'
            }
        })

        vi.mocked(axios.get).mockImplementationOnce(() => promise);
        render(<App />);
        try {
            await waitFor(async () => await promise);
        } catch (error) {
            expect(screen.queryByText(/There was an error/)).toBeInTheDocument();
        }
    })

    it('fails fetching data - Unexpected axios error', async () => {
        const promise = Promise.reject({
            status: 500,
            error: {
                message: 'Internal server error found'
            }
        })

       vi.mocked(axios.get).mockImplementationOnce(() => promise);
        render(<App />);
        try {
            await waitFor(async () => await promise);
        } catch (error) {
            expect(screen.queryByText(/There was an error/)).toBeInTheDocument();
        }
    })

    it.only('removes an item from the list', async () => {
        const promise = Promise.resolve({
            status: 200,
            data: {
                hits: stories
            }
        })

        vi.mocked(axios.get).mockImplementationOnce(() => promise);
        render(<App />);

        await waitFor(async () => await promise);
        expect(screen.queryByText('React')).toBeInTheDocument();
        const firstRemoveButton = screen.getAllByRole('button', { name: '' })[0]
        fireEvent.click(firstRemoveButton)
        expect(screen.queryByText('React')).not.toBeInTheDocument();
    })

    it('searches again when clickingn submit button', async () => {
        const promiseInitialFetch = Promise.resolve({
            status: 200,
            data: {
                hits: stories
            }
        })

        const newStory: Stories = {
            author: 'Andrés Asteasuain',
            num_comments: 10,
            objectID: 505,
            points: 4,
            title: 'Pruebas de Tests',
            url: 'www.nba.com'
        }

        const promiseSecondFetch = Promise.resolve({
            status: 200,
            data: {
                hits: [newStory]
            }
        })

         vi.mocked(axios.get).mockImplementation((url: string) => {
            if (url.includes('React')) {
                return promiseInitialFetch
            } else if (url.includes('Andrés')) {
                return promiseSecondFetch
            }
            throw Error('Invalid url to mock')
        });
        render(<App />);

        await waitFor(async () => await promiseInitialFetch);
        expect(screen.queryByText('React')).toBeInTheDocument();
        expect(screen.queryByText('Redux')).toBeInTheDocument();
        expect(screen.queryByText(/Pruebas/)).toBeNull();

        const searchTermInput = screen.getByLabelText(/Search Term/)
        fireEvent.change(searchTermInput, {
            target: { value: 'Andrés Asteasuain' }
        })

        fireEvent.click(screen.getByRole('button', { name: 'Search' }))
        await waitFor(async () => await promiseSecondFetch);
        expect(screen.queryByText('React')).toBeNull();
        expect(screen.queryByText('Redux')).toBeNull();
        expect(screen.queryByText(/Pruebas/)).toBeInTheDocument();

    })
})
