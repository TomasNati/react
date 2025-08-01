import type { Stories } from "./api";

type ACTION_TYPE =
    'SET_STORIES' |
    'SET_ASYNC_MESSAGE' |
    'CLEAR_ASYNC_MESSAGE' |
    'SET_EDIT_STORY' |
    'SET_ADD_STORY' |
    'CLOSE_STORY_FORM'

interface StoriesState {
    stories: Stories[];
    asyncMessage: string;
    storyToEdit: Stories | undefined;
    showForm: boolean
}

interface ReducerAction {
    type: ACTION_TYPE;
    payload: Stories[] | Stories | string | undefined;
}

export const storiesReducer = (state: StoriesState, action: ReducerAction): StoriesState => {
    switch (action.type) {
        case 'SET_STORIES':
            return {
                ...state,
                asyncMessage: '',
                stories: action.payload as Stories[]
            };
        case 'SET_ASYNC_MESSAGE':
            return {
                ...state,
                asyncMessage: action.payload as string
            }
        case 'CLEAR_ASYNC_MESSAGE':
            return {
                ...state,
                asyncMessage: ''
            }
        case 'SET_EDIT_STORY':
            if (!action.payload) {
                throw new Error('No Story to edit')
            }
            return {
                ...state,
                storyToEdit: action.payload as Stories,
                showForm: true
            }
        case 'SET_ADD_STORY':
            return {
                ...state,
                storyToEdit: undefined,
                showForm: true
            }
        case 'CLOSE_STORY_FORM':
            return {
                ...state,
                storyToEdit: undefined,
                showForm: false
            }
        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }
}
