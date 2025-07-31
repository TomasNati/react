import type { Stories } from "./api";

type ACTION_TYPE = 'SET_STORIES'

interface StoriesState {
    stories: Stories[];
    asyncMessage: string;
}

interface ReducerAction {
    type: ACTION_TYPE;
    payload: Stories[] | string;
}

export const storiesReducer = (state: StoriesState, action: ReducerAction): StoriesState => {
    switch (action.type) {
        case 'SET_STORIES':
            return { ...state, stories: action.payload as Stories[] };
        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }
}
