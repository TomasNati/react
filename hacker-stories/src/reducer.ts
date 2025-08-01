import type { Stories } from "./api";

type ACTION_TYPE = 'SET_STORIES' | 'SET_ASYNC_MESSAGE' | 'CLEAR_ASYNC_MESSAGE'

interface StoriesState {
    stories: Stories[];
    asyncMessage: string;
}

interface ReducerAction {
    type: ACTION_TYPE;
    payload: Stories[] | string | undefined;
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
        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }
}
