import type { Stories } from "./api-fake";

type ACTION_TYPE =
    'FETCH_STORIES_START' |
    'FETCH_STORIES_COMPLETE' |
    'DELETE_STORY_START' |
    'DELETE_STORY_COMPLETE' |
    'EDIT_STORY_START' |
    'EDIT_STORY_PROCESSING' |
    'EDIT_STORY_COMPLETE' |
    'ADD_STORY_START' |
    'ADD_STORY_PROCESSING' |
    'ADD_STORY_COMPLETE' |
    'SET_ERROR' |
    'CLEAR_ERROR' |
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
        case 'FETCH_STORIES_START':
        case 'DELETE_STORY_START':
        case 'EDIT_STORY_PROCESSING':
        case 'ADD_STORY_PROCESSING':
            return {
                ...state,
                asyncMessage: action.payload as string,
            }
        case 'FETCH_STORIES_COMPLETE':
        case 'DELETE_STORY_COMPLETE':
        case 'EDIT_STORY_COMPLETE':
        case 'ADD_STORY_COMPLETE':
            return {
                ...state,
                asyncMessage: '',
                stories: action.payload as Stories[]
            };
        case 'SET_ERROR':
            return {
                ...state,
                asyncMessage: action.payload as string
            }
        case 'CLEAR_ERROR':
            return {
                ...state,
                asyncMessage: ''
            }
        case 'EDIT_STORY_START':
            if (!action.payload) {
                throw new Error('No Story to edit')
            }
            return {
                ...state,
                storyToEdit: action.payload as Stories,
                showForm: true
            }
        case 'ADD_STORY_START':
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
